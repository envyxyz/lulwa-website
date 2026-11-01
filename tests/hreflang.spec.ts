// T4
import { expect, test } from '@playwright/test';
import { site } from '../src/site';
import { allRoutes, enTwin, visit } from './lib';

for (const path of allRoutes()) {
  test(`T4 ${path} hreflang is reciprocal`, async ({ page, request }) => {
    await visit(page, path);
    const ar = path === '/en' ? '/' : path.replace(/^\/en(?=\/)/, '');
    const expected = { 'ar-SA': `${site.url}${ar}`, 'en-SA': `${site.url}${enTwin(ar)}`, 'x-default': `${site.url}${ar}` };
    for (const [lang, href] of Object.entries(expected)) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${lang}"]`), lang).toHaveAttribute('href', href, { timeout: 2000 });
      expect((await request.get(new URL(href).pathname)).status(), `${href} target`).toBe(200);
    }
  });
}
