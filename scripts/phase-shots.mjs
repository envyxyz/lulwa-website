// Screenshots for a phase record: node scripts/phase-shots.mjs 3 [/path ...] (default: home). Needs `pnpm build` first.
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
  for (const scheme of ['light', 'dark']) for (const width of [1440, 390]) {
    for (const route of process.argv.length > 3 ? process.argv.slice(3) : ['/']) for (const [lang, path] of [['ar', route], ['en', route === '/' ? '/en' : `/en${route}`]]) {
      const page = await browser.newPage({ colorScheme: scheme, reducedMotion: 'reduce', viewport: { width, height: width > 500 ? 900 : 844 } });
      await page.goto(`http://localhost:${port}${path}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      // Walk the page so lazy images load before the full-page shot.
      for (let y = 0; y < (await page.evaluate(() => document.body.scrollHeight)); y += 500) {
        await page.evaluate((top) => scrollTo(0, top), y);
        await page.waitForTimeout(80);
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(700);
      await page.screenshot({ path: `${out}/${path === '/' || path === '/en' ? 'home' : path.replace(/^\/en/, '').slice(1).replace(/\//g, '-')}-${lang}-${width}${scheme === 'dark' ? '-dark' : ''}.png`, fullPage: true });
      await page.close();
    }
  }
  await browser.close();
} catch (e) {
  console.error(e);
} finally {
  // astro allows one preview per project, and killing the pnpm shell leaves it running.
  server.kill();
  spawnSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { shell: true, stdio: 'ignore' });
  process.exit(0);
}
