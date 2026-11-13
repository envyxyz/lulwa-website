// Checks long-form copy before it ships: shape, Arabic/English parity, banned claims, length, near-duplicates within a kind.
// usage: node scripts/check-guides.mjs [file.json ...]   (default: every src/content/guides/*.json). Exit 1 on any FAIL.
import { readFileSync, readdirSync } from 'node:fs';

const files = process.argv.slice(2).length ? process.argv.slice(2) : [...readdirSync('src/content/guides').map((f) => `src/content/guides/${f}`), 'src/content/blog'];
// Blog posts are one CMS file per post ({ ar, en }, paragraphs in one text box): read them as one guide file keyed by slug. Drafts are skipped: they are not on the site, and an unfinished one must not block the deploy.
// Their paragraph counts may differ between languages; sections and FAQs are mirrored by the CMS. A post with no en.title is Arabic-only: no parity check.
// The file name is the slug: lowercase Latin or Arabic letters, Latin digits and hyphens.
const SLUG = [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, /^[\u0621-\u063A\u0641-\u064A0-9]+(?:-[\u0621-\u063A\u0641-\u064A0-9]+)*$/];
const blogDir = (dir) => Object.fromEntries(readdirSync(dir).filter((f) => f.endsWith('.json')).flatMap((f) => {
  const post = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8'));
  if (post.ar?.draft) return [];
  const g = (l) => post[l] && { ...post[l], meta: [post[l].title, post[l].description, post[l].h1, post[l].lead, post[l].image_alt ?? ''].join(' '), sections: (post[l].sections ?? []).map((s) => ({ ...s, p: String(s.p ?? '').split(/\n\s*\n/).filter((t) => t.trim()) })), faq: post[l].faq ?? [] };
  return [[f.slice(0, -5), { ar: g('ar'), en: post.en?.title ? g('en') : undefined, enSlug: post.en?.title ? post.en.slug || undefined : undefined, blog: true }]];
}));
// Same list as tests/claims.spec.ts plus the launch-plan bans (docs/LAUNCH-PLAN.md).
const BANNED = [/5,000/, /5000/, /10\+/, /98\s?%/, /4\.9/, /معتمد/, /certified/i, /24\s?ساعة/, /على مدار الساعة/, /24\/7/, /نفس اليوم/, /same[- ]day/i, /أصلية/, /خلال ساعة/, /ريال/, /\bSAR\b/,
  /ضمان/, /warrant/i, /زيارة منزلية/, /home visit/i, /we come to you/i, /الأفضل|أفضل ورشة|أفضل فني/, /\bthe best\b/i, /فوري/, /original parts/i, /genuine/i, /!/, /[\u{1F300}-\u{1FAFF}]/u, /<[a-z]/i, /\*\*/,
  /لولوه (تصلح|تقدم|توفر|تخدم|ترد)/, /نخدم (?!عملاء)/, /نغطي/, /we serve\b/i, /we cover\b/i, /service report|تقرير خدمة/i,
  // Rule talk and competitor talk never reach the page (editor pass, 8 Nov 2026).
  /غير المؤكد|المؤكدة|الأجهزة المؤكدة|unconfirmed|confirmed/i, /بعض المواقع|مواقع أخرى|شركات أخرى|other shops|some websites/i, /للمنازل والمنشآت|نأتي إليك|في موقعك/,
  // Any phone number other than 056 802 2197 written exactly so (rule 8).
  /(?<!\d)(?!056 802 2197(?!\d))0?5\d(?:\s?\d){7,8}(?!\d)/];
const words = (t) => t.split(/\s+/).filter(Boolean).length;
const text = (g) => [g.meta ?? '', ...g.sections.flatMap((s) => [s.h, s.image?.alt ?? '', ...s.p, ...(s.items ?? []).flatMap((i) => [i.h, i.p])]), ...g.faq.flatMap((f) => [f.q, f.a])].join(' ');
const shingles = (t) => { const w = t.split(/\s+/).filter(Boolean); const s = new Set(); for (let i = 0; i + 5 <= w.length; i++) s.add(w.slice(i, i + 5).join(' ')); return s; };
const jac = (a, b) => { let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i || 1); };
const counts = (g, blog) => JSON.stringify([g.sections.map((s) => [blog ? 0 : s.p.length, (s.items ?? []).length]), g.faq.length]);

// Everything that already lives under /en/blog besides posts (the list's RSS feed), plus the legacy English-root slugs.
const enRoutes = new Set([...readdirSync('src/pages/en/blog').map((n) => n.replace(/\..*$/, '')).filter((n) => !n.startsWith('[')), ...JSON.parse(readFileSync('src/english-root.json', 'utf8')).map((p) => p.replace(/^\/blog\//, ''))]);
let fail = 0;
const out = (level, msg) => { if (level === 'FAIL') fail++; console.log(`${level} ${msg}`); };
for (const file of files) {
  let data;
  try { data = file === 'src/content/blog' ? blogDir(file) : JSON.parse(readFileSync(file, 'utf8')); } catch (e) { out('FAIL', `${file}: not JSON (${e.message})`); continue; }
  const entries = Object.entries(data);
  const sh = [];
  for (const [key, e] of entries) {
    if (e?.blog && !SLUG.some((re) => re.test(key))) out('FAIL', `${file} ${key}: slug is neither lowercase Latin nor Arabic letters, digits and hyphens`);
    for (const lang of ['ar', 'en']) {
      if (lang === 'en' && e?.blog && !e.en) continue;
      const g = e?.[lang];
      if (!g || !Array.isArray(g.sections) || !Array.isArray(g.faq) || g.sections.some((s) => typeof s.h !== 'string' || !Array.isArray(s.p) || s.p.some((p) => typeof p !== 'string'))) { out('FAIL', `${file} ${key}.${lang}: bad shape`); continue; }
      for (const re of BANNED) { const m = text(g).match(re); if (m) out('FAIL', `${file} ${key}.${lang}: banned ${re} near "${text(g).slice(Math.max(0, m.index - 30), m.index + 30)}"`); }
      for (const s of g.sections) if (s.image && !String(s.image.alt ?? '').trim()) out('FAIL', `${file} ${key}.${lang}: section "${s.h}" has an image without alt text`);
      for (const s of g.sections) if (s.h.length > 80) out('WARN', `${file} ${key}.${lang}: long heading "${s.h}"`);
    }
    // en.slug: the English page address when it differs from the file slug. Same two patterns, and no clash with another post, an English route or a legacy slug.
    if (e?.blog && e.enSlug !== undefined && e.enSlug !== key) {
      const taken = entries.some(([k, o]) => k !== key && (k === e.enSlug || o?.enSlug === e.enSlug)) || enRoutes.has(e.enSlug);
      if (typeof e.enSlug !== 'string' || !SLUG.some((re) => re.test(e.enSlug))) out('FAIL', `${file} ${key}: en.slug "${e.enSlug}" is neither lowercase Latin nor Arabic letters, digits and hyphens`);
      else if (taken) out('FAIL', `${file} ${key}: en.slug "${e.enSlug}" is already another post's slug, a legacy slug or an existing /en/blog route`);
    }
    if (!e?.ar) continue;
    if (e.en && counts(e.ar, e.blog) !== counts(e.en, e.blog)) out('FAIL', `${file} ${key}: ar/en counts differ ${counts(e.ar, e.blog)} vs ${counts(e.en, e.blog)}`);
    const w = words(text(e.ar));
    out('INFO', `${file} ${key}: ar ${w} words, en ${e.en ? words(text(e.en)) : 'none (Arabic only)'}, ${e.ar.sections.length} sections, ${e.ar.faq.length} faq, ${(e.sources ?? []).length} sources`);
    sh.push([key, shingles(text(e.ar))]);
  }
  // Pages of one kind must not be the same text with a name swapped (doorway / scaled-content policy).
  for (let i = 0; i < sh.length; i++) for (let j = i + 1; j < sh.length; j++) {
    const v = jac(sh[i][1], sh[j][1]);
    if (v > 0.12) out(v > 0.2 ? 'FAIL' : 'WARN', `${file}: ${sh[i][0]} ~ ${sh[j][0]} share ${(v * 100).toFixed(0)}% of 5-word runs`);
  }
}
console.log(fail ? `${fail} FAIL` : 'all checks passed');
process.exit(fail ? 1 : 0);
