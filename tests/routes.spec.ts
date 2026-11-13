// T1
import { expect, test } from '@playwright/test';
import { allRoutes, builtRoutes, enTwin, REQUIRED } from './lib';
import { published } from '../src/content/posts';

for (const path of allRoutes()) {
  test(`T1 ${path} is 200`, async ({ request }) => {
    expect((await request.get(path)).status()).toBe(200);
  });
}

for (const path of REQUIRED) {
  test(`T1 ${path} has its English twin in the sitemap`, () => {
    const built = builtRoutes();
    expect(built).toContain(path);
    expect(built).toContain(enTwin(path));
  });
}

test('T1 sitemap has no dev or noindex pages', () => {
  expect(builtRoutes().filter((p) => /\/dev\/|\/thanks/.test(p))).toEqual([]);
});

// Same pages as the live site, no more (Ameer, 8 Nov 2026): the sitemap is exactly the 75 old URLs and 73 English twins (the two English posts have none).
// The one exception is new blog posts the client publishes from the CMS (client request, 13 Nov 2026), each with its /en twin.
test('T1 sitemap lists exactly the live URLs, their English twins and new CMS posts', () => {
  const live = [...new Set([...REQUIRED, ...REQUIRED.map(enTwin)])];
  expect(live.length, '75 live URLs + 73 /en twins').toBe(148);
  const posts = published().map((p) => `/blog/${p.slug}`).filter((p) => !REQUIRED.includes(p));
  expect(builtRoutes().sort()).toEqual([...new Set([...live, ...posts, ...posts.map(enTwin)])].sort());
});
