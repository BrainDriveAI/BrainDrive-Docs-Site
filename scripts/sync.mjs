import {execSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const tmp = path.join(cwd, '.cache', 'sources');

const sources = [
  { key: 'core',                 repo: 'BrainDriveAI/BrainDrive-Core',                 dest: 'docs-core',                                      prefer: ['docs','root'] },
  { key: 'template',             repo: 'BrainDriveAI/PluginTemplate',                  dest: 'docs-template',                                  prefer: ['docs','root'] },
  { key: 'chat-plugin',          repo: 'BrainDriveAI/BrainDrive-Chat-Plugin',          dest: 'docs-plugins/brain-drive-chat-plugin',          prefer: ['docs','root'] },
  { key: 'chat-with-docs-plugin',repo: 'BrainDriveAI/BrainDrive-Chat-With-Docs-Plugin',dest: 'docs-plugins/brain-drive-chat-with-docs-plugin',prefer: ['docs','root'] },
  { key: 'settings-plugin',      repo: 'BrainDriveAI/BrainDrive-Settings-Plugin',      dest: 'docs-plugins/brain-drive-settings-plugin',      prefer: ['docs','root'] },
  { key: 'ollama-plugin',        repo: 'BrainDriveAI/BrainDrive-Ollama-Plugin',        dest: 'docs-plugins/brain-drive-ollama-plugin',        prefer: ['docs','root'] },
  { key: 'openrouter-plugin',    repo: 'BrainDriveAI/BrainDrive-Openrouter-Plugin',    dest: 'docs-plugins/brain-drive-openrouter-plugin',    prefer: ['docs','root'] },
  { key: 'ai-chat',              repo: 'DJJones66/BrainDriveChat',                     dest: 'docs-plugins/ai-chat',                          prefer: ['docs','root'], optional: true },
];

// Additional files that should always exist in the destination even after syncing
const shimTemplates = {
  core: [
    {
      path: 'INSTALL.mdx',
      content: ({destRel, installDocImport}) =>
        `---\n` +
        `title: Install BrainDrive-Core\n` +
        `---\n\n` +
        `import InstallDoc from '@site/${destRel}/${installDocImport}';\n\n` +
        `<InstallDoc />\n`,
    },
    {
      path: 'CONTRIBUTING.mdx',
      content:
        `---\n` +
        `title: Contributing to BrainDrive\n` +
        `---\n\n` +
        `import ContributingDoc from './_includes/CONTRIBUTING.mdx';\n\n` +
        `<ContributingDoc />\n`,
    },
    {
      path: 'ROADMAP.mdx',
      content:
        `---\n` +
        `title: BrainDrive Roadmap\n` +
        `---\n\n` +
        `import RoadmapDoc from './_includes/ROADMAP.mdx';\n\n` +
        `<RoadmapDoc />\n`,
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
          collapsed: false,
        },
        null,
        2,
      ) + '\n',
    },
  ],
  'chat-with-docs-plugin': [
    {
      path: '_category_.json',
      content: JSON.stringify(
        {
          label: 'BrainDrive-Chat-With-Docs-Plugin',
          position: 6,
          collapsible: true,
          collapsed: false,
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
          collapsed: false,
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
          collapsed: false,
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
          collapsed: false,
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
      sources: ['CONTRIBUTING.mdx', 'CONTRIBUTING.md', 'docs/CONTRIBUTING.mdx', 'docs/CONTRIBUTING.md'],
      target: '_includes/CONTRIBUTING.mdx',
    },
    {
      sources: ['ROADMAP.mdx', 'ROADMAP.md', 'docs/ROADMAP.mdx', 'docs/ROADMAP.md'],
      target: '_includes/ROADMAP.mdx',
    },
  ],
};

const allow = new Set(['.md','.mdx','.png','.jpg','.jpeg','.gif','.svg','.webp','.bmp','.pdf']);

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
    const ext = path.extname(src).toLowerCase();
    if (allow.has(ext)){
      fs.mkdirSync(path.dirname(dest), {recursive:true});
      fs.copyFileSync(src, dest);
    }
  }
}

function sanitizeLineOutsideBackticks(line, repoName){
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
        .replace(/\/core\/PLUGIN_DEVELOPER_QUICKSTART/gi, '/core/getting-started/plugin-developer-quickstart')
        .replace(/https?:\/\/docs\.braindrive\.ai\/core\/ROADMAP/gi, 'https://community.braindrive.ai/t/braindrive-development-progress-updates/92')
        .replace(/\/core\/ROADMAP/gi, 'https://community.braindrive.ai/t/braindrive-development-progress-updates/92')
        .replace(/\[\*\*Service Bridges\*\*\]\(\)/g, '[**Service Bridges**](https://docs.braindrive.ai/services/intro)')
        .replace(/\]\((?:\.{1,2}\/)?SECURITY\.md\)/g, '](https://github.com/BrainDriveAI/BrainDrive-Core/blob/main/SECURITY.md)');
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
      if (!inFence) lines[i] = sanitizeLineOutsideBackticks(lines[i], repoName);
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
  const introPath = path.join(dest,'intro.md');
  if (!fs.existsSync(introPath)){
    fs.writeFileSync(introPath, `---\ntitle: Overview\n---\n# Overview\n\nThis section is synced from ${s.repo}.\n`);
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

      if (s.key === 'core') {
        const installDocImport =
          findExistingFile(dest, [
            path.join('getting-started', 'install.md'),
            path.join('getting-started', 'install.mdx'),
            path.join('docs', 'getting-started', 'install.md'),
            path.join('docs', 'getting-started', 'install.mdx'),
          ]) ?? 'getting-started/install.md';
        shimContext.installDocImport = installDocImport;
      }

      const shimPath = path.join(dest, shim.path);
      const shimContent = typeof shim.content === 'function' ? shim.content(shimContext) : shim.content;
      fs.writeFileSync(shimPath, shimContent);
    }
  }
}

console.log('All sync done.');
