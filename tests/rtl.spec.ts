// T12. Runs on pages that exist.
import { expect, test } from '@playwright/test';
import { site } from '../src/site';
import { builtRoutes, visit } from './lib';

for (const path of builtRoutes()) {
  const english = path === '/en' || path.startsWith('/en/');
  test(`T12 ${path} direction, phone order, icons and fonts`, async ({ page }) => {
    await visit(page, path);
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', english ? 'en' : 'ar');
    await expect(html).toHaveAttribute('dir', english ? 'ltr' : 'rtl');

    await expect(page.locator('a[href^="tel:"]').first(), 'page has a phone link').toBeAttached({ timeout: 2000 });
    const inOrder = await page.evaluate((phone) => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const at = node.textContent?.indexOf(phone) ?? -1;
        if (at < 0) continue;
        const rect = (i: number) => {
          const range = document.createRange();
          range.setStart(node, i);
          range.setEnd(node, i + 1);
          return range.getBoundingClientRect().left;
        };
        return rect(at) < rect(at + phone.length - 1);
      }
      return null;
    }, site.phone.display);
    expect(inOrder, 'digits read left to right').toBe(true);

    const flips = await page.locator('[data-directional]').evaluateAll((icons) =>
      icons.map((icon) => {
        const style = getComputedStyle(icon);
        return style.scale.startsWith('-1') || style.transform.startsWith('matrix(-1');
      }),
    );
    expect(flips.length, 'page has a directional icon').toBeGreaterThan(0);
    expect(new Set(flips), 'directional icons mirror only in Arabic').toEqual(new Set([!english]));

    await page.evaluate(() => document.fonts.ready);
    const fonts = await page.evaluate(() => ({
      head: getComputedStyle(document.querySelector('h1')!).fontFamily,
      body: getComputedStyle(document.body).fontFamily,
      loaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replaceAll('"', '')),
    }));
    const [head, body] = english ? ['Schibsted Grotesk', 'Schibsted Grotesk'] : ['Beiruti', 'IBM Plex Sans Arabic'];
    expect(fonts.head).toContain(head);
    expect(fonts.body).toContain(body);
    expect(fonts.loaded).toContain(head);
    expect(fonts.loaded).toContain(body);
  });
}
