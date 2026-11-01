// Kitchen sink screenshots for the Phase 1 record: node scripts/sink-shots.mjs, with `pnpm dev` not already on 4330.
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const port = 4330;
const out = 'docs/shots/phase-1';
mkdirSync(out, { recursive: true });
const server = spawn('pnpm', ['exec', 'astro', 'dev', '--port', String(port)], { shell: true, stdio: 'ignore' });
try {
  for (let i = 0; i < 60; i++) {
    if (await fetch(`http://localhost:${port}/`).then(() => true, () => false)) break;
    await new Promise((done) => setTimeout(done, 500));
  }
  const browser = await chromium.launch({ channel: 'msedge' });
  for (const width of [1440, 390]) {
    for (const [lang, path] of [['ar', '/dev/kitchen-sink'], ['en', '/en/dev/kitchen-sink']]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(`http://localhost:${port}${path}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const facts = await page.evaluate(() => ({
        dir: document.documentElement.dir,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        robots: document.querySelector('meta[name=robots]')?.getAttribute('content'),
        loaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight}`),
        mirrored: [...document.querySelectorAll('[data-directional]')].map((el) => getComputedStyle(el).scale),
      }));
      console.log(lang, width, JSON.stringify(facts));
      await page.screenshot({ path: `${out}/kitchen-sink-${lang}-${width}.png`, fullPage: true });
      await page.close();
    }
  }
  await browser.close();
} finally {
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
  else server.kill();
}
