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
          // The hero's support sentence sits in the h1 at body size (data-support): it is not a display line.
          const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
          const lines = new Set<number>();
          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            if (node.parentElement?.closest('[data-support]')) continue;
            const range = document.createRange();
            range.selectNodeContents(node);
            for (const r of range.getClientRects()) if (r.width > 0) lines.add(Math.round(r.top / 8));
          }
          return lines.size > 2 ? [`${heading.textContent?.trim()} (${lines.size})`] : [];
        }),
      );
      expect(long, `at ${width}`).toEqual([]);
    }
  });
}
