// T7. Runs on pages that exist; every real page must carry the shop's details.
import { expect, test } from '@playwright/test';
import { site } from '../src/site';
import { builtRoutes, visit } from './lib';

for (const path of builtRoutes()) {
  test(`T7 ${path} shows the one phone, legal name and CR`, async ({ page }) => {
    await visit(page, path);
    const text = await page.locator('body').innerText();
    const phones = text.match(/(?:\+?966|0)\s?5[\d\s-]{7,}\d/g) ?? [];
    expect(phones.map((p) => p.trim()).filter((p) => p !== site.phone.display)).toEqual([]);
    for (const href of await page.locator('a[href^="tel:"]').evaluateAll((links) => links.map((a) => a.getAttribute('href')))) {
      expect(href).toBe(site.phone.tel);
    }
    const footer = page.locator('footer');
    await expect(footer, 'footer exists').toHaveCount(1);
    await expect(footer).toContainText(site.phone.display);
    await expect(footer).toContainText(site.legal.name);
    await expect(footer).toContainText(site.legal.cr);
  });
}
