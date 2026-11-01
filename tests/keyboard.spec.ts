// T9. Hooks for later phases: data-testid menu-toggle, menu, language-link, fault-picker;
// data-picker-appliance, data-picker-fault, data-picker-area, data-picker-whatsapp; form#lead-form.
import { expect, test, type Page } from '@playwright/test';
import { visit } from './lib';

const tabTo = async (page: Page, selector: string) => {
  await expect(page.locator(selector).first(), selector).toBeAttached({ timeout: 2000 });
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press('Tab');
    if (await page.evaluate((s) => document.activeElement?.matches(s) ?? false, selector)) return;
  }
  throw new Error(`Tab never reached ${selector}`);
};

test('T9 language link works by keyboard', async ({ page }) => {
  await visit(page, '/');
  await tabTo(page, '[data-testid="language-link"]');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/en$/);
});

test('T9 phone menu opens and closes by keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await visit(page, '/');
  await tabTo(page, '[data-testid="menu-toggle"]');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('menu')).toBeHidden();
  await expect(page.getByTestId('menu-toggle')).toBeFocused();
});

test('T9 fault picker completes by keyboard', async ({ page }) => {
  await visit(page, '/');
  for (const step of ['appliance', 'fault', 'area']) {
    await tabTo(page, `[data-picker-${step}]`);
    await page.keyboard.press('Enter');
  }
  await tabTo(page, '[data-picker-whatsapp]');
  await expect(page.locator('[data-picker-whatsapp]')).toHaveAttribute('href', /wa\.me/);
});

test('T9 lead form completes by keyboard', async ({ page }) => {
  await visit(page, '/contact');
  await tabTo(page, '#lead-form input[name="name"]');
  await page.keyboard.type('Test');
  await tabTo(page, '#lead-form input[name="phone"]');
  await page.keyboard.type('0500000000');
  await tabTo(page, '#lead-form button[type="submit"]');
});
