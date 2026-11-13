// CMS blog posts (src/content/posts.ts): drafts and future dates stay off the site, files are the URL slug, WebP sizes are read right.
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import sharp from 'sharp';
import { published, readPosts, webpSize } from '../src/content/posts';

test('posts: drafts and future posts are not published, newest first', () => {
  const dir = mkdtempSync(join(tmpdir(), 'posts-'));
  const post = (date: string, draft = false) => { const f = { date, draft, title: 't', description: 'd', h1: 'h', lead: 'l', sections: [] }; return JSON.stringify({ ar: f, en: f }); };
  writeFileSync(join(dir, 'old.json'), post('2026-11-01'));
  writeFileSync(join(dir, 'today.json'), post('2026-11-13'));
  writeFileSync(join(dir, 'later.json'), post('2026-11-14'));
  writeFileSync(join(dir, 'draft.json'), post('2026-11-02', true));
  expect(published(dir, '2026-11-13').map((p) => p.slug)).toEqual(['today', 'old']);
  expect(published(dir, '2026-11-14').map((p) => p.slug)).toEqual(['later', 'today', 'old']);
});

test('posts: every post file has both languages and a slug-safe name', () => {
  for (const p of readPosts()) {
    expect(p.slug, 'file name is the URL slug').toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    for (const lang of ['ar', 'en'] as const) expect(p[lang]?.title, `${p.slug}.${lang}`).toBeTruthy();
  }
});

test('posts: WebP width and height from lossy, lossless and extended files', async () => {
  for (const opts of [{ lossless: false }, { lossless: true }, { lossless: false, alphaQuality: 50 }]) {
    const img = sharp({ create: { width: 1203, height: 677, channels: opts.alphaQuality ? 4 : 3, background: { r: 1, g: 2, b: 3, alpha: 0.5 } } });
    expect(webpSize(await img.webp(opts).toBuffer())).toEqual({ width: 1203, height: 677 });
  }
});
