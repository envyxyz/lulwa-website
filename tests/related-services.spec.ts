// T23. Every service page ends with three links to other services and one to the hub, in its own language.
import { expect, test } from '@playwright/test';
import { ar } from '../src/content/ar';
import { en } from '../src/content/en';
import { enTwin, visit } from './lib';

const all = (c: typeof ar | typeof en) => [...c.services.items, ...c.services.more];
const slugs = all(ar).map((item) => item.slug);
const norm = (href: string) => href.replace(/\/$/, '');

for (const lang of ['ar', 'en'] as const) {
  const names = new Map(all(lang === 'ar' ? ar : en).map((item) => [item.slug, item.name]));
  const prefix = lang === 'ar' ? '' : '/en';
  for (const slug of slugs) {
    const path = `/services/${slug}`;
    const url = lang === 'ar' ? path : enTwin(path);
    test(`T23 ${url} ends with 3 related services and a hub link`, async ({ page }) => {
      await visit(page, url);
      await expect(page.locator('main > :last-child')).toHaveAttribute('id', 'related');

      const cards = page.locator('#related ul a');
      await expect(cards).toHaveCount(3);
      const hrefs = (await cards.evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''))).map(norm);
      const texts = await cards.evaluateAll((els) => els.map((el) => el.textContent ?? ''));

      expect(new Set(hrefs).size, 'card links are unique').toBe(3);
      hrefs.forEach((href, i) => {
        expect(href, 'not the current page').not.toBe(`${prefix}${path}`);
        const match = href.match(new RegExp(`^${prefix}/services/([^/]+)$`));
        expect(match, `${href} is a ${lang} service link`).not.toBeNull();
        const target = match![1]!;
        expect(slugs, `${target} is a known service`).toContain(target);
        expect(texts[i], `${href} card names the service`).toContain(names.get(target)!);
      });

      const hub = await page.locator('#related a').evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));
      expect(hub.map(norm), 'links to the services hub').toContain(`${prefix}/services`);
    });
  }
}
