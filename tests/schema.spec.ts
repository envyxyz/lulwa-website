// T5
import { expect, test } from '@playwright/test';
import { allRoutes, visit } from './lib';

const blocks = async (page: import('@playwright/test').Page) =>
  (await page.locator('script[type="application/ld+json"]').allTextContents()).map((text) => JSON.parse(text));

for (const path of allRoutes()) {
  test(`T5 ${path} JSON-LD parses, no AggregateRating`, async ({ page }) => {
    await visit(page, path);
    const found = await blocks(page);
    expect(found.length, 'has JSON-LD').toBeGreaterThan(0);
    expect(JSON.stringify(found)).not.toContain('AggregateRating');
  });
}

test('T5 HVACBusiness is complete', async ({ page }) => {
  await visit(page, '/');
  const graph = (await blocks(page)).flatMap((block) => block['@graph'] ?? block);
  const shop = graph.find((node) => node['@type'] === 'HVACBusiness');
  expect(shop, 'HVACBusiness present').toBeTruthy();
  for (const key of ['name', 'legalName', 'telephone', 'address', 'geo', 'openingHoursSpecification', 'areaServed', 'hasMap']) {
    expect(shop[key], key).toBeTruthy();
  }
  expect(shop.hasMap).toMatch(/google\.[a-z.]+\/maps|maps\.app\.goo\.gl|g\.page/);
  for (const hours of [shop.openingHoursSpecification].flat()) {
    expect(hours.opens).toBe('08:00');
    expect(hours.closes).toBe('23:00');
  }
});

// Every page names the site and itself. The business node is full on home, contact, about and the Dammam page, and referenced by @id elsewhere.
for (const path of allRoutes()) {
  test(`T5 ${path} has WebSite and WebPage that point at the business`, async ({ page }) => {
    await visit(page, path);
    const graph = (await blocks(page)).flatMap((block) => block['@graph'] ?? block);
    const site = graph.find((n) => n['@type'] === 'WebSite');
    const web = graph.find((n) => n['@type'] === 'WebPage');
    expect(site, 'WebSite').toBeTruthy();
    expect(web, 'WebPage').toBeTruthy();
    for (const key of ['name', 'alternateName', 'inLanguage', 'publisher']) expect(site[key], `WebSite.${key}`).toBeTruthy();
    for (const key of ['isPartOf', 'about', 'inLanguage']) expect(web[key], `WebPage.${key}`).toBeTruthy();
    expect(web.isPartOf['@id']).toBe(site['@id']);
    expect(web.about['@id']).toMatch(/#business$/);
    expect(site.publisher['@id']).toMatch(/#business$/);
    expect(web.inLanguage).toBe(path.startsWith('/en') ? 'en-SA' : 'ar-SA');
    expect(JSON.stringify(graph)).not.toContain('"keywords"');
  });
}

test('T5 the business node is complete and sameAs is only the checked profiles', async ({ page }) => {
  await visit(page, '/');
  const shop = (await blocks(page)).flatMap((block) => block['@graph'] ?? block).find((n) => n['@type'] === 'HVACBusiness');
  for (const key of ['name', 'alternateName', 'legalName', 'url', 'logo', 'image', 'telephone', 'email', 'address', 'geo', 'hasMap', 'openingHoursSpecification', 'areaServed', 'contactPoint', 'knowsAbout', 'identifier', 'sameAs']) {
    expect(shop[key], key).toBeTruthy();
  }
  for (const key of ['streetAddress', 'addressLocality', 'addressRegion', 'addressCountry']) expect(shop.address[key], `address.${key}`).toBeTruthy();
  expect(shop.logo).toMatch(/\/images\/brand\/lulwa-logo\.png$/);
  expect(shop.image).toMatch(/\/images\/og-default\.png$/);
  expect(shop.areaServed.name).toBe('الدمام');
  expect(shop.sameAs.every((u: string) => u.startsWith('https://'))).toBe(true);
  expect(shop.sameAs.join(' ')).not.toMatch(/trustpilot|crunchbase/);
});
