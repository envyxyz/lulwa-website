import { readdirSync, readFileSync } from 'node:fs';
import type { Lang } from './index';
import type { Guide, Post } from './types';

// Blog posts, one file per post in src/content/blog/<slug>.json, written by the client's team in the CMS at /cms
// (public/cms/config.js). Each file holds { ar: {...}, en?: {...} }; slug, date, draft and image are the same in both. A post without `en` (or with no en.title) is Arabic-only:
// it has no /en page, no English list, feed or llms row, and no en-SA hreflang. The slug is Latin or Arabic. A section image has the same src in both languages.
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
  sections: { h: string; p: string; items?: { h: string; p: string }[]; image?: { src: string; alt: string } }[];
  faq?: { q: string; a: string }[];
};
type File = { ar: Fields; en?: Fields & { slug?: string } };
const hasEn = (p: File) => Boolean(p.en?.title);
const fieldsOf = (p: File, lang: Lang) => (lang === 'ar' ? p.ar : p.en!);

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
type Published = ReturnType<typeof published>;

/** English page slug per file slug, only where en.slug is set and differs (the English page is /en/blog/<en.slug>); and the reverse. */
export const enSlugsOf = (list: Published) => new Map(list.filter((p) => hasEn(p) && p.en!.slug && p.en!.slug !== p.slug).map((p) => [p.slug, p.en!.slug!] as const));
export const enSlugs = enSlugsOf(posts);
export const fileSlugs = new Map([...enSlugs].map(([file, en]) => [en, file] as const));

/** Slugs of posts with no English version. */
export const arabicOnlyOf = (list: Published) => new Set(list.filter((p) => !hasEn(p)).map((p) => p.slug));
export const arabicOnly = arabicOnlyOf(posts);

const readImage = (src: string | undefined, alt: string): Post['image'] => {
  if (!src) return undefined;
  // The editor turns photos into WebP. Anything else (SVG, GIF, a missing file) shows no image instead of failing the build.
  try {
    const { width, height } = webpSize(readFileSync(`public${src}`));
    return { src, width, height, alt };
  } catch {
    return undefined;
  }
};
const imageOf = (p: Published[number], lang: Lang) => readImage(p.ar.image, fieldsOf(p, lang).image_alt || p.ar.image_alt || fieldsOf(p, lang).h1);

/** The blog list in ar.ts and en.ts. */
export const postItems = (lang: Lang, list: Published = posts): Post[] => {
  const en = enSlugsOf(list);
  return list.filter((p) => lang === 'ar' || hasEn(p)).map((p) => {
    const f = fieldsOf(p, lang);
    return { slug: lang === 'en' ? en.get(p.slug) ?? p.slug : p.slug, seo: { title: f.title, description: f.description }, h1: f.h1, lead: f.lead, updated: display(p.ar.date.slice(0, 10), lang), sections: [], image: imageOf(p, lang) };
  });
};

/** The long-form body, in the shape guides.ts serves for every other page. */
export const guidesOf = (list: Published) => {
  const byFile = Object.fromEntries(
  list.map((p) => [
    p.slug,
    Object.fromEntries((['ar', 'en'] as const).filter((lang) => lang === 'ar' || hasEn(p)).map((lang) => [lang, {
      sections: (fieldsOf(p, lang).sections ?? []).map((s, i) => {
        // The image is added per language in the editor: English falls back to the Arabic section's picture and alt.
        const ar = p.ar.sections?.[i]?.image;
        const image = readImage(s.image?.src ?? ar?.src, s.image?.alt || ar?.alt || '');
        return { h: s.h, p: s.p.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean), ...(s.items?.length ? { items: s.items } : {}), ...(image ? { image } : {}) };
      }),
      faq: fieldsOf(p, lang).faq ?? [],
    } satisfies Guide])),
  ]),
  ) as Record<string, Record<Lang, Guide>>;
  // The English page looks its guide up by its own slug.
  return { ...byFile, ...Object.fromEntries([...enSlugsOf(list)].map(([file, slug]) => [slug, byFile[file]!])) };
};
export const postGuides = guidesOf(posts);
