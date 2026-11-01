import { site } from '../site';
import { content, localePath } from '../content';
import { reviewed } from '../reviewed-faults';

// llms.txt built from the content files, so it can never state anything the site does not.
export const GET = () => {
  const link = (lang: 'ar' | 'en', path: string, label: string, note: string) => `- [${label}](${site.url}${localePath(lang, path)}): ${note}`;
  const lines = [`# ${site.brand.latin} (${site.brand.arabic})`, '', `> ${content.en.meta.description}`, '', `Address: ${content.en.home.shop.address}. Hours: ${content.en.home.shop.hours}. Phone and WhatsApp: ${site.phone.display}. Legal name: ${site.legal.name}, CR ${site.legal.cr}.`, ''];
  for (const lang of ['en', 'ar'] as const) {
    const c = content[lang];
    lines.push(lang === 'en' ? '## English' : '## العربية', '');
    lines.push(link(lang, '/', c.home.seo.title, c.home.seo.description));
    for (const s of c.services.items) lines.push(link(lang, `/services/${s.slug}`, s.name, s.seo.description));
    for (const f of c.faults.items.filter((i) => reviewed.includes(i.slug))) lines.push(link(lang, `/faults/${f.slug}`, f.name, f.seo.description));
    for (const [path, page] of [['/about', c.about], ['/contact', c.contact], ['/reviews', c.reviews]] as const) lines.push(link(lang, path, page.h1, page.seo.description));
    lines.push('');
  }
  return new Response(`${lines.join('\n')}\n`, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
