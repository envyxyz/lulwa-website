import { ar } from './ar';
import { en } from './en';

export type Lang = 'ar' | 'en';
export const content = { ar, en };
/** A site path in the page's language: Arabic at the root, English under /en. */
export const localePath = (lang: Lang, path: string) => (lang === 'ar' ? path : path === '/' ? '/en' : `/en${path}`);
/** The exact same page in the other language. */
export const twinPath = (pathname: string) => {
  const path = pathname.replace(/(\/index)?\.html$/, '').replace(/\/$/, '') || '/';
  if (path === '/en') return '/';
  return path.startsWith('/en/') ? path.slice(3) : localePath('en', path);
};
// build.format 'file' makes the English home '/en.html' at build time.
export const langFromUrl = (url: URL): Lang => (/^\/en(\.html|\/|$)/.test(url.pathname) ? 'en' : 'ar');
