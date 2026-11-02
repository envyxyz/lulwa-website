// Moves hub pages to the old physical shape: services.html -> services/index.html, en.html -> en/index.html, en/blog.html -> en/blog/index.html.
// Leaf pages stay x.html. Output folder: --outDir <dir>, --outDir=<dir> or env OUT_DIR (default dist).
import { existsSync, mkdirSync, readdirSync, renameSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const i = process.argv.indexOf('--outDir');
const arg = process.argv.find((a) => a.startsWith('--outDir='))?.slice(9) ?? (i >= 0 ? process.argv[i + 1] : undefined);
const outDir = resolve(process.env.OUT_DIR || arg || 'dist');
if (!existsSync(outDir)) throw new Error(`postbuild: ${outDir} does not exist, run astro build first`);

// Always hubs, even if the folder has no children yet. Any other page with a same-named sibling folder (faults) is a hub too.
const HUBS = ['services', 'areas', 'brands', 'blog'];
let moved = 0;

const move = (dir, name) => {
  const from = join(dir, `${name}.html`);
  if (!existsSync(from)) return;
  mkdirSync(join(dir, name), { recursive: true });
  renameSync(from, join(dir, name, 'index.html'));
  moved++;
};

const lang = (dir) => {
  for (const hub of HUBS) move(dir, hub);
  for (const entry of readdirSync(dir)) {
    if (entry.endsWith('.html') && entry !== '404.html' && statSync(join(dir, entry.slice(0, -5)), { throwIfNoEntry: false })?.isDirectory()) move(dir, entry.slice(0, -5));
  }
};

lang(outDir);
move(outDir, 'en');
if (existsSync(join(outDir, 'en'))) lang(join(outDir, 'en'));
console.log(`postbuild: ${moved} hub pages moved to folder/index.html in ${outDir}`);
