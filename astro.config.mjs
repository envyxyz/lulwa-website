import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { site } from './src/site.ts';
import { reviewed } from './src/reviewed-faults.ts';

// The kitchen sink exists only under `astro dev`, so it can never reach dist or the sitemap.
const kitchenSink = {
  name: 'dev-kitchen-sink',
  hooks: {
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command !== 'dev') return;
      for (const pattern of ['/dev/kitchen-sink', '/en/dev/kitchen-sink']) {
        injectRoute({ pattern, entrypoint: './src/dev/kitchen-sink.astro' });
      }
    },
  },
};

// Sitemaps under the old file names, written after the build: sitemap-index.xml and sitemap.xml (same content),
// then sitemap-pages, -services, -areas, -brands, -blog. Every URL has lastmod and ar-SA, en-SA and x-default alternates.
// thanks, 404 and the /faults redirect stay out. A fault page is listed once a technician has checked it (src/reviewed-faults.ts).
const sitemaps = {
  name: 'lulwa-sitemaps',
  hooks: {
    'astro:build:done': ({ dir, pages }) => {
      const out = fileURLToPath(dir);
      const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      const paths = new Set(
        pages
          .map((p) => `/${p.pathname}`.replace(/\.html$/, '').replace(/\/+$/, '') || '/')
          .filter((p) => !/^\/(en\/)?(thanks|404|faults$|dev(\/|$))/.test(p) && p !== '/en/404')
          .filter((p) => !/^\/(en\/)?faults\/[^/]+$/.test(p) || reviewed.includes(p.split('/').pop()))
          .map((p) => (p === '/en/' ? '/en' : p)),
      );
      const arOf = (p) => (p === '/en' ? '/' : p.replace(/^\/en(?=\/)/, ''));
      const enOf = (p) => (p === '/' ? '/en' : `/en${p}`);
      const full = (p) => (p === '/' ? `${site.url}/` : `${site.url}${p}`);
      // A post carries its own date in a meta tag; everything else changed when the copy did.
      const lastmod = (p) => {
        const file = `${out}${p === '/' ? 'index' : p.slice(1)}.html`;
        const html = existsSync(file) ? readFileSync(file, 'utf8') : '';
        return html.match(/property="article:modified_time" content="(\d{4}-\d\d-\d\d)/)?.[1] ?? site.updated;
      };
      const groups = { pages: [], services: [], areas: [], brands: [], blog: [] };
      for (const p of [...paths].sort()) {
        const ar = arOf(p);
        const group = /^\/(services|faults)(\/|$)/.test(ar) ? 'services' : /^\/areas(\/|$)/.test(ar) ? 'areas' : /^\/brands(\/|$)/.test(ar) ? 'brands' : /^\/blog(\/|$)/.test(ar) ? 'blog' : 'pages';
        groups[group].push(p);
      }
      const urlset = (list) => {
        const alt = (p) => {
          const ar = arOf(p), en = enOf(ar);
          const pair = paths.has(ar) && paths.has(en) ? [['ar-SA', ar], ['en-SA', en], ['x-default', ar]] : [];
          return pair.map(([l, h]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${esc(full(h))}"/>`).join('\n');
        };
        const rows = list.map((p) => `  <url>\n    <loc>${esc(full(p))}</loc>\n    <lastmod>${lastmod(p)}</lastmod>\n${alt(p)}\n  </url>`.replace('\n\n', '\n'));
        return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${rows.join('\n')}\n</urlset>\n`;
      };
      const names = [];
      for (const [name, list] of Object.entries(groups)) {
        if (!list.length) continue;
        writeFileSync(`${out}sitemap-${name}.xml`, urlset(list));
        names.push(name);
      }
      const index = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${names.map((n) => `  <sitemap>\n    <loc>${site.url}/sitemap-${n}.xml</loc>\n    <lastmod>${site.updated}</lastmod>\n  </sitemap>`).join('\n')}\n</sitemapindex>\n`;
      writeFileSync(`${out}sitemap-index.xml`, index);
      writeFileSync(`${out}sitemap.xml`, index);
    },
  },
};

export default defineConfig({
  site: site.url,
  output: 'static',
  // Old slugs have no trailing slash and must keep their exact URL.
  trailingSlash: 'never',
  build: { format: 'file' },
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemaps, kitchenSink],
  vite: { plugins: [tailwindcss()] },
});
