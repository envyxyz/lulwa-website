// T14. Hooks: data-testid fault-picker; buttons with data-picker-appliance, data-picker-fault,
// data-picker-area whose text is the label; link data-picker-whatsapp.
import { expect, test } from '@playwright/test';
import { visit } from './lib';

test.describe('without JS', () => {
  test.use({ javaScriptEnabled: false });
  test('T14 the picker is plain links to service and fault pages', async ({ page }) => {
    await visit(page, '/');
    const links = page.locator('[data-testid="fault-picker"] a[href]');
    await expect(links.first(), 'picker has links').toBeAttached({ timeout: 2000 });
    const hrefs = await links.evaluateAll((all) => all.map((a) => a.getAttribute('href') ?? ''));
    expect(hrefs.filter((href) => /^\/(services|faults)\//.test(href)).length).toBeGreaterThan(0);
  });
});

for (const [path, script] of [['/', /\p{Script=Arabic}/u], ['/en', /^[^\p{Script=Arabic}]+$/u]] as const) {
  test(`T14 ${path} WhatsApp message carries appliance, fault and area`, async ({ page }) => {
    await visit(page, path);
    const picks: string[] = [];
    for (const step of ['appliance', 'fault', 'area']) {
      const option = page.locator(`[data-picker-${step}]`).first();
      await expect(option, `${step} option`).toBeAttached({ timeout: 2000 });
      picks.push((await option.innerText()).trim());
      await option.click();
    }
    const href = await page.locator('[data-picker-whatsapp]').getAttribute('href');
    expect(href).toContain('wa.me/966568022197');
    const message = new URL(href!).searchParams.get('text') ?? '';
    for (const pick of picks) expect(message).toContain(pick);
    expect(message).toMatch(script);
  });
}
