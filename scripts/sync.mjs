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

function sanitizeMDX(destDir){
  // Escape "<" that doesn't start a valid HTML/MDX tag (outside code fences)
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
      const line = lines[i];
      const fence = line.match(/^\s*(`{3,}|~{3,})/);
      if (fence){ inFence = !inFence; continue; }
      if (!inFence){
        // Replace "<X" when X is NOT a letter, $, _, !, /, or ?
        lines[i] = line.replace(/<([^A-Za-z$_!\/\?])/g, '&lt;$1');
      }
    }
    txt = lines.join('\n');
    fs.writeFileSync(p, txt);
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

  // Write metadata for edit links
  fs.writeFileSync(path.join(dest,'.editbase'), used);
  fs.writeFileSync(path.join(dest,'.repo'), s.repo);

  // Auto-sanitize MDX after sync
  sanitizeMDX(dest);

  if (!fs.existsSync(path.join(dest,'intro.md'))){
    fs.writeFileSync(path.join(dest,'intro.md'), `---\ntitle: Overview\n---\n# Overview\n\nThis section is synced from ${s.repo}.\n`);
  }
  console.log(`Synced ${s.repo} -> ${s.dest} [${used}]`);
}

console.log('All sync done.');
