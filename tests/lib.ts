import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, type Page } from '@playwright/test';

export const WIDTHS = [320, 360, 390, 768, 1024, 1440, 1920];

/** Built folder the tests read and Apache serves. Set PW_DOCROOT to test a build made with a custom --outDir. */
export const DOCROOT = process.env.PW_DOCROOT ?? 'dist';

/** Two live English posts rank at their root URL and have no /en twin (Ameer, 9 Nov 2026). */
export const ENGLISH_ROOT: string[] = JSON.parse(readFileSync('src/english-root.json', 'utf8'));
export const enTwin = (path: string) => (ENGLISH_ROOT.includes(path) ? path : path === '/' ? '/en' : `/en${path}`);

// docs/url-map.csv has quoted notes, so cells are read with a small quote-aware split.
const cells = (line: string) => {
  const out: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cell += '"';
        i++;
      }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') {
      out.push(cell);
      cell = '';
    }
    else cell += ch;
  }
  return [...out, cell];
};

export const urlMap = () =>
  readFileSync('docs/url-map.csv', 'utf8')
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const [old_path = '', action = '', target = '', english_twin = ''] = cells(line);
      return { old_path, action, target, english_twin };
    });

// Pages that must exist in the finished site: every url-map row (all are `keep`, none is retired) and nothing else (Ameer, 8 Nov 2026).
export const REQUIRED = urlMap().map((row) => row.old_path);

/** Paths in the built sitemaps, read through sitemap-index.xml (pages, services, areas, brands, blog): the pages that are real right now. */
export const builtRoutes = () => {
  const read = (file: string) => {
    const path = join(DOCROOT, file);
    if (!existsSync(path)) throw new Error(`No ${path}: run pnpm build first`);
    return [...readFileSync(path, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);
  };
  const paths = new Set<string>();
  for (const sitemap of read('sitemap-index.xml')) for (const path of read(sitemap.replace(/^\//, ''))) paths.add(path);
  return [...paths];
};

/** Every route in both languages the finished site must have. Later-phase tests run on this, so missing pages are red. */
export const allRoutes = () => [...new Set([...REQUIRED, ...REQUIRED.map(enTwin), ...builtRoutes()])];

export const visit = async (page: Page, path: string) => {
  const response = await page.goto(path);
  expect(response?.status(), `${path} should be 200`).toBe(200);
};

/** Physical file for a clean URL: hubs live at folder/index.html, leaf pages at name.html. */
export const htmlFile = (path: string) => {
  const hub = join(DOCROOT, path, 'index.html');
  return path === '/' ? join(DOCROOT, 'index.html') : existsSync(hub) ? hub : join(DOCROOT, `${path}.html`);
};
