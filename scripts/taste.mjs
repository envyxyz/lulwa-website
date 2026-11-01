// T20. design-taste-frontend's lint.mjs on src and inspect.mjs on every built page.
// Set TASTE_SKILL if the skill lives elsewhere. Exit 1 on any FAIL.
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const skill = process.env.TASTE_SKILL ?? join(homedir(), '.claude/skills/design-taste-frontend/scripts');
// The "Reference update" in docs/DESIGN-DIRECTION.md wins over the inspector: rounded tone-step cards are structure here.
const ALLOW = 'card-rows,radius-mix';
const port = 4323;
const paths = [...readFileSync('dist/sitemap-0.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

let failed = spawnSync('node', [join(skill, 'lint.mjs'), 'src'], { stdio: 'inherit' }).status !== 0;

const server = spawn('pnpm', ['exec', 'astro', 'preview', '--port', String(port)], { shell: true, stdio: 'ignore' });
try {
  for (let i = 0; i < 60; i++) {
    if (await fetch(`http://localhost:${port}/`).then(() => true, () => false)) break;
    await new Promise((done) => setTimeout(done, 500));
  }
  for (const path of paths) {
    const out = `.taste-skill/inspect${path === '/' ? '/ar' : path}`;
    const { status } = spawnSync('node', [join(skill, 'inspect.mjs'), `http://localhost:${port}${path}`, '--out', out, '--allow', ALLOW], { stdio: 'inherit' });
    if (status !== 0) failed = true;
  }
} finally {
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
  else server.kill();
}
process.exit(failed ? 1 : 0);
