// T2. Every url-map row is a real 200 page at its original path; every other way in is a one-hop 301. Runs on real Apache (scripts/serve-apache.mjs) so the shipped .htaccess is what is tested.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test, type APIRequestContext } from '@playwright/test';
import { DOCROOT, urlMap } from './lib';

const rows = urlMap();
const hubs = new Set(['/services', '/areas', '/brands', '/blog']);
const pathOf = (location: string) => decodeURIComponent(new URL(location, 'http://x').pathname);

const get = (request: APIRequestContext, path: string, headers?: Record<string, string>) => request.get(path, { maxRedirects: 0, headers });

/** Expect one 301 to `target`, and that `target` answers 200 with no further redirect. */
const oneHop = async (request: APIRequestContext, from: string, target: string) => {
  const response = await get(request, from);
  expect(response.status(), `${from} should be 301`).toBe(301);
  expect(pathOf(response.headers()['location'] ?? ''), `${from} target`).toBe(target);
  expect((await get(request, target)).status(), `${target} should be 200 (one hop only)`).toBe(200);
};

for (const { old_path, english_twin } of rows) {
  test(`T2 ${old_path} is 200 with no redirect`, async ({ request }) => {
    expect((await get(request, old_path)).status()).toBe(200);
  });

  test(`T2 ${english_twin} is 200 with no redirect`, async ({ request }) => {
    expect((await get(request, english_twin)).status()).toBe(200);
  });

  // The .html form: leaf pages are x.html, hubs are folder/index.html, the home page is index.html.
  test(`T2 ${old_path}.html goes to ${old_path} in one hop`, async ({ request }) => {
    const html = old_path === '/' ? '/index.html' : hubs.has(old_path) ? `${old_path}/index.html` : `${old_path}.html`;
    await oneHop(request, html, old_path);
  });

  if (old_path !== '/') {
    test(`T2 ${old_path}/ goes to ${old_path} in one hop`, async ({ request }) => {
      await oneHop(request, `${old_path}/`, old_path);
    });
  }
}

test('T2 /en/ and /en/index.html go to /en, and /en/about stays 200', async ({ request }) => {
  await oneHop(request, '/en/', '/en');
  await oneHop(request, '/en/index.html', '/en');
  await oneHop(request, '/en.html', '/en');
  expect((await get(request, '/en/about')).status()).toBe(200);
  expect((await get(request, '/en/services')).status()).toBe(200);
});

test('T2 old Arabic-slug /ar/... URLs go to the root pages in one hop', async ({ request }) => {
  const cases: [string, string][] = [
    ['/ar', '/'],
    ['/ar/', '/'],
    ['/ar/من-نحن', '/about'],
    ['/ar/اتصل-بنا', '/contact'],
    ['/ar/خدمات', '/services'],
    ['/ar/ماركات', '/brands'],
    ['/ar/المناطق', '/areas'],
    ['/ar/خدمات/إصلاح-المكيفات', '/services/ac-repair'],
    ['/ar/خدمات/إصلاح-الغسالات/', '/services/washing-machine-repair'],
    ['/ar/about', '/about'],
  ];
  for (const [from, to] of cases) await oneHop(request, from, to);
});

test('T2 root-slug aliases go to the real page in one hop', async ({ request }) => {
  await oneHop(request, '/ac-repair', '/services/ac-repair');
  await oneHop(request, '/ac-repair.html', '/services/ac-repair');
  await oneHop(request, '/washing-machine-repair', '/services/washing-machine-repair');
  await oneHop(request, '/en/ac-repair', '/en/services/ac-repair');
});

for (const { old_path } of rows.filter((r) => /^\/(areas|brands)\/./.test(r.old_path))) {
  test(`T2 root alias ${old_path.replace(/^\/[a-z]+/, '')} goes to ${old_path}`, async ({ request }) => {
    await oneHop(request, old_path.replace(/^\/[a-z]+/, ''), old_path);
  });
}

test('T2 case and slash fixes are one hop and a correct URL never loops', async ({ request }) => {
  await oneHop(request, '/Services', '/services');
  await oneHop(request, '/SERVICES/ac-repair', '/services/ac-repair');
  await oneHop(request, '/services//ac-repair', '/services/ac-repair');
  for (const path of ['/services', '/areas', '/brands', '/blog']) expect((await get(request, path)).status(), path).toBe(200);
});

test('T2 retired blog and utility URLs go to /blog or /', async ({ request }) => {
  await oneHop(request, '/blog/category/ac', '/blog');
  await oneHop(request, '/blog/tag/ac', '/blog');
  await oneHop(request, '/blog/search', '/blog');
  await oneHop(request, '/offline', '/');
  await oneHop(request, '/500', '/');
});

test('T2 www, http and the old second domain go to the canonical host in one hop', async ({ request }) => {
  const www = await get(request, '/about', { host: 'www.lulwa.com.sa' });
  expect(www.status()).toBe(301);
  expect(www.headers()['location']).toBe('https://lulwa.com.sa/about');
  const old = await get(request, '/', { host: 'automaticwashingmachine.com' });
  expect(old.status()).toBe(301);
  expect(old.headers()['location']).toBe('https://lulwa.com.sa/services/washing-machine-repair');
  const apex = await get(request, '/about', { host: 'lulwa.com.sa' });
  expect(apex.status()).toBe(301);
  expect(apex.headers()['location']).toBe('https://lulwa.com.sa/about');
});

test('T2 hidden, private and old server files are closed', async ({ request }) => {
  for (const path of ['/.env', '/.git/config', '/.htaccess', '/logs/contact-submissions.log', '/logs/index.html', '/logs/.htaccess', '/logs/contact-rate-0.cnt', '/package.json', '/pnpm-lock.yaml', '/x.sql']) {
    expect((await get(request, path)).status(), path).toBe(403);
  }
  expect((await get(request, '/.well-known/security.txt')).status(), '.well-known is not blocked').not.toBe(403);
  // A folder URL with a slash goes to the slash-less one, which is closed too.
  expect((await request.get('/logs/')).status()).toBe(403);
});

test('T2 old admin, API and .php endpoints are gone, the form handler is not', async ({ request }) => {
  for (const path of ['/admin', '/admin/login', '/api/analytics/ingest', '/api/analytics/session-end', '/index.php', '/wp-login.php', '/blog/article.php', '/blog/rss.php']) {
    expect([404, 410], path).toContain((await get(request, path)).status());
  }
  expect((await get(request, '/contact-submit.php')).status(), 'GET is refused, not hidden').toBe(405);
});

test('T2 security headers are on the pages', async ({ request }) => {
  for (const path of ['/', '/en', '/services/ac-repair']) {
    const h = (await get(request, path)).headers();
    expect(h['x-content-type-options'], path).toBe('nosniff');
    expect(h['x-frame-options'], path).toBe('DENY');
    expect(h['referrer-policy'], path).toBe('strict-origin-when-cross-origin');
    expect(h['permissions-policy'], path).toContain('camera=()');
    const csp = h['content-security-policy'] ?? '';
    for (const part of [
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self'",
      "form-action 'self'",
      'frame-src https://www.google.com https://www.googletagmanager.com',
      'https://c.bing.com',
      'https://*.analytics.google.com',
    ]) {
      expect(csp, `${path} CSP`).toContain(part);
    }
  }
});

test('T2 caching: pages revalidate, hashed assets are immutable for a year, images six months', async ({ request }) => {
  const home = await (await request.get('/')).text();
  const asset = home.match(/(?:href|src)="(\/_astro\/[^"]+\.(?:css|js))"/)?.[1];
  expect(asset, 'home page links a hashed /_astro/ file').toBeTruthy();
  expect((await get(request, '/')).headers()['cache-control']).toContain('must-revalidate');
  expect((await get(request, asset!)).headers()['cache-control']).toBe('public, max-age=31536000, immutable');
  const font = home.match(/(?:href|src)="(\/fonts\/[^"]+\.woff2)"/)?.[1];
  if (font) expect((await get(request, font)).headers()['cache-control']).toBe('public, max-age=31536000, immutable');
  const image = home.match(/(?:href|src)="(\/images\/[^"]+\.(?:png|jpe?g|webp|avif))"/)?.[1];
  expect(image, 'home page links an /images/ file').toBeTruthy();
  expect((await get(request, image!)).headers()['cache-control']).toContain('max-age=15552000');
});

test('T2 a bad URL is a real 404, and /en/ shows the English page', async ({ request }) => {
  const ar = await get(request, '/this-page-does-not-exist');
  expect(ar.status()).toBe(404);
  expect(await ar.text()).toContain('lang="ar"');
  const en = await get(request, '/en/this-page-does-not-exist');
  expect(en.status()).toBe(404);
  expect(await en.text()).toContain('lang="en"');
  expect((await get(request, '/en/services/nope')).status()).toBe(404);
  expect((await get(request, '/404')).status(), 'the 404 page is not a clean URL').toBe(404);
});

// Plan rule 2: old physical file names stay. Files that other builders add show here until they land.
test('T2 old physical file names exist in the build', () => {
  const files = [
    'index.html', 'about.html', 'contact-submit.php', 'favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'manifest.json', 'browserconfig.xml',
    'robots.txt', 'llms.txt', 'ai.txt', 'sitemap.xml', 'sitemap-index.xml', 'sitemap-pages.xml', 'sitemap-services.xml', 'sitemap-areas.xml', 'sitemap-brands.xml',
    'sitemap-blog.xml', 'blog/rss.xml', 'images/og-default.png', 'images/brand/lulwa-logo.png', 'en/index.html', 'services/index.html', 'services/ac-repair.html',
    'areas/index.html', 'brands/index.html', 'blog/index.html', 'logs/.htaccess', '.htaccess', '404.html', 'en/404.html',
  ];
  expect(files.filter((f) => !existsSync(join(DOCROOT, f)))).toEqual([]);
});
