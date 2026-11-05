// The home hero's picture carousel: first picture only until the page is done, the rest attached from script, a pause button, none of it under reduced motion.
import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { content } from '../src/content';
import { visit } from './lib';

const provenance = JSON.parse(readFileSync('src/images/provenance.json', 'utf8')) as Record<string, unknown>;
const SCENES = ['ac', 'fridge', 'washer', 'rooftop'];
const pages = [
  { lang: 'ar', path: '/' },
  { lang: 'en', path: '/en' },
] as const;
const slidesOf = (lang: 'ar' | 'en') => SCENES.map((scene) => `hero-${scene}-${lang}`).filter((name) => name in provenance);

/** Hero picture requests, collected from the start. */
const watchHero = (page: Page) => {
  const urls: string[] = [];
  page.on('request', (request) => {
    if (/\/images\/hero-/.test(request.url())) urls.push(new URL(request.url()).pathname);
  });
  return urls;
};

for (const { lang, path } of pages) {
  const slides = slidesOf(lang);

  test.describe(`hero carousel ${path} (motion allowed)`, () => {
    test.use({ contextOptions: { reducedMotion: 'no-preference' } });

    test(`only the first picture is fetched before load ${path}`, async ({ page }) => {
      const urls = watchHero(page);
      const response = await page.goto(path, { waitUntil: 'load' });
      expect(response?.status()).toBe(200);
      if (slides.length === 0) {
        expect(urls, 'no hero images exist yet: plain teal').toEqual([]);
        await expect(page.locator('[data-hero] img')).toHaveCount(0);
        return;
      }
      expect(urls.length, 'the first picture is fetched').toBeGreaterThan(0);
      for (const url of urls) expect(url, 'before load only slide one').toContain(slides[0]);
      const first = page.locator('[data-hero] [data-slide] img').first();
      await expect(first).toHaveAttribute('fetchpriority', 'high');
      await expect(first).toHaveAttribute('alt', '');
    });

    test(`the next picture attaches after load and crossfades ${path}`, async ({ page }) => {
      test.skip(slides.length < 2, 'fewer than two hero pictures exist');
      test.setTimeout(40_000);
      await visit(page, path);
      const second = page.locator('[data-hero] [data-slide]').nth(1);
      await expect(second.locator('img')).toHaveAttribute('src', /hero-/, { timeout: 8000 });
      await expect(second).toHaveAttribute('data-active', '', { timeout: 15_000 });
      // No dip: the picture on screen stays fully opaque under the one fading in.
      await expect(second).toHaveAttribute('data-entering', '');
      await expect(page.locator('[data-hero] [data-slide]').first()).toHaveCSS('opacity', '1');
      const duration = await second.evaluate((el) => getComputedStyle(el).transitionDuration);
      expect(duration, 'a 1.2 s crossfade').toBe('1.2s');
    });

    test(`the pause button stops the carousel ${path}`, async ({ page }) => {
      test.skip(slides.length < 2, 'fewer than two hero pictures exist');
      test.setTimeout(40_000);
      await visit(page, path);
      const toggle = page.locator('[data-hero-toggle]');
      await expect(toggle).toBeVisible();
      const box = await toggle.boundingBox();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
      await expect(toggle).toHaveAttribute('aria-label', content[lang].home.hero.pause);
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-label', content[lang].home.hero.play);
      // Longer than the load delay plus one dwell: a running carousel would have moved on by now.
      await page.waitForTimeout(9000);
      await expect(page.locator('[data-hero] [data-slide]').first()).toHaveAttribute('data-active', '');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-label', content[lang].home.hero.pause);
      await expect(page.locator('[data-hero] [data-slide]').nth(1)).toHaveAttribute('data-active', '', { timeout: 15_000 });
    });
  });

  test.describe(`hero carousel ${path} (reduced motion)`, () => {
    test.use({ contextOptions: { reducedMotion: 'reduce' } });

    test(`reduced motion fetches only the first picture and hides the button ${path}`, async ({ page }) => {
      test.setTimeout(30_000);
      const urls = watchHero(page);
      await visit(page, path);
      await page.waitForTimeout(9000);
      for (const url of urls) expect(url).toContain(slides[0]);
      await expect(page.locator('[data-hero-toggle]')).toBeHidden();
      await expect(page.locator('[data-hero] [data-slide][data-active]')).toHaveCount(slides.length ? 1 : 0);
    });
  });

  test(`hero pictures are generated, and the appliance cluster is gone ${path}`, async ({ page }) => {
    await visit(page, path);
    await expect(page.locator('[data-hero]')).toHaveCount(1);
    await expect(page.locator('[data-hero] [data-job]')).toHaveCount(0);
    const sources = await page.locator('[data-hero] img').evaluateAll((imgs) => imgs.map((img) => img.getAttribute('src') ?? img.getAttribute('data-src') ?? ''));
    for (const src of sources) expect(src, 'only hero pictures live in the hero').toMatch(/\/images\/hero-/);
    expect(sources.some((src) => /\/(fridge|window-ac|split-ac-indoor|washer|dryer)-\d+\./.test(src))).toBe(false);
    expect(sources.length).toBe(slides.length);
  });

  test(`the hero drops the hours line and the all-services link ${path}`, async ({ page }) => {
    await visit(page, path);
    await expect(page.locator('[data-hero] a[href$="/services"]')).toHaveCount(0);
    await expect(page.locator('[data-hero] [data-icon="clock"]')).toHaveCount(0);
  });
}
