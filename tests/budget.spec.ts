// T13. Runs on pages that exist. A budget on an empty stub proves nothing, so the page must carry its actions.
import { gzipSync } from 'node:zlib';
import { expect, test } from '@playwright/test';
import { builtRoutes, visit } from './lib';

const KB = 1024;
const ANALYTICS = /googletagmanager|google-analytics|clarity\.ms/;

for (const path of builtRoutes()) {
  test(`T13 ${path} is inside the budgets`, async ({ page, baseURL }) => {
    const sizes: { url: string; type: string; bytes: number }[] = [];
    page.on('response', async (response) => {
      const url = response.url();
      if (ANALYTICS.test(url) || response.status() !== 200) return;
      const type = response.request().resourceType();
      const body = await response.body().catch(() => Buffer.alloc(0));
      const bytes = ['document', 'script', 'stylesheet'].includes(type) ? gzipSync(body).length : body.length;
      sizes.push({ url, type, bytes });
    });
    await visit(page, path);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-action="whatsapp"]').first(), 'real page: has WhatsApp').toBeAttached({ timeout: 2000 });
    await expect(page.locator('[data-action="call"]').first(), 'real page: has Call').toBeAttached({ timeout: 2000 });

    const sum = (filter: (s: (typeof sizes)[number]) => boolean) => sizes.filter(filter).reduce((total, s) => total + s.bytes, 0);
    expect(sum((s) => s.type === 'script' && s.url.startsWith(baseURL!)), 'own JS gzip').toBeLessThanOrEqual(6 * KB);
    expect(sum((s) => s.type === 'font'), 'fonts').toBeLessThanOrEqual(110 * KB);
    expect(sum(() => true), 'first load').toBeLessThanOrEqual(250 * KB);

    const blocking = await page.evaluate(() =>
      [...document.head.querySelectorAll<HTMLElement>('script[src]:not([async]):not([defer]):not([type="module"]), link[rel="stylesheet"]')]
        .map((el) => el.getAttribute('src') ?? el.getAttribute('href') ?? '')
        .filter((src) => /^https?:|^\/\//.test(src) && !src.startsWith(location.origin)),
    );
    expect(blocking, 'render-blocking third party').toEqual([]);
  });
}
