// T4
import { expect, test } from '@playwright/test';
import { site } from '../src/site';
import { allRoutes, ENGLISH_ROOT, enTwin, visit } from './lib';

for (const path of allRoutes()) {
  test(`T4 ${path} hreflang is reciprocal`, async ({ page, request }) => {
    await visit(page, path);
    const ar = path === '/en' ? '/' : path.replace(/^\/en(?=\/)/, '');
    if (ENGLISH_ROOT.includes(path)) {
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.locator('link[rel="alternate"][hreflang="ar-SA"]')).toHaveCount(0);
      for (const l of ['en-SA', 'x-default']) await expect(page.locator(`link[rel="alternate"][hreflang="${l}"]`)).toHaveAttribute('href', `${site.url}${path}`);
      return;
    }
    const expected = { 'ar-SA': `${site.url}${ar}`, 'en-SA': `${site.url}${enTwin(ar)}`, 'x-default': `${site.url}${ar}` };
    for (const [lang, href] of Object.entries(expected)) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${lang}"]`), lang).toHaveAttribute('href', href, { timeout: 2000 });
      expect((await request.get(new URL(href).pathname)).status(), `${href} target`).toBe(200);
    }
  });
}

// The sitemaps list both languages of a page and say so with alternates.
test('T4 every sitemap url carries ar-SA, en-SA and x-default alternates and a lastmod', async ({ request }) => {
  const index = await (await request.get('/sitemap-index.xml')).text();
  expect(await (await request.get('/sitemap.xml')).text(), 'sitemap.xml mirrors the index').toBe(index);
  const files = [...index.matchAll(/<loc>[^<]*\/(sitemap-[a-z]+\.xml)<\/loc>/g)].map((m) => m[1]!);
  expect(files.length).toBeGreaterThan(0);
  for (const file of files) {
    const xml = await (await request.get(`/${file}`)).text();
    const urls = xml.split('<url>').slice(1);
    expect(urls.length, file).toBeGreaterThan(0);
    for (const url of urls) {
      if (ENGLISH_ROOT.some((p) => url.includes(`<loc>${site.url}${p}</loc>`))) continue;
      expect(url, file).toMatch(/<lastmod>\d{4}-\d\d-\d\d<\/lastmod>/);
      for (const lang of ['ar-SA', 'en-SA', 'x-default']) expect(url, `${file} ${lang}`).toContain(`hreflang="${lang}"`);
      expect(url).not.toMatch(/\/thanks</);
    }
  }
});
