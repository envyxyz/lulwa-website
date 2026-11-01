// T15. worker/lead.ts must export handleLead(request, env, fetcher) returning a Response.
import { expect, test } from '@playwright/test';
import { visit } from './lib';

const env = { LEADS_WEBHOOK_URL: 'https://sheet.test/hook', LEADS_WEBHOOK_SECRET: 'top-secret-value' };
const good = { name: 'Test', phone: '0500000000', appliance: 'ac', area: 'dammam', message: 'not cooling' };
const post = (body: unknown) => new Request('https://x.test/api/lead', { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body) });
const sheetUp = async () => new Response('{"ok":true}');
const sheetDown = async () => new Response('down', { status: 500 });

const load = async () => {
  const path = '../worker/lead.ts'; // a variable: the file arrives in Phase 7 and this must fail at run time, not compile time
  return (await import(path)) as { handleLead: (r: Request, e: typeof env, f: typeof fetch) => Promise<Response> };
};

test('T15 Worker rejects invalid input', async () => {
  const { handleLead } = await load();
  for (const bad of ['not json', {}, { ...good, phone: 'abc' }, { ...good, name: '' }, { ...good, message: 'x'.repeat(40_000) }]) {
    expect((await handleLead(post(bad), env, sheetUp)).status, JSON.stringify(bad).slice(0, 40)).toBeGreaterThanOrEqual(400);
  }
});

test('T15 Worker accepts a good lead with a reference, and leaks no secret', async () => {
  const { handleLead } = await load();
  const response = await handleLead(post(good), env, sheetUp);
  expect(response.status).toBe(200);
  const text = await response.text();
  expect(JSON.parse(text).reference).toBeTruthy();
  expect(text).not.toContain(env.LEADS_WEBHOOK_SECRET);
  expect(text).not.toContain(env.LEADS_WEBHOOK_URL);
});

test('T15 a foreign or malformed Origin gets 403, not a crash', async () => {
  const { handleLead } = await load();
  for (const origin of ['https://evil.test', 'null', 'not a url']) {
    const request = new Request('https://x.test/api/lead', { method: 'POST', headers: { origin }, body: JSON.stringify(good) });
    expect((await handleLead(request, env, sheetUp)).status, origin).toBe(403);
  }
});

test('T15 honeypot is dropped without reaching the Sheet', async () => {
  const { handleLead } = await load();
  let called = false;
  await handleLead(post({ ...good, website: 'spam' }), env, async () => {
    called = true;
    return new Response('{}');
  });
  expect(called).toBe(false);
});

test('T15 Sheet down gives a WhatsApp fallback and no secret', async () => {
  const { handleLead } = await load();
  const text = await (await handleLead(post(good), env, sheetDown)).text();
  expect(text).toContain('wa.me');
  expect(text).not.toContain(env.LEADS_WEBHOOK_SECRET);
});

for (const path of ['/contact', '/en/contact']) {
  test(`T15 ${path} form has consent, privacy link, nothing pre-ticked`, async ({ page }) => {
    await visit(page, path);
    const form = page.locator('#lead-form');
    await expect(form.locator('[data-consent]')).toBeVisible();
    await expect(form.locator('a[href*="privacy-policy"]')).toBeVisible();
    await expect(form.locator('input[type="checkbox"]:checked')).toHaveCount(0);
  });
}
