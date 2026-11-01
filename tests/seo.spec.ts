// T3
import { expect, test } from '@playwright/test';
import { site } from '../src/site';
import { allRoutes, visit } from './lib';

const read = async (page: import('@playwright/test').Page, path: string) => {
  await visit(page, path);
  return {
    title: await page.title(),
    description: await page.locator('meta[name="description"]').getAttribute('content'),
    canonical: await page.locator('link[rel="canonical"]').getAttribute('href', { timeout: 2000 }).catch(() => null),
    h1: await page.locator('h1').count(),
  };
};

for (const path of allRoutes()) {
  test(`T3 ${path} has title, description, canonical, one h1`, async ({ page }) => {
    const { title, description, canonical, h1 } = await read(page, path);
    expect(title).toBeTruthy();
    expect(description).toBeTruthy();
    if (!path.startsWith('/en')) expect([...title].length, 'Arabic title length').toBeLessThanOrEqual(60);
    expect(canonical).toBe(`${site.url}${path}`);
    expect(h1).toBe(1);
  });
}

test('T3 titles and descriptions are unique', async ({ page }) => {
  const seen = new Map<string, string>();
  for (const path of allRoutes()) {
    const { title, description } = await read(page, path);
    for (const value of [title, description ?? '']) {
      expect(seen.get(value), `"${value}" on ${path}`).toBeUndefined();
      seen.set(value, path);
    }
  }
});
