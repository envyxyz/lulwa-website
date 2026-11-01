// T10
import { expect, test } from '@playwright/test';
import { allRoutes, visit, WIDTHS } from './lib';

for (const path of allRoutes()) {
  test(`T10 ${path} never scrolls sideways`, async ({ page }) => {
    await visit(page, path);
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `at ${width}`).toBeLessThanOrEqual(0);
    }
  });
}
