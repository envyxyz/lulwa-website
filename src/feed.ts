import { site } from './site';
import { content, localePath, type Lang } from './content';
import { isoDate } from './seo';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** RSS 2.0 for the posts of one language. */
export const feed = (lang: Lang) => {
  const c = content[lang];
  const name = lang === 'ar' ? site.brand.arabic : site.brand.english;
  const self = `${site.url}${localePath(lang, '/blog')}`;
  const link = (slug: string) => `${site.url}${encodeURI(localePath(lang, `/blog/${slug}`))}`;
  const items = c.blog.items.map((p) => {
    const date = isoDate(p.updated);
    return `    <item>\n      <title>${esc(p.h1)}</title>\n      <link>${link(p.slug)}</link>\n      <guid isPermaLink="true">${link(p.slug)}</guid>\n      <description>${esc(p.seo.description)}</description>\n${date ? `      <pubDate>${new Date(`${date}T08:00:00+03:00`).toUTCString()}</pubDate>\n` : ''}    </item>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>${esc(`${name} - ${c.blog.h1}`)}</title>\n    <link>${self}</link>\n    <description>${esc(c.blog.seo.description)}</description>\n    <language>${lang === 'ar' ? 'ar-SA' : 'en-SA'}</language>\n    <atom:link href="${self}/rss.xml" rel="self" type="application/rss+xml"/>\n${items.join('\n')}\n  </channel>\n</rss>\n`;
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
};
