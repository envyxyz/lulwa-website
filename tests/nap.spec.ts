// T7. Name, address, phone: one spelling everywhere, read from src/site.ts. Runs on every page that exists.
import { expect, test, type Page } from '@playwright/test';
import { site } from '../src/site';
import { builtRoutes, visit } from './lib';

const RETIRED = ['0551922197', '0544006384', '0501356459'];
// Other spellings of the name that have appeared in drafts. None may be on a page.
const WRONG_NAMES = ['لولوة', 'لؤلؤة', 'Lulwa A/C', 'Lulwa Air Conditioning and', 'Lulwa AC and', 'Lulwah'];
const digits = (s: string) => s.replace(/\D/g, '');

const jsonLd = async (page: Page) => {
  const blocks = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((t) => JSON.parse(t));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- parsed JSON-LD, checked field by field below
  return blocks.flatMap((b) => b['@graph'] ?? [b]) as Record<string, any>[];
};
const langOf = (path: string) => (path === '/en' || path.startsWith('/en/') ? 'en' : 'ar') as 'ar' | 'en';
// Pages that carry the full business node, so their text must show the same address as the schema.
const carriesBusiness = (path: string) => ['/', '/en', '/contact', '/en/contact', '/about', '/en/about', '/areas/appliance-repair-in-dammam', '/en/areas/appliance-repair-in-dammam'].includes(path);

for (const path of builtRoutes()) {
  const lang = langOf(path);
  const a = site.address[lang];

  test(`T7 ${path} shows the one phone, name, address, legal name and CR`, async ({ page }) => {
    await visit(page, path);
    const text = await page.locator('body').innerText();

    // Phone: only the display form, tel and wa.me links on the one number.
    const phones = text.match(/(?:\+?966|0)\s?5[\d\s-]{7,}\d/g) ?? [];
    expect(phones.map((p) => p.trim()).filter((p) => p !== site.phone.display)).toEqual([]);
    for (const href of await page.locator('a[href^="tel:"]').evaluateAll((links) => links.map((l) => l.getAttribute('href')))) expect(href).toBe(site.phone.tel);
    for (const href of await page.locator('a[href*="wa.me"]').evaluateAll((links) => links.map((l) => l.getAttribute('href')!))) expect(href.startsWith(site.phone.whatsapp), href).toBe(true);

    // Retired numbers and the unspaced national form must not be anywhere in the page, hidden text and attributes included.
    const html = (await page.content()).replace(/(?:href|content)="[^"]*(?:wa\.me|tel:|\+966568022197)[^"]*"/g, '');
    const rest = `${text} ${html.replace(/<script[^>]*ld\+json[\s\S]*?<\/script>/g, '')}`;
    expect(rest.match(/(?<!\d)05\d{8}(?!\d)/g) ?? [], 'unspaced national number').toEqual([]);
    const all = digits(rest);
    for (const n of RETIRED) {
      expect(all.includes(n), `${n} on ${path}`).toBe(false);
      expect(all.includes(`966${n.slice(1)}`), `+966 ${n} on ${path}`).toBe(false);
    }

    // Name spellings.
    for (const wrong of WRONG_NAMES) expect(text.includes(wrong), `"${wrong}" on ${path}`).toBe(false);
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', lang === 'ar' ? site.brand.arabic : site.brand.english);

    // Address: wherever the street is written, it is the whole address, character for character.
    const streets = text.split(a.street).length - 1;
    const wholes = text.split(a.full).length - 1;
    expect(wholes, `street written without the exact address on ${path}`).toBe(streets);
    expect(text.includes(`${a.street} ${a.district}`), 'no reordered address').toBe(false);

    const footer = page.locator('footer');
    await expect(footer, 'footer exists').toHaveCount(1);
    await expect(footer).toContainText(site.phone.display);
    await expect(footer).toContainText(a.full);
    await expect(footer).toContainText(site.legal.name);
    await expect(footer).toContainText(site.legal.cr);
    if (carriesBusiness(path)) expect(text, 'page text shows the shop address').toContain(a.full);
  });

  test(`T7 ${path} JSON-LD agrees with site.ts`, async ({ page }) => {
    await visit(page, path);
    const nodes = await jsonLd(page);
    const shop = nodes.filter((n) => n['@type'] === 'HVACBusiness');
    expect(shop.length, 'business node only where it belongs').toBe(carriesBusiness(path) ? 1 : 0);
    for (const s of shop) {
      expect(s.name).toBe(lang === 'ar' ? site.brand.arabic : site.brand.english);
      expect(s.alternateName).toEqual(lang === 'ar' ? [site.brand.english, site.brand.englishAlt] : [site.brand.arabic, site.brand.englishAlt]);
      expect(s.legalName).toBe(site.legal.name);
      expect(s.telephone).toBe(site.phone.e164);
      expect(s.email).toBe(site.email);
      expect(s.address).toEqual({ '@type': 'PostalAddress', streetAddress: a.streetAddress, postalCode: site.postalCode, addressLocality: a.city, addressRegion: a.region, addressCountry: 'SA' });
      expect(`${s.address.streetAddress}${lang === 'ar' ? '، ' : ', '}${s.address.addressLocality} ${s.address.postalCode}`, 'schema address equals the page address').toBe(a.full);
      expect(s.geo).toEqual({ '@type': 'GeoCoordinates', latitude: site.geo.latitude, longitude: site.geo.longitude });
      expect(s.hasMap).toBe(site.maps.listing);
      expect(s.contactPoint.telephone).toBe(site.phone.e164);
      expect(s.identifier.value).toBe(site.legal.cr);
      expect(s.sameAs).toEqual(site.sameAs);
      expect(s.areaServed.name).toBe(a.city);
    }
    for (const n of nodes) {
      expect(JSON.stringify(n).match(/\+?966\d+|05\d{8}/g)?.every((p) => p === site.phone.e164) ?? true, `phone in ${n['@type']}`).toBe(true);
      if (n['@type'] === 'WebSite') expect(n.name).toBe(lang === 'ar' ? site.brand.arabic : site.brand.english);
    }
  });
}

test('T7 the schema business node is identical on every page that carries it', async ({ page }) => {
  for (const lang of ['ar', 'en'] as const) {
    const seen = new Set<string>();
    for (const path of builtRoutes().filter((p) => langOf(p) === lang && carriesBusiness(p))) {
      await visit(page, path);
      seen.add(JSON.stringify((await jsonLd(page)).find((n) => n['@type'] === 'HVACBusiness')));
    }
    expect(seen.size, `${lang} business node`).toBe(1);
  }
});

test('T7 the map embed names the Business Profile', () => {
  expect(site.maps.embed).toContain(encodeURIComponent('Lulwa AC & Refrigeration'));
});
