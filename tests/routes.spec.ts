// T1
import { expect, test } from '@playwright/test';
import { allRoutes, builtRoutes, enTwin, REQUIRED } from './lib';

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
test('T1 sitemap lists exactly the live URLs and their English twins', () => {
  const expected = [...new Set([...REQUIRED, ...REQUIRED.map(enTwin)])].sort();
  expect(expected.length, '75 live URLs + 73 /en twins').toBe(148);
  expect(builtRoutes().sort()).toEqual(expected);
});
