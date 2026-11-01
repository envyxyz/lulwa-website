import { existsSync, readFileSync } from 'node:fs';
import { expect, type Page } from '@playwright/test';

export const WIDTHS = [320, 360, 390, 768, 1024, 1440, 1920];

export const enTwin = (path: string) => (path === '/' ? '/en' : `/en${path}`);

export const urlMap = () =>
  readFileSync('docs/url-map.csv', 'utf8')
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const [old_path = '', action = '', target = ''] = line.split(',');
      return { old_path, action, target };
    });

// Pages that must exist in the finished site. Phase 6 prunes areas and brands in url-map.csv, which prunes this.
export const REQUIRED = [...urlMap().filter((row) => row.action === 'keep').map((row) => row.old_path), '/faults', '/reviews', '/work'];

/** Paths in the built sitemap: the pages that are real right now. */
export const builtRoutes = () => {
  const file = 'dist/sitemap-0.xml';
  if (!existsSync(file)) throw new Error('No dist/sitemap-0.xml: run pnpm build first');
  return [...readFileSync(file, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);
};

/** Every route in both languages the finished site must have. Later-phase tests run on this, so missing pages are red. */
export const allRoutes = () => [...new Set([...REQUIRED, ...REQUIRED.map(enTwin), ...builtRoutes()])];

export const visit = async (page: Page, path: string) => {
  const response = await page.goto(path);
  expect(response?.status(), `${path} should be 200`).toBe(200);
};

export const htmlFile = (path: string) => `dist${path === '/' ? '/index' : path}.html`;
