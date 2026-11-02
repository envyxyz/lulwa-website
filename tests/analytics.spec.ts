// T16. Tags load as on the old site. Events go to window.dataLayer as { event, location } and through gtag() to GA4.
import { expect, test, type Page } from '@playwright/test';
import { site } from '../src/site';
import { visit } from './lib';

const TAGS = /googletagmanager\.com|clarity\.ms/;
const { ga4, gtm, clarity } = site.analytics;

// The tags are third parties: never fetched for real in a test, only recorded.
const watchTags = async (page: Page) => {
  const seen: string[] = [];
  await page.route(TAGS, (route) => {
    seen.push(route.request().url());
    return route.abort();
  });
  return seen;
};
test.beforeEach(({ page }) => page.route(TAGS, (route) => route.abort()));

const events = (page: Page) =>
  page.evaluate(() => ((window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []).filter((e) => typeof e['event'] === 'string' && !String(e['event']).startsWith('gtm.')));

// gtag() pushes Arguments objects; plain events are objects with an event key.
const gtagCalls = (page: Page) =>
  page.evaluate(() =>
    ((window as unknown as { dataLayer?: unknown[] }).dataLayer ?? [])
      .filter((e) => Object.prototype.toString.call(e) === '[object Arguments]')
      .map((e) => Array.from(e as ArrayLike<unknown>)),
  );

const clickAndExpect = async (page: Page, selector: string, event: string) => {
  await visit(page, '/');
  await page.route(/wa\.me|google\.[a-z.]+\/maps|maps\.app/, (route) => route.abort());
  await page.locator(selector).first().evaluate((el) => {
    el.addEventListener('click', (e) => e.preventDefault());
    (el as HTMLElement).click();
  });
  expect((await events(page)).map((e) => e['event'])).toContain(event);
  // The same event reaches GA4 through gtag, so it counts with no GTM setup.
  expect(await gtagCalls(page)).toContainEqual(['event', event, { location: 'home' }]);
};

test('T16 call_click', ({ page }) => clickAndExpect(page, 'a[href^="tel:"]', 'call_click'));
test('T16 whatsapp_click', ({ page }) => clickAndExpect(page, 'a[href*="wa.me"]', 'whatsapp_click'));
test('T16 directions_click', ({ page }) => clickAndExpect(page, '[data-action="directions"]', 'directions_click'));

test('T16 picker_complete', async ({ page }) => {
  await visit(page, '/');
  await page.locator('[data-faults]:not([hidden]) [data-picker-fault]').first().click({ timeout: 2000 });
  expect((await events(page)).map((e) => e['event'])).toContain('picker_complete');
  expect((await gtagCalls(page)).map((c) => c[1])).toContain('picker_complete');
});

test('T16 lead_submit carries no personal data', async ({ page }) => {
  await page.route('**/contact-submit.php', (route) => route.fulfill({ json: { ok: true, reference: 'R1' } }));
  await visit(page, '/contact');
  const form = page.locator('#lead-form');
  await form.locator('[name="name"]').fill('Sensitive Name', { timeout: 2000 });
  await form.locator('[name="phone"]').fill('0599999999');
  await form.locator('[name="appliance"]').first().selectOption({ index: 1 }).catch(() => {});
  await form.locator('[name="area"]').first().fill('Dammam').catch(() => {});
  let captured = '';
  page.on('framenavigated', async () => {
    captured = JSON.stringify(await events(page).catch(() => []));
  });
  await page.evaluate(() => {
    const layer = ((window as unknown as { dataLayer: unknown[] }).dataLayer ??= []);
    const push = layer.push.bind(layer);
    layer.push = (...items) => {
      sessionStorage.setItem('t16', JSON.stringify(items.map((i) => (Object.prototype.toString.call(i) === '[object Arguments]' ? Array.from(i as ArrayLike<unknown>) : i))));
      return push(...items);
    };
  });
  await form.locator('button[type="submit"]').click();
  await page.waitForURL(/thanks/); // the redirect follows the server's answer, so it is not part of the click
  captured = (await page.evaluate(() => sessionStorage.getItem('t16'))) ?? captured;
  expect(captured).toContain('lead_submit');
  expect(captured).not.toContain('Sensitive');
  expect(captured).not.toContain('0599999999');
  expect(page.url()).not.toContain('0599999999');
});

test('T16 config is queued from the first paint, before any tag has loaded', async ({ page }) => {
  const seen = await watchTags(page);
  await visit(page, '/');
  expect(await gtagCalls(page)).toContainEqual(['config', ga4]);
  expect(seen, 'nothing fetched yet').toEqual([]);
});

test('T16 no tag is requested before the first interaction', async ({ page }) => {
  const seen = await watchTags(page);
  await visit(page, '/');
  await page.waitForTimeout(1500);
  expect(seen).toEqual([]);
});

// Reduced motion switches the animation scripts off. The tags must not depend on them.
for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`T16 GA4, GTM and Clarity load on the first interaction (motion: ${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    const seen = await watchTags(page);
    await visit(page, '/');
    await page.keyboard.press('Tab');
    await expect.poll(() => seen.length, { timeout: 3000 }).toBeGreaterThanOrEqual(3);
    expect(seen).toEqual(
      expect.arrayContaining([expect.stringContaining(`gtag/js?id=${ga4}`), expect.stringContaining(`gtm.js?id=${gtm}`), expect.stringContaining(`clarity.ms/tag/${clarity}`)]),
    );
  });
}

test('T16 the tags also load by themselves once the page has been idle', async ({ page }) => {
  const seen = await watchTags(page);
  await visit(page, '/');
  await expect.poll(() => seen.length, { timeout: 9000 }).toBeGreaterThanOrEqual(3);
});
