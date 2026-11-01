// T16. Events go to window.dataLayer as { event, location }.
import { expect, test, type Page } from '@playwright/test';
import { visit } from './lib';

const events = (page: Page) =>
  page.evaluate(() => ((window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []).filter((e) => typeof e['event'] === 'string' && !String(e['event']).startsWith('gtm.')));

const clickAndExpect = async (page: Page, selector: string, event: string) => {
  await visit(page, '/');
  await page.route(/wa\.me|google\.[a-z.]+\/maps|maps\.app/, (route) => route.abort());
  await page.locator(selector).first().evaluate((el) => {
    el.addEventListener('click', (e) => e.preventDefault());
    (el as HTMLElement).click();
  });
  expect((await events(page)).map((e) => e['event'])).toContain(event);
};

test('T16 call_click', ({ page }) => clickAndExpect(page, 'a[href^="tel:"]', 'call_click'));
test('T16 whatsapp_click', ({ page }) => clickAndExpect(page, 'a[href*="wa.me"]', 'whatsapp_click'));
test('T16 directions_click', ({ page }) => clickAndExpect(page, '[data-action="directions"]', 'directions_click'));

test('T16 picker_complete', async ({ page }) => {
  await visit(page, '/');
  await page.locator('[data-faults]:not([hidden]) [data-picker-fault]').first().click({ timeout: 2000 });
  expect((await events(page)).map((e) => e['event'])).toContain('picker_complete');
});

test('T16 lead_submit carries no personal data', async ({ page }) => {
  await page.route('**/api/lead', (route) => route.fulfill({ json: { ok: true, reference: 'R1' } }));
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
      sessionStorage.setItem('t16', JSON.stringify(items));
      return push(...items);
    };
  });
  await form.locator('button[type="submit"]').click();
  await page.waitForURL(/thanks/); // the redirect follows the Worker's answer, so it is not part of the click
  captured = (await page.evaluate(() => sessionStorage.getItem('t16'))) ?? captured;
  expect(captured).toContain('lead_submit');
  expect(captured).not.toContain('Sensitive');
  expect(captured).not.toContain('0599999999');
  expect(page.url()).not.toContain('0599999999');
});
