// Smooth scroll: loads on first touch, stays under the speed cap, and stays off under reduced motion.
import { expect, test } from '@playwright/test';
import { visit } from './lib';

const CAP = 1800; // px/s, MAX_LEAD x LERP x 60 in src/scripts/motion.ts
const SLACK = 1.4; // a slow frame covers more ground in one step

test.describe('with motion allowed', () => {
  test.use({ contextOptions: { reducedMotion: 'no-preference' } });

  test('a hard flick stays under the speed cap and still moves', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await visit(page, '/en');
    await page.mouse.move(700, 450);
    await page.mouse.wheel(0, 10);
    await expect(page.locator('html.lenis')).toBeAttached();

    const sampling = page.evaluate(
      () =>
        new Promise<number[]>((done) => {
          const samples: number[] = [];
          const start = performance.now();
          const tick = () => {
            samples.push(window.scrollY);
            if (performance.now() - start < 1500) requestAnimationFrame(tick);
            else done(samples);
          };
          requestAnimationFrame(tick);
        }),
    );
    for (let i = 0; i < 30; i++) await page.mouse.wheel(0, 800);
    const samples = await sampling;

    const moved = samples.at(-1)! - samples[0]!;
    expect(moved, 'the page scrolled').toBeGreaterThan(300);
    expect(moved / 1.5, 'average px/s').toBeLessThanOrEqual(CAP * SLACK);
  });

  test('sections below the fold end up visible', async ({ page }) => {
    await visit(page, '/en');
    await page.mouse.wheel(0, 10);
    await expect(page.locator('html.lenis')).toBeAttached();
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    const hidden = await page.evaluate(() => {
      const bottom = document.querySelector('main')!.lastElementChild!;
      bottom.scrollIntoView();
      return getComputedStyle(bottom).opacity;
    });
    expect(hidden).toBe('1');
  });
});

test('reduced motion never loads smooth scroll', async ({ page }) => {
  await visit(page, '/en');
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(500);
  await expect(page.locator('html.lenis')).toHaveCount(0);
});
