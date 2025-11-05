#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const cacheDir = path.join(cwd, '.cache');
const buildDir = path.join(cacheDir, 'link-check-build');
const keepBuildDir = process.env.CHECK_LINKS_KEEP === '1';
const skipExternal = process.env.CHECK_LINKS_EXTERNAL === '0';

fs.mkdirSync(cacheDir, {recursive: true});
fs.rmSync(buildDir, {recursive: true, force: true});

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (typeof result.status === 'number' && result.status !== 0) {
    process.exit(result.status);
  }
}

function resolveBin(name) {
  const suffix = process.platform === 'win32' ? '.cmd' : '';
  const candidate = path.join(cwd, 'node_modules', '.bin', `${name}${suffix}`);
  return fs.existsSync(candidate) ? candidate : null;
}

function runTool(name, args, {allowNpx = true} = {}) {
  const bin = resolveBin(name);
  if (bin) {
    run(bin, args);
    return;
  }
  if (!allowNpx) {
    throw new Error(`Unable to locate ${name} in node_modules/.bin and npx usage disabled.`);
  }
  run('npx', ['--yes', name, ...args]);
}

runTool('docusaurus', ['build', '--out-dir', buildDir, '--no-minify'], {allowNpx: false});

if (!skipExternal) {
  const linkinatorArgs = [buildDir, '--recurse'];
  const configPath = path.join(cwd, '.linkinator.json');
  if (fs.existsSync(configPath)) {
    linkinatorArgs.push('--config', configPath);
  } else {
    linkinatorArgs.push('--skip', 'mailto:,tel:,javascript:,data:,geo:');
  }
  runTool('linkinator', linkinatorArgs);
}

if (!keepBuildDir) {
  fs.rmSync(buildDir, {recursive: true, force: true});
}
