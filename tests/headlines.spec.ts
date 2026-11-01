// T11
import { expect, test } from '@playwright/test';
import { allRoutes, visit, WIDTHS } from './lib';

for (const path of allRoutes()) {
  test(`T11 ${path} headings stay within two lines`, async ({ page }) => {
    await visit(page, path);
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      const long = await page.evaluate(() =>
        [...document.querySelectorAll('h1, h2, h3')].flatMap((heading) => {
          const range = document.createRange();
          range.selectNodeContents(heading);
          const lines = new Set([...range.getClientRects()].filter((r) => r.width > 0).map((r) => Math.round(r.top / 8)));
          return lines.size > 2 ? [`${heading.textContent?.trim()} (${lines.size})`] : [];
        }),
      );
      expect(long, `at ${width}`).toEqual([]);
    }
  });
}
