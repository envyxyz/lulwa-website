// The one services page (cards for every fault and every other appliance), the /faults redirect, and the opening hours table.
import { expect, test } from '@playwright/test';
import { visit } from './lib';

const HUBS = ['/services', '/en/services'];

for (const path of HUBS) {
  const ar = path === '/services';

  test(`${path} shows 15 fault cards in 4 categories and 5 other cards`, async ({ page }) => {
    await visit(page, path);
    await expect(page.locator('[data-hub-service]')).toHaveCount(4);
    await expect(page.locator('[data-hub-service] [data-hub-card]')).toHaveCount(15);
    await expect(page.locator('[data-hub-card]')).toHaveCount(20);
    await expect(page.locator('[data-hub-service]').first().locator('h2')).toHaveCount(1);
  });

  test(`${path} every card has a picture, a title, a description, an underlined Learn more and a live link`, async ({ page, request }) => {
    await visit(page, path);
    const cards = page.locator('[data-hub-card]');
    const total = await cards.count();
    for (let i = 0; i < total; i++) {
      const card = cards.nth(i);
      const label = `card ${i}`;
      const image = card.locator('img');
      await expect(image, `${label} image`).toHaveCount(1);
      expect(await image.getAttribute('alt'), `${label} alt attribute exists (empty: the title beside it names it)`).not.toBeNull();
      await expect(image, `${label} is not a job photo`).not.toHaveAttribute('data-job', /.*/);
      expect((await card.locator('h3').innerText()).trim().length, `${label} title`).toBeGreaterThan(1);
      expect((await card.locator('p').innerText()).trim().length, `${label} description`).toBeGreaterThan(10);
      const more = card.locator('[data-learn-more]');
      expect((await more.innerText()).trim().length, `${label} Learn more text`).toBeGreaterThan(1);
      expect(await more.evaluate((el) => getComputedStyle(el).textDecorationLine), `${label} Learn more is always underlined`).toContain('underline');
      const href = await card.getAttribute('href');
      const response = await request.get(href!, { maxRedirects: 0 });
      expect(response.status(), `${label} ${href}`).toBe(200);
    }
  });

  test(`${path} cards in a row are the same height and Learn more sits at the card bottom`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await visit(page, path);
    const rows = await page.locator('[data-hub-card]').evaluateAll((cards) => {
      const byTop = new Map<number, { height: number; gap: number }[]>();
      for (const card of cards) {
        const box = card.getBoundingClientRect();
        const more = card.querySelector('[data-learn-more]')!.getBoundingClientRect();
        const top = Math.round(box.top + scrollY);
        byTop.set(top, [...(byTop.get(top) ?? []), { height: box.height, gap: box.bottom - more.bottom }]);
      }
      return [...byTop.values()];
    });
    for (const row of rows) {
      expect(new Set(row.map((c) => Math.round(c.height))).size, 'one height per row').toBe(1);
      expect(new Set(row.map((c) => Math.round(c.gap))).size, 'Learn more at the same distance from the bottom').toBe(1);
    }
  });

  test(`${path} the arrow ${ar ? 'is mirrored' : 'points the written direction (not mirrored)'}`, async ({ page }) => {
    await visit(page, path);
    const flips = await page.locator('[data-hub-card] [data-icon="arrow-next"], [data-hub-service] > div > a [data-icon="arrow-next"]').evaluateAll((icons) =>
      icons.map((icon) => {
        const style = getComputedStyle(icon);
        const scale = style.scale === 'none' ? 1 : Number.parseFloat(style.scale);
        const matrix = style.transform === 'none' ? 1 : new DOMMatrix(style.transform).a;
        return scale * matrix < 0;
      }),
    );
    expect(flips.length).toBeGreaterThan(20);
    expect(new Set(flips)).toEqual(new Set([ar]));
  });

  test(`${path} has no fault picture marked as a job photo and no sideways scroll at 320`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await visit(page, path);
    await expect(page.locator('[data-hub-card] img[data-job]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  });

  test(`${path} links each of the 15 faults to its answer on the service page, never to /faults`, async ({ page }) => {
    await visit(page, path);
    await expect(page.locator('a[href*="/faults"]')).toHaveCount(0);
    await expect(page.locator('main a[href*="/services/"][href*="#"]')).toHaveCount(15);
  });
}

test('/faults, /en/faults and the preview-only fault URLs go to the services page in one hop', async ({ request }) => {
  const cases: [string, string][] = [
    ['/faults', '/services'],
    ['/faults/', '/services'],
    ['/faults.html', '/services'],
    ['/faults/index.html', '/services'],
    ['/en/faults', '/en/services'],
    ['/en/faults/', '/en/services'],
    ['/en/faults.html', '/en/services'],
    ['/faults/ac-not-cooling', '/services'],
    ['/en/faults/ac-not-cooling', '/en/services'],
  ];
  for (const [from, to] of cases) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), `${from} should be 301`).toBe(301);
    expect(new URL(response.headers()['location']!, 'http://x').pathname, `${from} target`).toBe(to);
    expect((await request.get(to, { maxRedirects: 0 })).status(), `${to} is 200`).toBe(200);
  }
});

// Opening hours: the day and the hours never wrap, whatever day it is and whichever language.
// 1 Nov 2026 is a Sunday. The shop's day is UTC+3, so noon UTC is the same date there.
for (const path of ['/', '/en']) {
  for (const width of [390, 320]) {
    for (let day = 0; day < 7; day++) {
      test(`hours table ${path} at ${width}, day ${day}: every row is one line and today is marked`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.clock.setFixedTime(new Date(Date.UTC(2026, 10, 1 + day, 12)));
        await visit(page, path);
        const rows = page.locator('tr[data-day]');
        await expect(rows).toHaveCount(7);
        await expect(page.locator(`tr[data-day="${day}"]`)).toHaveAttribute('aria-current', 'date');
        await expect(page.locator('tr[data-day][aria-current]')).toHaveCount(1);
        const facts = await rows.evaluateAll((trs) =>
          trs.map((tr) => {
            const [th, td] = [...tr.children] as HTMLElement[];
            // Content height (padding taken off) under one and a half lines of its own text.
            const single = (cell: HTMLElement) => {
              const style = getComputedStyle(cell);
              return cell.getBoundingClientRect().height - Number.parseFloat(style.paddingTop) - Number.parseFloat(style.paddingBottom) < Number.parseFloat(style.lineHeight) * 1.5;
            };
            return { oneLine: single(th!) && single(td!), fits: tr.getBoundingClientRect().right <= innerWidth };
          }),
        );
        expect(facts.every((f) => f.oneLine), 'no row wraps').toBe(true);
        expect(facts.every((f) => f.fits), 'no row runs past the screen').toBe(true);
        // Below sm the word "Today" stays for screen readers only.
        const word = await page.locator(`tr[data-day="${day}"] [data-today]`).evaluate((el) => ({ w: el.getBoundingClientRect().width, hidden: el.hasAttribute('hidden') }));
        expect(word.hidden).toBe(false);
        expect(word.w, 'visually hidden below sm').toBeLessThanOrEqual(1);
        expect(await page.locator(`tr[data-day="${day}"] th`).evaluate((el) => getComputedStyle(el).color)).not.toBe(await page.locator(`tr[data-day="${(day + 1) % 7}"] th`).evaluate((el) => getComputedStyle(el).color));
      });
    }
  }
}
