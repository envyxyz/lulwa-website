// T3
import { expect, test, type Page } from '@playwright/test';
import { site } from '../src/site';
import { allRoutes, visit } from './lib';

const read = async (page: Page, path: string) => {
  await visit(page, path);
  return {
    title: await page.title(),
    description: await page.locator('meta[name="description"]').getAttribute('content'),
    canonical: await page.locator('link[rel="canonical"]').getAttribute('href', { timeout: 2000 }).catch(() => null),
    h1: await page.locator('h1').count(),
  };
};

for (const path of allRoutes()) {
  test(`T3 ${path} has title, description, canonical, one h1`, async ({ page }) => {
    const { title, description, canonical, h1 } = await read(page, path);
    expect(title).toBeTruthy();
    expect(description).toBeTruthy();
    if (!path.startsWith('/en')) expect([...title].length, 'Arabic title length').toBeLessThanOrEqual(70);
    expect(canonical).toBe(`${site.url}${path}`);
    expect(h1).toBe(1);
  });
}

test('T3 titles and descriptions are unique', async ({ page }) => {
  const seen = new Map<string, string>();
  for (const path of allRoutes()) {
    const { title, description } = await read(page, path);
    for (const value of [title, description ?? '']) {
      expect(seen.get(value), `"${value}" on ${path}`).toBeUndefined();
      seen.set(value, path);
    }
  }
});

// Google shows a favicon only from a square icon whose size is a multiple of 48 px, at a crawlable URL.
test('home links a 48-multiple icon that loads, and the ico is real', async ({ page, request }) => {
  await visit(page, '/');
  const icons = await page.locator('link[rel="icon"][sizes]').evaluateAll((els) => els.map((e) => ({ href: e.getAttribute('href')!, sizes: e.getAttribute('sizes')! })));
  const ok = icons.filter((i) => i.href.startsWith('/') && i.sizes.split(' ').some((s) => { const [w = 0, h = 0] = s.split('x').map(Number); return w === h && w % 48 === 0; }));
  expect(ok.length).toBeGreaterThan(0);
  for (const i of ok) expect((await request.get(i.href)).status(), i.href).toBe(200);
  await expect(page.locator('link[rel="icon"][href="/favicon.ico"]')).toHaveAttribute('sizes', '48x48');
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', '/favicon.svg');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
  // The ico carries 16, 32 and 48, and its first entry is a real image.
  const ico = await (await request.get('/favicon.ico')).body();
  expect(ico.readUInt16LE(2)).toBe(1);
  expect([0, 1, 2].map((i) => ico[6 + 16 * i])).toEqual([16, 32, 48]);
  for (const file of ['/favicon-32.png', '/favicon-48.png', '/favicon-96.png', '/favicon-192.png', '/apple-touch-icon.png', '/mstile-150x150.png', '/images/icons/icon-192x192.png', '/images/icons/icon-512x512.png', '/images/icons/icon-192x192-maskable.png', '/images/icons/icon-512x512-maskable.png']) {
    const body = await (await request.get(file)).body();
    expect(body.subarray(1, 4).toString(), file).toBe('PNG');
    expect(body.readUInt32BE(16), `${file} is square`).toBe(body.readUInt32BE(20));
  }
});

test('T3 the head carries the old site tags, per page', async ({ page }) => {
  for (const [path, lang] of [['/', 'ar'], ['/en', 'en']] as const) {
    await visit(page, path);
    const meta = (selector: string) => page.locator(selector).getAttribute('content');
    expect(await meta('meta[name="google-site-verification"]')).toBe(site.verification.google);
    expect(await meta('meta[name="author"]')).toBeTruthy();
    expect(await meta('meta[name="theme-color"][media*="light"]')).toBeTruthy();
    expect(await meta('meta[name="theme-color"][media*="dark"]')).toBeTruthy();
    expect(await meta('meta[name="geo.region"]')).toBe('SA-04');
    expect(await meta('meta[name="geo.placename"]')).toBe(site.address[lang].city);
    expect(await meta('meta[name="geo.position"]')).toBe(`${site.geo.latitude};${site.geo.longitude}`);
    expect(await meta('meta[name="ICBM"]')).toBe(`${site.geo.latitude}, ${site.geo.longitude}`);
    const image = `${site.url}${site.images.og}`;
    for (const name of ['og:image', 'og:image:secure_url', 'twitter:image']) expect(await meta(`meta[property="${name}"], meta[name="${name}"]`), name).toBe(image);
    expect(await meta('meta[property="og:image:type"]')).toBe('image/png');
    expect(await meta('meta[property="og:image:width"]')).toBe('1200');
    expect(await meta('meta[property="og:image:height"]')).toBe('630');
    for (const name of ['og:image:alt', 'twitter:image:alt']) expect(await meta(`meta[property="${name}"], meta[name="${name}"]`), name).toBeTruthy();
    expect(await meta('meta[property="og:locale:alternate"]')).toBe(lang === 'ar' ? 'en_US' : 'ar_SA');
    expect(await meta('meta[name="twitter:title"]')).toBe(await page.title());
    expect(await meta('meta[name="twitter:description"]')).toBe(await meta('meta[name="description"]'));
    expect(await meta('meta[name="twitter:url"]')).toBe(await page.locator('link[rel="canonical"]').getAttribute('href'));
    expect(await meta('meta[name="msapplication-config"]')).toBe('/browserconfig.xml');
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.json');
    await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute('href', lang === 'ar' ? '/blog/rss.xml' : '/en/blog/rss.xml');
    await expect(page.locator('link[rel="alternate"][type="text/plain"]')).toHaveAttribute('href', '/llms.txt');
    expect(await page.locator('meta[name="keywords"]').count(), 'no meta keywords').toBe(0);
  }
});

test('T3 posts carry article:modified_time', async ({ page }) => {
  await visit(page, '/blog/ac-repair-in-dammam');
  await expect(page.locator('meta[property="article:modified_time"]')).toHaveAttribute('content', /^\d{4}-\d\d-\d\d$/);
});

test('T3 crawl files are served', async ({ request }) => {
  const get = async (path: string) => {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    return response.text();
  };
  const robots = await get('/robots.txt');
  for (const bot of ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Googlebot', 'Googlebot-Image', 'Bingbot', 'Applebot', 'Applebot-Extended', 'Amazonbot', 'Meta-ExternalAgent', 'FacebookBot', 'CCBot', 'Bytespider', 'DuckAssistBot', 'MistralAI-User', 'cohere-ai']) {
    expect(robots, bot).toMatch(new RegExp(`User-agent: ${bot}\\nAllow: /\\n`));
  }
  for (const closed of ['/thanks', '/en/thanks', '/contact-submit.php', '/logs/']) expect(robots).toContain(`Disallow: ${closed}`);
  expect(robots).toContain(`Sitemap: ${site.url}/sitemap-index.xml`);
  expect(robots).toContain('Allow: /llms.txt');
  expect(await get('/ai.txt')).toContain('User-agent: GPTBot');
  expect(await get('/.well-known/security.txt')).toContain(`mailto:${site.email}`);
  for (const file of ['/llms.txt', '/llms-full.txt']) {
    const text = await get(file);
    for (const line of [site.address.ar.full, site.address.en.full, site.phone.display, site.email, site.hours.text.ar, site.hours.text.en, site.legal.name, site.legal.cr]) expect(text, `${file}: ${line}`).toContain(line);
    expect(text.indexOf('Confirmed facts'), `${file}: facts first`).toBeLessThan(text.indexOf('/services/'));
  }
  const manifest = JSON.parse(await get('/manifest.json'));
  expect(manifest.lang).toBe('ar');
  expect(manifest.start_url).toBe('/');
  expect(JSON.stringify(manifest)).not.toContain('/brands/index.html');
  for (const file of [...manifest.icons, ...manifest.shortcuts.flatMap((s: { icons: { src: string }[] }) => s.icons)].map((i: { src: string }) => i.src)) expect((await request.get(file)).status(), file).toBe(200);
  expect(await get('/browserconfig.xml')).toContain('/mstile-150x150.png');
  for (const file of ['/images/og-default.png', '/images/brand/lulwa-logo.png']) expect((await request.get(file)).status(), file).toBe(200);
  for (const file of ['/blog/rss.xml', '/en/blog/rss.xml']) expect(await get(file)).toContain('<rss version="2.0"');
});
