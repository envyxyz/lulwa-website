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
