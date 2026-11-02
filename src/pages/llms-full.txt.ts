import { site, factLines } from '../site';
import { content, localePath } from '../content';
import { reviewed } from '../reviewed-faults';

const ask = {
  en: 'Appliances, areas and brands beyond the four core services are confirmed case by case on WhatsApp: send the device and your district, and the shop replies whether it can take the job.',
  ar: 'الأجهزة والمناطق والماركات خارج الخدمات الأربع الأساسية نؤكدها حالة بحالة على واتساب: أرسل الجهاز والحي ونرد عليك إن كانت الورشة تستطيع استلام العمل.',
};

// The whole site as one plain-text file for AI assistants (llmstxt.org "llms-full"), built from the content files only.
export const GET = () => {
  const out: string[] = [`# ${site.brand.english} (${site.brand.arabic})`, '', `> ${content.en.meta.description}`, '', '## Confirmed facts', '', ...factLines('en').map((l) => `- ${l}`), '', '## الحقائق المؤكدة', '', ...factLines('ar').map((l) => `- ${l}`), ''];
  const list = (items: string[]) => items.map((i) => `- ${i}`);
  for (const lang of ['en', 'ar'] as const) {
    const c = content[lang];
    const url = (path: string) => `${site.url}${localePath(lang, path)}`;
    out.push(lang === 'en' ? '# English' : '# العربية', '', ask[lang], '');
    out.push(`## ${c.home.shop.heading}`, '', `${c.home.shop.addressLabel}: ${c.home.shop.address}`, `${c.home.shop.hoursLabel}: ${c.home.shop.hours}`, `${site.phone.display} (tel, WhatsApp ${site.phone.whatsapp})`, `${c.home.shop.legalLabel}: ${site.legal.name}, ${c.home.shop.crLabel} ${site.legal.cr}`, '');
    for (const s of c.services.items) {
      out.push(`## ${s.h1}`, '', `URL: ${url(`/services/${s.slug}`)}`, '', s.lead, '', s.intro, '');
      out.push(`### ${s.problems.h}`, '', s.problems.lead, '', ...s.problems.items.map((p) => `- ${p.name}: ${p.signs}`), '');
      out.push(`### ${s.diy.h}`, '', s.diy.lead, '');
      for (const d of s.diy.items) out.push(`#### ${d.problem}`, '', ...list(d.steps), '');
      out.push(`### ${s.stop.h}`, '', s.stop.lead, '', ...list(s.stop.items), '');
      out.push(`### ${c.services.labels.faq}`, '', ...s.faq.flatMap((f) => [`**${f.q}**`, f.a, '']));
      out.push(s.close.h, s.close.text, '');
    }
    for (const s of c.services.more) {
      out.push(`## ${s.h1}`, '', `URL: ${url(`/services/${s.slug}`)}`, '', s.lead, '');
      out.push(`### ${c.ask.problems}`, '', ...s.problems.map((p) => `- ${p.name}: ${p.signs}`), '');
      out.push(`### ${c.ask.checks}`, '', ...list(s.checks), '', `### ${c.ask.stop}`, '', ...list(s.stop), '');
      out.push(`### ${c.ask.faq}`, '', ...s.faq.flatMap((f) => [`**${f.q}**`, f.a, '']));
    }
    for (const f of c.faults.items.filter((i) => reviewed.includes(i.slug))) {
      out.push(`## ${f.h1}`, '', `URL: ${url(`/faults/${f.slug}`)}`, '', f.lead, '', `${c.faults.labels.check}:`, ...list(f.check), '', `${c.faults.labels.technician}:`, ...list(f.technician), '');
    }
    out.push(`## ${c.areas.h1}`, '', `URL: ${url('/areas')}`, '', c.areas.lead, '');
    for (const a of c.areas.items) out.push(`### ${a.h1}`, '', `URL: ${url(`/areas/${a.slug}`)}`, '', a.lead, ...(a.note ? ['', a.note] : []), '');
    out.push(`## ${c.brands.h1}`, '', `URL: ${url('/brands')}`, '', c.brands.lead, '', c.brands.disclaimer, '');
    for (const b of c.brands.items) out.push(`### ${b.h1}`, '', `URL: ${url(`/brands/${b.slug}`)}`, '', b.lead, ...(b.note ? ['', b.note] : []), '');
    out.push(`## ${c.home.faq.heading}`, '', ...c.home.faq.items.flatMap((f) => [`**${f.q}**`, f.a, '']));
    out.push(`## ${c.about.h1}`, '', `URL: ${url('/about')}`, '', c.about.lead, '', ...c.about.sections.flatMap((s) => [`### ${s.h}`, s.body, '']));
    out.push(`## ${c.contact.h1}`, '', `URL: ${url('/contact')}`, '', c.contact.lead, '');
    for (const p of c.blog.items) out.push(`## ${p.h1}`, '', `URL: ${url(`/blog/${p.slug}`)}`, '', p.lead, '', ...p.sections.flatMap((s) => [`### ${s.h}`, s.body, '']));
  }
  return new Response(`${out.join('\n')}\n`, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
