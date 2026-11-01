// Home screenshots for a phase record: node scripts/phase-shots.mjs 3. Needs `pnpm build` first.
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const port = 4331;
const out = `docs/shots/phase-${process.argv[2]}`;
mkdirSync(out, { recursive: true });
const server = spawn('pnpm', ['exec', 'astro', 'preview', '--port', String(port)], { shell: true, stdio: 'ignore' });
try {
  for (let i = 0; i < 60; i++) {
    if (await fetch(`http://localhost:${port}/`).then(() => true, () => false)) break;
    await new Promise((done) => setTimeout(done, 500));
  }
  const browser = await chromium.launch({ channel: 'msedge' });
  for (const width of [1440, 390]) {
    for (const [lang, path] of [['ar', '/'], ['en', '/en']]) {
      const page = await browser.newPage({ viewport: { width, height: width > 500 ? 900 : 844 } });
      await page.goto(`http://localhost:${port}${path}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(700);
      await page.screenshot({ path: `${out}/home-${lang}-${width}.png`, fullPage: true });
      await page.close();
    }
  }
  await browser.close();
} finally {
  // astro allows one preview per project, and killing the pnpm shell leaves it running.
  server.kill();
  spawnSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { shell: true, stdio: 'ignore' });
  process.exit(0);
}
