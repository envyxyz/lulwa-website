// The floating Call and WhatsApp buttons: on the home page after the hero, on every other page from the start, and the header no longer carries them.
import { expect, test, type Page } from '@playwright/test';
import { site } from '../src/site';
import { visit } from './lib';

const homes = ['/', '/en'];
const others = ['/services', '/en/services'];
const float = (page: Page) => page.locator('[data-float]');

const scrollPastHero = (page: Page) =>
  page.evaluate(() => {
    const hero = document.querySelector('[data-hero]')!.getBoundingClientRect();
    scrollTo(0, hero.bottom + scrollY + 40);
  });

for (const path of homes) {
  test(`float is hidden at the top, shown after the hero, hidden again at the top ${path}`, async ({ page }) => {
    await visit(page, path);
    await expect(float(page)).toBeHidden();
    await scrollPastHero(page);
    await expect(float(page)).toBeVisible();
    await expect(float(page)).toHaveCSS('opacity', '1');
    await page.evaluate(() => scrollTo(0, 0));
    await expect(float(page)).toBeHidden();
  });

  test(`float links cannot be focused while hidden ${path}`, async ({ page }) => {
    await visit(page, path);
    const focused = await page.evaluate(() => {
      const link = document.querySelector<HTMLElement>('[data-float] a')!;
      link.focus();
      return document.activeElement === link;
    });
    expect(focused).toBe(false);
    await scrollPastHero(page);
    await expect(float(page)).toHaveCSS('opacity', '1');
    const focusedNow = await page.evaluate(() => {
      const link = document.querySelector<HTMLElement>('[data-float] a')!;
      link.focus();
      return document.activeElement === link;
    });
    expect(focusedNow).toBe(true);
  });
}

for (const path of [...homes, ...others]) {
  const home = homes.includes(path);

  test(`float links go to the one number ${path}`, async ({ page }) => {
    await visit(page, path);
    await expect(float(page).locator('[data-action="call"]')).toHaveAttribute('href', site.phone.tel);
    await expect(float(page).locator('[data-action="whatsapp"]')).toHaveAttribute('href', site.phone.whatsapp);
    await expect(float(page).locator('a')).toHaveCount(2);
  });

  for (const width of [390, 1440]) {
    test(`float buttons are at least 44 px, not a bar, and the header has no WhatsApp link at ${width} ${path}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await visit(page, path);
      if (home) {
        await scrollPastHero(page);
        await expect(float(page)).toHaveCSS('opacity', '1');
      }
      for (const link of await float(page).locator('a').all()) {
        await expect(link).toBeVisible();
        const box = (await link.boundingBox())!;
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width, 'a button, not a bar').toBeLessThan(width / 4);
      }
      const bounds = (await float(page).boundingBox())!;
      expect(bounds.x + bounds.width, 'inside the viewport').toBeLessThanOrEqual(width);
      await expect(page.locator('header a[href*="wa.me"]:visible')).toHaveCount(0);
      await expect(page.locator('header a[href^="tel:"]:visible')).toHaveCount(0);
    });
  }

  test(`float leaves when the footer comes into view, and the footer has no spare room below it ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await visit(page, path);
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await expect(float(page)).toBeHidden();
    const paddingEnd = await page.locator('body > footer').evaluate((el) => getComputedStyle(el).paddingBlockEnd);
    expect(paddingEnd).toBe('0px');
  });

  test(`no sideways scroll at 320 ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await visit(page, path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  });
}

for (const path of others) {
  test(`float is visible at load ${path}`, async ({ page }) => {
    await visit(page, path);
    await expect(float(page)).toBeVisible();
    await expect(page.locator('[data-hero]')).toHaveCount(0);
  });
}
