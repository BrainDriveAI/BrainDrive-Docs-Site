import {execSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const tmp = path.join(cwd, '.cache', 'sources');

const sources = [
  { key: 'core',     repo: 'BrainDriveAI/BrainDrive-Core', dest: 'docs-core',            prefer: ['docs','root'] },
  { key: 'template', repo: 'BrainDriveAI/PluginTemplate',  dest: 'docs-template',        prefer: ['docs','root'] },
  { key: 'ai-chat',  repo: 'DJJones66/BrainDriveChat',     dest: 'docs-plugins/ai-chat', prefer: ['docs','root'], optional: true },
];

// Additional files that should always exist in the destination even after syncing
const shimTemplates = {
  core: `---\n` +
        `title: Install BrainDrive-Core\n` +
        `---\n\n` +
        `import InstallDoc from '@site/BrainDrive-Core/docs/getting-started/install.md';\n\n` +
        `<InstallDoc />\n`,
};

const allow = new Set(['.md','.mdx','.png','.jpg','.jpeg','.gif','.svg','.webp','.bmp','.pdf']);

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

  // sanitize after copy
  sanitizeMDX(dest, s.repo);

  // ensure a landing page exists
  const introPath = path.join(dest,'intro.md');
  if (!fs.existsSync(introPath)){
    fs.writeFileSync(introPath, `---\ntitle: Overview\n---\n# Overview\n\nThis section is synced from ${s.repo}.\n`);
  }
  console.log(`Synced ${s.repo} -> ${s.dest} [${used}]`);

  if (shimTemplates[s.key]) {
    // Recreate local shim docs that proxy to files inside the synced repo.
    const shimPath = path.join(dest, 'INSTALL.mdx');
    fs.writeFileSync(shimPath, shimTemplates[s.key]);
  }
}

console.log('All sync done.');
