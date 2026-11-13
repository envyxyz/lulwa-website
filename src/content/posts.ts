import { readdirSync, readFileSync } from 'node:fs';
import type { Lang } from './index';
import type { Guide, Post } from './types';

// Blog posts, one file per post in src/content/blog/<slug>.json, written by the client's team in the CMS at /cms
// (public/cms/config.js). Each file holds { ar: {...}, en: {...} }; slug, date, draft and image are the same in both.
// The file name is the URL slug, so editing the slug field later never moves a published page.
// ponytail: read with fs from the project root, not import.meta.glob, so the Playwright specs can import ar.ts too.
const dir = 'src/content/blog';

type Fields = {
  date: string;
  draft?: boolean;
  image?: string;
  image_alt?: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  /** Paragraphs are one text box in the CMS, split on blank lines. */
  sections: { h: string; p: string; items?: { h: string; p: string }[] }[];
  faq?: { q: string; a: string }[];
};
type File = Record<Lang, Fields>;

/** Width and height of a WebP (the CMS converts every upload to WebP). */
export const webpSize = (b: Buffer): { width: number; height: number } => {
  if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WEBP') throw new Error('not a WebP');
  const chunk = b.toString('ascii', 12, 16);
  if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  if (chunk === 'VP8L') { const v = b.readUInt32LE(21); return { width: (v & 0x3fff) + 1, height: ((v >> 14) & 0x3fff) + 1 }; }
  if (chunk === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
  throw new Error(`unknown WebP chunk ${chunk}`);
};

const months = {
  ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};
/** '2026-11-08' to '8 نوفمبر 2026' / '8 November 2026', the form seo.ts isoDate reads back. */
const display = (iso: string, lang: Lang) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${months[lang][m! - 1]} ${y}`; };

/** Today in Riyadh. A post shows from its date on; publish-due.yml triggers the deploy when a scheduled post is due. */
export const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Riyadh' });

export const readPosts = (from = dir) =>
  readdirSync(from)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ slug: f.slice(0, -5), ...(JSON.parse(readFileSync(`${from}/${f}`, 'utf8')) as File) }));

/** Published posts: not drafts, dated today or earlier. Newest first, then by slug. */
export const published = (from = dir, on = today()) =>
  readPosts(from)
    .filter((p) => !p.ar.draft && /^\d{4}-\d\d-\d\d/.test(p.ar.date) && p.ar.date.slice(0, 10) <= on)
    .sort((a, b) => b.ar.date.localeCompare(a.ar.date) || a.slug.localeCompare(b.slug));

const posts = published();

const imageOf = (p: (typeof posts)[number], lang: Lang): Post['image'] => {
  const src = p.ar.image;
  if (!src) return undefined;
  // The editor turns photos into WebP. Anything else (SVG, GIF, a missing file) shows no image instead of failing the build.
  try {
    const { width, height } = webpSize(readFileSync(`public${src}`));
    return { src, width, height, alt: p[lang].image_alt || p.ar.image_alt || p[lang].h1 };
  } catch {
    return undefined;
  }
};

/** The blog list in ar.ts and en.ts. */
export const postItems = (lang: Lang): Post[] =>
  posts.map((p) => {
    const f = p[lang];
    return { slug: p.slug, seo: { title: f.title, description: f.description }, h1: f.h1, lead: f.lead, updated: display(p.ar.date.slice(0, 10), lang), sections: [], image: imageOf(p, lang) };
  });

/** The long-form body, in the shape guides.ts serves for every other page. */
export const postGuides = Object.fromEntries(
  posts.map((p) => [
    p.slug,
    Object.fromEntries((['ar', 'en'] as const).map((lang) => [lang, {
      sections: (p[lang].sections ?? []).map((s) => ({ h: s.h, p: s.p.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean), ...(s.items?.length ? { items: s.items } : {}) })),
      faq: p[lang].faq ?? [],
    } satisfies Guide])),
  ]),
) as Record<string, Record<Lang, Guide>>;
