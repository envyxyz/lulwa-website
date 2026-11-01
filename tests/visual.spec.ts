// T17. Baselines are made once in Phase 9 with --update-snapshots, then compared.
import { expect, test } from '@playwright/test';
import { enTwin, visit } from './lib';

const PAGES = ['/', '/services/ac-repair', '/faults/ac-not-cooling'];

for (const width of [1440, 390]) {
  for (const path of PAGES.flatMap((p) => [p, enTwin(p)])) {
    test(`T17 ${path} at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await visit(page, path);
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`${path.replaceAll('/', '_') || 'home'}-${width}.png`, { fullPage: true });
    });
  }
}
