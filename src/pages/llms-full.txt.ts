import { site } from '../site';
import { content, localePath } from '../content';
import { reviewed } from '../reviewed-faults';

// The whole site as one plain-text file for AI assistants (llmstxt.org "llms-full"), built from the content files only.
export const GET = () => {
  const out: string[] = [`# ${site.brand.latin} (${site.brand.arabic})`, '', `> ${content.en.meta.description}`, ''];
  const list = (items: string[]) => items.map((i) => `- ${i}`);
  for (const lang of ['en', 'ar'] as const) {
    const c = content[lang];
    const url = (path: string) => `${site.url}${localePath(lang, path)}`;
    out.push(lang === 'en' ? '# English' : '# العربية', '');
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
    for (const f of c.faults.items.filter((i) => reviewed.includes(i.slug))) {
      out.push(`## ${f.h1}`, '', `URL: ${url(`/faults/${f.slug}`)}`, '', f.lead, '', `${c.faults.labels.check}:`, ...list(f.check), '', `${c.faults.labels.technician}:`, ...list(f.technician), '');
    }
    out.push(`## ${c.home.faq.heading}`, '', ...c.home.faq.items.flatMap((f) => [`**${f.q}**`, f.a, '']));
    out.push(`## ${c.about.h1}`, '', `URL: ${url('/about')}`, '', c.about.lead, '', ...c.about.sections.flatMap((s) => [`### ${s.h}`, s.body, '']));
  }
  return new Response(`${out.join('\n')}\n`, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
