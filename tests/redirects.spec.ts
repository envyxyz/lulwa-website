// T2. Every url-map row in one hop. Needs the Worker and _redirects from Phase 8.
import { expect, test } from '@playwright/test';
import { urlMap } from './lib';

for (const { old_path, action, target } of urlMap()) {
  test(`T2 ${old_path} ${action}`, async ({ request }) => {
    const response = await request.get(old_path, { maxRedirects: 0 });
    const status = response.status();
    const location = response.headers()['location'] ?? '';
    if (action === 'keep') {
      expect(status).toBe(200);
    } else if (action === '301') {
      expect(status).toBe(301);
      expect(new URL(location, 'http://x').pathname).toBe(target);
    } else if (action === '410-or-301') {
      expect([301, 410]).toContain(status);
    } else {
      // "confirm" rows wait on the client; they end as a page, a redirect or gone, never a 404.
      expect([200, 301, 410]).toContain(status);
    }
    if (status === 301) expect((await request.get(location, { maxRedirects: 0 })).status(), 'one hop only').toBe(200);
  });
}
