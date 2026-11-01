// T14. Hooks: data-testid fault-picker; carousel items data-picker-appliance (data-name is the label) with
// buttons data-picker-step="-1|1"; pills data-picker-fault and data-picker-unsure (aria-pressed toggles);
// textarea inside [data-picker-note]; link data-picker-whatsapp; live name [data-picker-name].
import { expect, test, type Page } from '@playwright/test';
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

const message = async (page: Page) => {
  const href = await page.locator('[data-picker-whatsapp]').getAttribute('href');
  expect(href).toContain('wa.me/966568022197');
  return new URL(href!).searchParams.get('text') ?? '';
};

for (const [path, script] of [['/', /\p{Script=Arabic}/u], ['/en', /^[^\p{Script=Arabic}]+$/u]] as const) {
  test(`T14 ${path} next and previous change the selected appliance`, async ({ page }) => {
    await visit(page, path);
    const name = page.locator('[data-picker-name]');
    const first = (await name.innerText()).trim();
    await page.locator('[data-picker-step="1"]').click();
    await expect(name).not.toHaveText(first);
    await page.locator('[data-picker-step="-1"]').click();
    await expect(name).toHaveText(first);
    await page.locator('[data-picker-step="-1"]').click();
    await expect(name, 'wraps around').not.toHaveText(first);
    await page.locator('[data-picker-step="1"]').click();
    await page.locator('[data-picker-appliance][aria-pressed="false"]:not([tabindex="-1"])').first().click();
    await expect(name, 'a neighbour click selects it').not.toHaveText(first);
  });

  test(`T14 ${path} arrow keys move the carousel`, async ({ page }) => {
    await visit(page, path);
    const name = page.locator('[data-picker-name]');
    const first = (await name.innerText()).trim();
    await page.locator('[data-picker-appliance][aria-pressed="true"]').focus();
    await page.keyboard.press('ArrowRight');
    await expect(name).not.toHaveText(first);
    await page.keyboard.press('ArrowLeft');
    await expect(name).toHaveText(first);
  });

  test(`T14 ${path} WhatsApp message carries appliance and the faults picked`, async ({ page }) => {
    await visit(page, path);
    await page.locator('[data-picker-step="1"]').click();
    const appliance = (await page.locator('[data-picker-name]').innerText()).trim();
    const faults = page.locator('[data-faults]:not([hidden]) [data-picker-fault]');
    const picks: string[] = [];
    for (const i of [0, 1]) {
      picks.push((await faults.nth(i).innerText()).trim());
      await faults.nth(i).click();
      await expect(faults.nth(i)).toHaveAttribute('aria-pressed', 'true');
    }
    await expect(page.locator('circle[data-on]'), 'one pearl per fault').toHaveCount(2);
    const text = await message(page);
    for (const pick of [appliance, ...picks]) expect(text).toContain(pick);
    expect(text).toMatch(script);
    await faults.nth(0).click();
    expect(await message(page), 'a deselected fault leaves the message').not.toContain(picks[0]!);
    await faults.nth(1).click();
    await expect(page.locator('circle[data-on]'), 'no faults, no pearls').toHaveCount(0);
  });

  test(`T14 ${path} Not sure opens a note that lands in the message`, async ({ page }) => {
    await visit(page, path);
    const note = page.locator('[data-picker-note] textarea');
    await expect(note).toBeHidden();
    const unsure = page.locator('[data-faults]:not([hidden]) [data-picker-unsure]');
    await unsure.click();
    await expect(note).toBeVisible();
    await note.fill('Switches off by itself');
    expect(await message(page)).toContain('Switches off by itself');
    await unsure.click();
    await expect(note).toBeHidden();
    expect(await message(page)).not.toContain('Switches off by itself');
  });
}
