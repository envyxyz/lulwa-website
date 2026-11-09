import { site, factLines } from '../site';
import { content, localePath, type Lang } from '../content';

const ask = {
  en: 'Appliances, areas and brands beyond the four core services are confirmed case by case on WhatsApp: send the device and your district, and the shop replies whether it can take the job.',
  ar: 'الأجهزة والمناطق والماركات خارج الخدمات الأربع الأساسية نؤكدها حالة بحالة على واتساب: أرسل الجهاز والحي ونرد عليك إن كانت الورشة تستطيع استلام العمل.',
};

// llms.txt built from the content files, so it can never state anything the site does not.
export const GET = () => {
  const link = (lang: Lang, path: string, label: string, note: string) => `- [${label}](${site.url}${localePath(lang, path)}): ${note}`;
  const lines = [`# ${site.brand.english} (${site.brand.arabic})`, '', `> ${content.en.meta.description}`, '', '## Confirmed facts', '', ...factLines('en').map((l) => `- ${l}`), '', '## الحقائق المؤكدة', '', ...factLines('ar').map((l) => `- ${l}`), '', `Full text of every page: ${site.url}/llms-full.txt`, ''];
  for (const lang of ['en', 'ar'] as const) {
    const c = content[lang];
    const ar = lang === 'ar';
    lines.push(ar ? '## العربية' : '## English', '', `> ${ask[lang]}`, '');
    lines.push(ar ? '### الرئيسية' : '### Home', '', link(lang, '/', c.home.seo.title, c.home.seo.description), '');
    lines.push(ar ? '### الخدمات' : '### Services', '', link(lang, '/services', c.services.h1, c.services.seo.description));
    for (const s of c.services.items) lines.push(link(lang, `/services/${s.slug}`, s.name, s.seo.description));
    for (const s of c.services.more) lines.push(link(lang, `/services/${s.slug}`, s.name, s.seo.description));
    for (const f of c.faults.items) lines.push(link(lang, `/services/${f.service}#${f.slug}`, f.name, f.seo.description));
    lines.push('', ar ? '### المناطق' : '### Areas', '', link(lang, '/areas', c.areas.h1, c.areas.seo.description));
    for (const a of c.areas.items) lines.push(link(lang, `/areas/${a.slug}`, a.h1, a.seo.description));
    lines.push('', ar ? '### الماركات' : '### Brands', '', link(lang, '/brands', c.brands.h1, c.brands.seo.description));
    for (const b of c.brands.items) lines.push(link(lang, `/brands/${b.slug}`, b.h1, b.seo.description));
    lines.push('', ar ? '### الشركة' : '### Company', '');
    for (const [path, page] of [['/about', c.about], ['/contact', c.contact], ['/blog', c.blog]] as const) lines.push(link(lang, path, page.h1, page.seo.description));
    for (const p of c.blog.items) lines.push(link(lang, `/blog/${p.slug}`, p.h1, p.seo.description));
    for (const [path, page] of [['/privacy-policy', c.legal.privacy], ['/terms-of-service', c.legal.terms], ['/cookie-policy', c.legal.cookies]] as const) lines.push(link(lang, path, page.h1, page.seo.description));
    lines.push('');
  }
  return new Response(`${lines.join('\n')}\n`, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
