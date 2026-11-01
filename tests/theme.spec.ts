// Phase 8.5: the theme follows the device.
import { expect, test } from '@playwright/test';
import { visit } from './lib';

const background = (page: import('@playwright/test').Page) => page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor.match(/\d+/g)!.slice(0, 3).map(Number));
const luminance = (rgb: number[]) => rgb.reduce((a, b) => a + b, 0) / 3;

test('theme: color-scheme meta exists, dark is dark and light is light', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await visit(page, '/');
  await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', /light dark/);
  expect(luminance(await background(page))).toBeLessThan(60);
  await page.emulateMedia({ colorScheme: 'light' });
  expect(luminance(await background(page))).toBeGreaterThan(200);
});
