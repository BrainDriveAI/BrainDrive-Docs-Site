#!/usr/bin/env node
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const cwd = process.cwd();
const cacheDir = path.join(cwd, '.cache');
const buildDir = path.join(cacheDir, 'link-check-build');
const keepBuildDir = process.env.CHECK_LINKS_KEEP === '1';
const skipExternal = process.env.CHECK_LINKS_EXTERNAL === '0';
const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

fs.mkdirSync(cacheDir, {recursive: true});
fs.rmSync(buildDir, {recursive: true, force: true});

async function run(command, args, options = {}) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: false,
      ...options,
    });

    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`${command} exited due to signal ${signal}`));
      } else if (typeof code === 'number' && code !== 0) {
        reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

function resolveBin(name) {
  const suffix = process.platform === 'win32' ? '.cmd' : '';
  const candidate = path.join(cwd, 'node_modules', '.bin', `${name}${suffix}`);
  return fs.existsSync(candidate) ? candidate : null;
}

async function runTool(name, args, {allowNpx = true} = {}) {
  const bin = resolveBin(name);
  if (bin) {
    await run(bin, args);
    return;
  }
  if (!allowNpx) {
    throw new Error(`Unable to locate ${name} in node_modules/.bin and npx usage disabled.`);
  }
  await run('npx', ['--yes', name, ...args]);
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

async function maybeStat(filePath) {
  try {
    return await fs.promises.stat(filePath);
  } catch {
    return null;
  }
}

async function resolveRequestFile(rootDir, requestPath) {
  const safeRoot = path.resolve(rootDir);
  const normalizedPath = path.posix.normalize(requestPath).replace(/^(\.\.(\/|\\|$))+/, '');
  const trimmedPath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
  const candidatePath = path.join(safeRoot, trimmedPath);
  let candidate = path.normalize(candidatePath);

  const relative = path.relative(safeRoot, candidate);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Path outside of root');
  }

  let stat = await maybeStat(candidate);
  if (stat?.isDirectory()) {
    const indexPath = path.join(candidate, 'index.html');
    const indexStat = await maybeStat(indexPath);
    if (indexStat?.isFile()) {
      return indexPath;
    }
  }

  if (stat?.isFile()) {
    return candidate;
  }

  if (!path.extname(candidate)) {
    const indexPath = path.join(candidate, 'index.html');
    const indexStat = await maybeStat(indexPath);
    if (indexStat?.isFile()) {
      return indexPath;
    }
  }

  throw new Error('Not found');
}

async function startStaticServer(rootDir) {
  const server = http.createServer(async (req, res) => {
    if (!req.url) {
      res.statusCode = 400;
      res.end();
      return;
    }

    const {pathname} = new URL(req.url, 'http://localhost');
    let decodedPathname = pathname;
    try {
      decodedPathname = decodeURIComponent(pathname);
    } catch {
      // Best-effort; keep original encoded path on failure.
    }

    try {
      const filePath = await resolveRequestFile(rootDir, decodedPathname);
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Content-Type', contentType(filePath));
      const stream = fs.createReadStream(filePath);
      stream.on('error', () => {
        res.statusCode = 500;
        res.end('Failed to read file');
      });
      stream.pipe(res);
    } catch {
      res.statusCode = 404;
      res.end('Not found');
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });

  const {port} = server.address();
  return {
    server,
    port,
  };
}

async function stopServer(server) {
  await new Promise((resolve) => server.close(resolve));
}

async function runLinkinator(targetUrl) {
  const linkinatorArgs = [targetUrl, '--recurse'];
  const configPath = path.join(cwd, '.linkinator.json');
  if (fs.existsSync(configPath)) {
    linkinatorArgs.push('--config', configPath);
  } else {
    linkinatorArgs.push('--skip', 'mailto:,tel:,javascript:,data:,geo:');
  }
  await runTool('linkinator', linkinatorArgs);
}

async function main() {
  await runTool('docusaurus', ['build', '--out-dir', buildDir, '--no-minify'], {allowNpx: false});

  if (!skipExternal) {
    const {server, port} = await startStaticServer(buildDir);
    const targetUrl = `http://127.0.0.1:${port}`;

    try {
      await runLinkinator(targetUrl);
    } finally {
      await stopServer(server);
    }
  }

  if (!keepBuildDir) {
    fs.rmSync(buildDir, {recursive: true, force: true});
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
