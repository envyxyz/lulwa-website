import { ar } from './ar';
import { en } from './en';
import englishRoot from '../english-root.json' with { type: 'json' };
import { arabicOnly } from './posts';

export type Lang = 'ar' | 'en';
export const content = { ar, en };
/** A site path in the page's language: Arabic at the root, English under /en. */
export const localePath = (lang: Lang, path: string) => (lang === 'ar' || isEnglishRoot(path) ? path : path === '/' ? '/en' : `/en${path}`);
/** Two live English posts rank at their root URL, so they are served in English there and have no Arabic or /en twin (Ameer, 9 Nov 2026). */
export const isEnglishRoot = (pathname: string) => englishRoot.includes(pathname.replace(/(\/index)?\.html$/, '').replace(/\/$/, ''));
/** A request path as the files are named: Arabic slugs arrive percent-encoded from Astro.url. */
export const decodePath = (pathname: string) => { try { return decodeURI(pathname); } catch { return pathname; } };
/** The slug of an Arabic-only post at this Arabic path, else undefined. */
export const arabicOnlySlug = (arPath: string) => { const slug = arPath.match(/^\/blog\/([^/]+)$/)?.[1]; return slug && arabicOnly.has(slug) ? slug : undefined; };
/** The exact same page in the other language. An Arabic-only post has none: its language switch goes to the English blog list. */
export const twinPath = (pathname: string) => {
  const path = decodePath(pathname).replace(/(\/index)?\.html$/, '').replace(/\/$/, '') || '/';
  if (path === '/en') return '/';
  if (isEnglishRoot(path)) return path;
  if (arabicOnlySlug(path)) return '/en/blog';
  return path.startsWith('/en/') ? path.slice(3) : localePath('en', path);
};
// build.format 'file' makes the English home '/en.html' at build time.
export const langFromUrl = (url: URL): Lang => (/^\/en(\.html|\/|$)/.test(url.pathname) || isEnglishRoot(url.pathname) ? 'en' : 'ar');
