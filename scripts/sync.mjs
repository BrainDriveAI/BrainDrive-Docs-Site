import {execSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const tmp = path.join(cwd, '.cache', 'sources');

const sources = [
  { key: 'core',                 repo: 'BrainDriveAI/BrainDrive-Core',                 dest: 'docs-core',                                      prefer: ['docs','root'] },
  { key: 'template',             repo: 'BrainDriveAI/PluginTemplate',                  dest: 'docs-template',                                  prefer: ['docs','root'] },
  { key: 'chat-plugin',          repo: 'BrainDriveAI/BrainDrive-Chat-Plugin',          dest: 'docs-plugins/brain-drive-chat-plugin',          prefer: ['docs','root'], ensureIntro: false },
  { key: 'settings-plugin',      repo: 'BrainDriveAI/BrainDrive-Settings-Plugin',      dest: 'docs-plugins/brain-drive-settings-plugin',      prefer: ['docs','root'], ensureIntro: false },
  { key: 'ollama-plugin',        repo: 'BrainDriveAI/BrainDrive-Ollama-Plugin',        dest: 'docs-plugins/brain-drive-ollama-plugin',        prefer: ['docs','root'], ensureIntro: false },
  { key: 'openrouter-plugin',    repo: 'BrainDriveAI/BrainDrive-Openrouter-Plugin',    dest: 'docs-plugins/brain-drive-openrouter-plugin',    prefer: ['docs','root'], ensureIntro: false },
];

// Additional files that should always exist in the destination even after syncing
const shimTemplates = {
  core: [
    {
      path: 'INSTALL.mdx',
      content: ({destDir}) => {
        const installCandidates = [
          path.join('getting-started', 'install.mdx'),
          path.join('getting-started', 'install.md'),
          path.join('docs', 'getting-started', 'install.mdx'),
          path.join('docs', 'getting-started', 'install.md'),
        ];

        const installSource = findExistingFile(destDir, installCandidates);
        const header =
          `---\n` +
          `title: Install BrainDrive-Core\n` +
          `---\n\n`;

        if (!installSource) {
          return (
            header +
            `We could not automatically locate the install guide inside BrainDrive-Core.\n\n` +
            `Please refer to the latest instructions in the BrainDrive-Core repository:\n` +
            `[https://github.com/BrainDriveAI/BrainDrive-Core](https://github.com/BrainDriveAI/BrainDrive-Core)\n`
          );
        }

        const normalized = installSource.replace(/\\/g, '/');
        const importPath = normalized.startsWith('.') || normalized.startsWith('/')
          ? normalized
          : `./${normalized}`;

        return (
          header +
          `import InstallDoc from '${importPath}';\n\n` +
          `<InstallDoc />\n`
        );
      },
    },
  ],
  'chat-plugin': [
    {
      path: '_category_.json',
      content: JSON.stringify(
        {
          label: 'BrainDrive-Chat-Plugin',
          position: 3,
          collapsible: true,
          collapsed: true,
        },
        null,
        2,
      ) + '\n',
    },
  ],
  'settings-plugin': [
    {
      path: '_category_.json',
      content: JSON.stringify(
        {
          label: 'BrainDrive-Settings-Plugin',
          position: 2,
          collapsible: true,
          collapsed: true,
        },
        null,
        2,
      ) + '\n',
    },
  ],
  'ollama-plugin': [
    {
      path: '_category_.json',
      content: JSON.stringify(
        {
          label: 'BrainDrive-Ollama-Plugin',
          position: 4,
          collapsible: true,
          collapsed: true,
        },
        null,
        2,
      ) + '\n',
    },
  ],
  'openrouter-plugin': [
    {
      path: '_category_.json',
      content: JSON.stringify(
        {
          label: 'BrainDrive-OpenRouter-Plugin',
          position: 5,
          collapsible: true,
          collapsed: true,
        },
        null,
        2,
      ) + '\n',
    },
  ],
};

const extraCopies = {
  core: [{src: 'images', dest: 'images'}],
};

const rootDocImports = {
  core: [
    {
      target: 'ROADMAP.md',
      sources: ['ROADMAP.md'],
    },
    {
      target: 'CONTRIBUTING.md',
      sources: ['CONTRIBUTING.md'],
    },
    {
      target: 'README.md',
      sources: ['README.md'],
    },
  ],
};

const allow = new Set(['.md','.mdx','.png','.jpg','.jpeg','.gif','.svg','.webp','.bmp','.pdf']);

// Files to exclude from syncing (keep in source repos but don't publish to docs site)
const excludeFiles = new Set(['PLUGIN_SUMMARY.md']);

function findExistingFile(baseDir, candidates) {
  for (const candidate of candidates) {
    const candidatePath = path.join(baseDir, candidate);
    if (fs.existsSync(candidatePath)) {
      return candidate.replace(/\\/g, '/');
    }
  }
  return null;
}

function sh(cmd){ execSync(cmd, {stdio:'inherit'}); }

function copyTreeFiltered(src, dest){
  const st = fs.statSync(src);
  if (st.isDirectory()){
    if (path.basename(src) === '.git') return;
    fs.mkdirSync(dest, {recursive:true});
    for (const name of fs.readdirSync(src)) copyTreeFiltered(path.join(src,name), path.join(dest,name));
  } else {
    const filename = path.basename(src);
    if (excludeFiles.has(filename)) return;
    const ext = path.extname(src).toLowerCase();
    if (allow.has(ext)){
      fs.mkdirSync(path.dirname(dest), {recursive:true});
      fs.copyFileSync(src, dest);
    }
  }
}

function sanitizeLineOutsideBackticks(line, repoName, repoFull){
  const parts = line.split(/(`+[^`]*`+)/g);
  for (let i=0; i<parts.length; i++){
    const seg = parts[i];
    if (!seg || seg.startsWith('`')) continue;

    let s = seg;

    // Escape "<" that doesn't start a valid HTML/MDX tag
    s = s.replace(/<([^A-Za-z$_!\/\?])/g, '&lt;$1');

    // Remove attribute blocks after links/images: "](...){...}" or "!(...){...}"
    s = s.replace(/\)\{[^}]*\}/g, ')');

    // Remove Kramdown attribute lists: "{: ...}", "{#id}", "{.class}"
    s = s.replace(/\{:[^}]*\}/g, '').replace(/\{[#.][^}]*\}/g, '');

    // Remove any remaining attribute-like "{...}" that likely contains attributes
    s = s.replace(/\{[^{}\n]*=(?:[^{}\n]*)\}/g, '')
         .replace(/\{[^{}\n]*(?:label|target|rel|role|data-[^=]*)[^{}\n]*\}/gi, '');

    // Normalize bare community URL to https://
    s = s.replace(/\]\((?:https?:\/\/)?community\.braindrive\.ai/gi, '](https://community.braindrive.ai');

    if (repoFull) {
      const licenseUrl = `https://github.com/${repoFull}/blob/main/LICENSE`;
      s = s.replace(/\]\((?:\.{0,2}\/)?LICENSE\)/gi, `](${licenseUrl})`);
    }

    // Rewrite stale absolute doc prefixes: "docs/repos/<RepoName>/..."
    const reRepo = new RegExp(`docs\\/repos\\/${repoName.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\/`, 'g');
    s = s.replace(reRepo, '');

    // Repo-specific fixes
    if (repoName === 'BrainDrive-Core') {
      // LICENSE and ../LICENSE -> link to GitHub blob
      s = s.replace(/\]\((?:\.{1,2}\/)?LICENSE\)/g, '](https://github.com/BrainDriveAI/BrainDrive-Core/blob/main/LICENSE)');

      // Update renamed docs to their new locations
      s = s
        .replace(/\.\.\/\.\.\/images\//g, '../images/')
        .replace(/https?:\/\/docs\.braindrive\.ai\/core\/OWNER_USER_GUIDE/gi, 'https://docs.braindrive.ai/core/concepts/plugins')
        .replace(/\/core\/OWNER_USER_GUIDE/gi, '/core/concepts/plugins')
        .replace(/https?:\/\/docs\.braindrive\.ai\/core\/PLUGIN_DEVELOPER_QUICKSTART/gi, 'https://docs.braindrive.ai/core/getting-started/plugin-developer-quickstart')
        .replace(/\]\((?:\.\/)?DEVELOPER_QUICK_START\)/gi, '](https://github.com/BrainDriveAI/BrainDrive-Core/blob/main/docs/getting-started/plugin-developer-quickstart.md)')
        .replace(/\]\((?:\.\/)?DOCUMENTATION_INDEX\)/gi, '](https://github.com/BrainDriveAI/BrainDrive-Core/blob/main/DOCUMENTATION_INDEX.md)')
        .replace(/\/core\/PLUGIN_DEVELOPER_QUICKSTART/gi, '/core/getting-started/plugin-developer-quickstart')
        .replace(/\.\.\/INSTALL\.md/gi, './getting-started/install.md')
        .replace(/\(\/docs\/getting-started\/install\.md\)/gi, '(/core/getting-started/install)')
        .replace(/\(\/docs\/getting-started\/plugin-developer-quickstart\.md\)/gi, '(/core/getting-started/plugin-developer-quickstart)')
        .replace(/\(\/docs\/how-to\/use-service-bridges\.md\)/gi, '(/core/how-to/use-service-bridges)')
        .replace(/https?:\/\/docs\.braindrive\.ai\/core\/ROADMAP/gi, 'https://community.braindrive.ai/t/braindrive-development-progress-updates/92')
        .replace(/\/core\/ROADMAP/gi, 'https://community.braindrive.ai/t/braindrive-development-progress-updates/92')
        .replace(/\[\*\*Service Bridges\*\*\]\(\)/g, '[**Service Bridges**](https://docs.braindrive.ai/services/intro)')
        .replace(/\]\((?:\.{1,2}\/)?SECURITY\.md\)/g, '](https://github.com/BrainDriveAI/BrainDrive-Core/blob/main/SECURITY.md)')
        .replace(/\]\((?:\.{1,2}\/)?frontend\/README\.md\)/gi, '](https://github.com/BrainDriveAI/BrainDrive-Core/blob/main/frontend/README.md)')
        .replace(/\]\((?:\.{1,2}\/)?backend\/README\.md\)/gi, '](https://github.com/BrainDriveAI/BrainDrive-Core/blob/main/backend/README.md)');
    }
    if (repoName === 'PluginTemplate') {
      s = s
        .replace(/\]\(\.\/DEVELOPMENT\.md\)/g, '](https://github.com/BrainDriveAI/PluginTemplate/blob/main/DEVELOPMENT.md)')
        .replace(/\]\(\.\/Plugin-Template-Plan\.md\)/g, '](https://github.com/BrainDriveAI/PluginTemplate/blob/main/Plugin-Template-Plan.md)')
        .replace(/\]\(\.\.\/PluginBuild\/PluginTemplate\/DEVELOPMENT\.md\)/g, '](https://github.com/BrainDriveAI/PluginTemplate/blob/main/PluginBuild/PluginTemplate/DEVELOPMENT.md)')
        .replace(/\]\(\.\/Service-Integration-Guide\.md\)/g, '](https://github.com/BrainDriveAI/PluginTemplate/blob/main/Service-Integration-Guide.md)');
    }

    parts[i] = s;
  }
  return parts.join('');
}

function sanitizeMDX(destDir, repo){
  const repoName = repo.split('/').pop();
  const repoFull = repo;
  const files = [];
  (function walk(d){
    for (const name of fs.readdirSync(d)){
      const p = path.join(d,name);
      const st = fs.statSync(p);
      if (st.isDirectory()) walk(p);
      else if (/\.(md|mdx)$/i.test(name)) files.push(p);
    }
  })(destDir);

  for (const p of files){
    let txt = fs.readFileSync(p,'utf8');
    const lines = txt.split('\n');
    let inFence = false;
    for (let i=0; i<lines.length; i++){
      const fence = lines[i].match(/^\s*(`{3,}|~{3,})/);
      if (fence){ inFence = !inFence; continue; }
      if (!inFence) lines[i] = sanitizeLineOutsideBackticks(lines[i], repoName, repoFull);
    }
    fs.writeFileSync(p, lines.join('\n'));
  }
}

fs.rmSync(tmp, {recursive:true, force:true});
fs.mkdirSync(tmp, {recursive:true});

for (const s of sources){
  const target = path.join(tmp, s.key);
  const repoUrl = process.env.GH_TOKEN ? `https://${process.env.GH_TOKEN}@github.com/${s.repo}.git` : `https://github.com/${s.repo}.git`;
  try { sh(`git clone --depth=1 ${repoUrl} "${target}"`); }
  catch(e){ if (s.optional){ console.warn(`Skip ${s.repo} (clone failed)`); continue; } else { throw e; } }

  const dest = path.join(cwd, s.dest);
  fs.rmSync(dest, {recursive:true, force:true});

  let used = null;
  const docsPath = path.join(target, 'docs');
  if (s.prefer.includes('docs') && fs.existsSync(docsPath) && fs.statSync(docsPath).isDirectory()){
    fs.cpSync(docsPath, dest, {recursive:true});
    used = 'docs';
  } else if (s.prefer.includes('root')){
    copyTreeFiltered(target, dest);
    used = 'root';
  }

  if (!used){
    if (s.optional){ console.warn(`Skip ${s.repo} (no docs found)`); continue; }
    throw new Error(`No docs found in ${s.repo}`);
  }

  // mark source for future logic (if needed)
  fs.writeFileSync(path.join(dest,'.editbase'), used);
  fs.writeFileSync(path.join(dest,'.repo'), s.repo);

  const imports = rootDocImports[s.key] ?? [];
  for (const spec of imports) {
    const candidate = spec.sources.find((rel) => fs.existsSync(path.join(target, rel)));
    if (!candidate) {
      if (!spec.optional) {
        console.warn(`⚠️  No source found for ${s.repo}:${spec.target}`);
      }
      continue;
    }
    const from = path.join(target, candidate);
    const to = path.join(dest, spec.target);
    fs.mkdirSync(path.dirname(to), {recursive: true});
    fs.copyFileSync(from, to);
  }

  // sanitize after copy
  sanitizeMDX(dest, s.repo);

  const extras = extraCopies[s.key] ?? [];
  for (const extra of extras) {
    const extraSrc = path.join(target, extra.src);
    const extraDest = path.join(dest, extra.dest);
    if (fs.existsSync(extraSrc)) {
      copyTreeFiltered(extraSrc, extraDest);
    }
  }

  // ensure a landing page exists
  const shouldEnsureIntro = s.ensureIntro ?? true;
  if (shouldEnsureIntro) {
    const introPath = path.join(dest,'intro.md');
    if (!fs.existsSync(introPath)){
      fs.writeFileSync(introPath, `---\ntitle: Overview\n---\n# Overview\n\nThis section is synced from ${s.repo}.\n`);
    }
  }
  console.log(`Synced ${s.repo} -> ${s.dest} [${used}]`);

  if (shimTemplates[s.key]) {
    // Recreate local shim docs that proxy to files inside the synced repo or external resources.
    for (const shim of shimTemplates[s.key]) {
      const shimContext = {
        destRel: s.dest,
        destDir: dest,
        repo: s.repo,
        used,
      };

      const shimPath = path.join(dest, shim.path);
      const shimContent = typeof shim.content === 'function' ? shim.content(shimContext) : shim.content;
      fs.writeFileSync(shimPath, shimContent);
    }
  }
}

console.log('All sync done.');
