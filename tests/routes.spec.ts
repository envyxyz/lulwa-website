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
