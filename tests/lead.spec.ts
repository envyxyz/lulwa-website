// T15. The lead form posts to /contact-submit.php (PHP on Hostinger; real Apache and PHP here, see scripts/serve-apache.mjs).
// mail() has no server locally, so a good lead is saved to logs/contact-submissions.log and the answer says so honestly.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test, type APIRequestContext } from '@playwright/test';
import { DOCROOT, visit } from './lib';

const ENDPOINT = '/contact-submit.php';
const origin = process.env.PW_BASE_URL ?? `http://localhost:${process.env.PW_PORT ?? '4330'}`;
const good = { name: 'Test Lead', phone: '0500000000', appliance: 'ac', area: 'dammam', message: 'not cooling', page: 'contact', utm: '' };
const log = () => {
  const file = join(DOCROOT, 'logs', 'contact-submissions.log');
  return existsSync(file) ? readFileSync(file, 'utf8') : '';
};
const post = (request: APIRequestContext, body: unknown, headers: Record<string, string> = { origin }) =>
  request.post(ENDPOINT, { headers: { 'content-type': 'application/json', ...headers }, data: typeof body === 'string' ? body : JSON.stringify(body) });

test('T15 handler rejects invalid input', async ({ request }) => {
  for (const bad of ['not json', {}, { ...good, phone: 'abc' }, { ...good, name: '' }, { ...good, appliance: '' }, { ...good, area: '' }, { ...good, name: '<b>x</b>' }, { ...good, message: 'x'.repeat(1001) }]) {
    expect((await post(request, bad)).status(), JSON.stringify(bad).slice(0, 40)).toBe(400);
  }
  expect((await post(request, { ...good, message: 'x'.repeat(40_000) })).status(), 'oversize').toBe(413);
});

test('T15 handler accepts a good lead, gives a reference, saves it first, and says whether the email went', async ({ request }) => {
  const response = await post(request, { ...good, name: `Reference Check ${Date.now()}` });
  expect(response.status()).toBe(200);
  const out = await response.json();
  expect(out.ok).toBe(true);
  expect(out.reference).toMatch(/^L-[0-9A-F]{8}$/);
  expect(out.saved).toBe(true);
  expect(typeof out.mailed, 'the answer is honest about the email').toBe('boolean');
  expect(log()).toContain(out.reference);
  expect(JSON.stringify(out)).not.toContain('lulwadammam');
});

test('T15 an Arabic lead with a +966 number is accepted', async ({ request }) => {
  const response = await post(request, { ...good, name: 'أحمد', phone: '+966 56 802 2197', appliance: 'مكيف', area: 'الدمام', message: 'لا يبرد' });
  expect(response.status()).toBe(200);
  expect(log()).toContain('أحمد');
});

test('T15 a foreign, missing or malformed Origin gets 403, not a crash', async ({ request }) => {
  for (const o of ['https://evil.test', 'null', 'not a url']) expect((await post(request, good, { origin: o })).status(), o).toBe(403);
  expect((await post(request, good, {})).status(), 'no Origin or Referer').toBe(403);
  expect((await post(request, good, { referer: 'https://evil.test/form' })).status(), 'foreign Referer').toBe(403);
  expect((await post(request, good, { referer: `${origin}/contact` })).status(), 'own Referer').toBe(200);
});

test('T15 the honeypot gets a normal answer and nothing is stored', async ({ request }) => {
  const response = await post(request, { ...good, name: `Spam ${Date.now()}`, website: 'spam' });
  expect(response.status()).toBe(200);
  const out = await response.json();
  expect(out.ok).toBe(true);
  expect(log()).not.toContain(out.reference);
});

test('T15 only POST is accepted', async ({ request }) => {
  const response = await request.get(ENDPOINT);
  expect(response.status()).toBe(405);
  expect(response.headers()['allow']).toBe('POST');
});

for (const path of ['/contact', '/en/contact']) {
  test(`T15 ${path} form has consent, privacy link, nothing pre-ticked`, async ({ page }) => {
    await visit(page, path);
    const form = page.locator('#lead-form');
    await expect(form.locator('[data-consent]')).toBeVisible();
    await expect(form.locator('a[href*="privacy-policy"]')).toBeVisible();
    await expect(form.locator('input[type="checkbox"]:checked')).toHaveCount(0);
    await expect(form).toHaveAttribute('data-endpoint', ENDPOINT);
  });
}

const fill = async (page: import('@playwright/test').Page, name: string) => {
  const form = page.locator('#lead-form');
  await form.locator('input[name="name"]').fill(name);
  await form.locator('input[name="phone"]').fill('0500000000');
  await form.locator('select[name="appliance"]').selectOption({ index: 1 });
  await form.locator('input[name="area"]').fill('Dammam');
  return form;
};

test('T15 form validates on blur, and a failed submit keeps what was typed and shows the WhatsApp fallback', async ({ page }) => {
  await page.route('**/contact-submit.php', (route) => route.fulfill({ status: 500, contentType: 'text/html', body: 'broken' }));
  await visit(page, '/en/contact');
  const form = page.locator('#lead-form');
  await form.locator('input[name="name"]').focus();
  await form.locator('input[name="phone"]').focus();
  await expect(form.locator('[data-error-for="name"]')).toBeVisible();
  await form.locator('input[name="name"]').fill('Test');
  await expect(form.locator('[data-error-for="name"]')).toBeHidden();
  await fill(page, 'Test');
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('[data-fallback-link]')).toBeVisible();
  await expect(form.locator('[data-fallback-link]')).toBeFocused();
  await expect(form.locator('input[name="name"]')).toHaveValue('Test');
  await expect(form.locator('input[name="area"]')).toHaveValue('Dammam');
  await expect(form.locator('button[type="submit"]')).toBeEnabled();
});

test('T15 a delivery failure from the server shows the WhatsApp link the server built', async ({ page }) => {
  const whatsapp = 'https://wa.me/966568022197?text=from-server';
  await page.route('**/contact-submit.php', (route) => route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ ok: false, error: 'delivery', whatsapp }) }));
  await visit(page, '/en/contact');
  const form = await fill(page, 'Test');
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('[data-fallback-link]')).toHaveAttribute('href', whatsapp);
});

test('T15 a real submit reaches the server, is saved, and lands on the thanks page', async ({ page }) => {
  const name = `Browser Lead ${Date.now()}`;
  await visit(page, '/en/contact');
  const form = await fill(page, name);
  await form.locator('button[type="submit"]').click();
  await page.waitForURL('**/en/thanks');
  expect(log()).toContain(name);
});
