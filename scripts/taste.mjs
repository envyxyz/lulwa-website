// T20. design-taste-frontend's lint.mjs on src and inspect.mjs on every built page.
// Set TASTE_SKILL if the skill lives elsewhere. Exit 1 on any FAIL.
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const skill = process.env.TASTE_SKILL ?? join(homedir(), '.claude/skills/design-taste-frontend/scripts');
// The "Reference update" in docs/DESIGN-DIRECTION.md wins over the inspector: rounded tone-step cards are structure here.
// still-page: the direction asks for one authored moment and nothing hidden behind an animation.
// covered-text: DESIGN.md fixes the Ink bottom bar to the phone screen, so text passes under it while scrolling.
// Every allowance is listed with its evidence in docs/QA.md.
const ALLOW = 'card-rows,radius-mix,still-page,covered-text';
// Home only: the picker's step labels are form labels, and the Reference update's sideways service row runs past the edge.
const HOME = ',eyebrow,edge-text';
// Photos are real or absent, and the shop has only 6 usable ones, so text pages cannot honestly hold 4 pictures.
const TEXT_PAGE = ',few-pictures,focal-point';
// Arabic text pages only: at 768 the cards hold 23 px on both sides. The 91 px is short Arabic sentences ending before the line does, not the frame.
const ARABIC_TEXT = ',off-centre';
const allowFor = (path) => ALLOW + (path === '/' || path === '/en' ? HOME : /^(\/en)?\/work$/.test(path) ? '' : TEXT_PAGE + (path.startsWith('/en') ? '' : ARABIC_TEXT));
// TASTE_PORT: inspect a preview that is already running. Astro allows one preview per project, so a second one would exit.
const port = process.env.TASTE_PORT ?? 4323;
const paths =[...readFileSync('dist/sitemap-0.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

let failed = spawnSync('node', [join(skill, 'lint.mjs'), 'src'], { stdio: 'inherit' }).status !== 0;

const server = process.env.TASTE_PORT ? null : spawn('pnpm', ['exec', 'astro', 'preview', '--port', String(port)], { shell: true, stdio: 'ignore' });
try {
  let up = false;
  for (let i = 0; i < 60 && !up; i++) {
    up = await fetch(`http://localhost:${port}/`).then(() => true, () => false);
    if (!up) await new Promise((done) => setTimeout(done, 500));
  }
  if (!up) throw new Error(`No preview on port ${port}. Is another astro preview running? Set TASTE_PORT to use it.`);
  for (const path of paths) {
    const out = `.taste-skill/inspect${path === '/' ? '/ar' : path}`;
    const { status } = spawnSync('node', [join(skill, 'inspect.mjs'), `http://localhost:${port}${path}`, '--out', out, '--allow', allowFor(path)], { stdio: 'inherit' });
    if (status !== 0) failed = true;
  }
} finally {
  if (server && process.platform === 'win32') spawnSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
  else server?.kill();
}
process.exit(failed ? 1 : 0);
