// T6. A claim moves to ALLOWED only with a dated line in PRODUCT.md.
import { readdirSync, readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { ar } from '../src/content/ar';
import { en } from '../src/content/en';

const BANNED = [/5,000/, /5000/, /10\+/, /98\s?%/, /4\.9/, /معتمد/, /certified/i, /24\s?ساعة/, /على مدار الساعة/, /24\/7/, /نفس اليوم/, /same[- ]day/i, /أصلية/, /خلال ساعة/, /ريال/, /\bSAR\b/];
const ALLOWED: RegExp[] = [];

const htmlFiles = (dir = 'dist'): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });

// Scripts and styles out, JSON-LD stays: it is published too.
const visible = (html: string) => html.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<script(?![^>]*ld\+json)[\s\S]*?<\/script>/g, '');

const hits = (text: string) => BANNED.filter((claim) => claim.test(text) && !ALLOWED.some((ok) => ok.source === claim.source)).map(String);

test('T6 content files are final, not stubs', () => {
  expect(ar.status).toBe('final');
  expect(en.status).toBe('final');
});

test('T6 content files hold no banned claim', () => {
  expect(hits(JSON.stringify(ar))).toEqual([]);
  expect(hits(JSON.stringify(en))).toEqual([]);
});

test('T6 built HTML holds no banned claim', () => {
  for (const file of htmlFiles()) expect(hits(visible(readFileSync(file, 'utf8'))), file).toEqual([]);
});
