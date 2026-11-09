// Post-deploy check of the live site against docs/SEO-MIGRATION.md, diffed with docs/qa/pre-launch.json.
//   node scripts/check-live.mjs [base] [--out docs/qa/post-launch.json]   (base defaults to https://lulwa.com.sa)
// Exit 1 on any failure. Title changes are listed, not failed: the new Arabic titles keep the old ranking phrase by design.
import { readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith('http')) ?? 'https://lulwa.com.sa';
const out = args.includes('--out') ? args[args.indexOf('--out') + 1] : null;
const host = new URL(base).host;
const VERIFY = 'NhugWL1gVcIPJCf6bi0eTNAXzZ2v7ZZvIHHS-Neh2E4';
const paths = readFileSync('docs/url-map.csv', 'utf8').trim().split(/\r?\n/).slice(1).map((l) => l.split(','))
  .filter((c) => c[1] === 'keep').map((c) => c[0]);
const before = Object.fromEntries(JSON.parse(readFileSync('docs/qa/pre-launch.json', 'utf8')).pages.map((p) => [p.path, p]));
const ENGLISH_ROOT = JSON.parse(readFileSync('src/english-root.json', 'utf8')); // English at the root, no /en twin
const twin = (p) => (ENGLISH_ROOT.includes(p) ? p : p === '/' ? '/en' : `/en${p}`);
const SITE = 'https://lulwa.com.sa'; // canonical and hreflang always name the real site
const abs = (p) => `${base}${p}`;
const canon = (p) => `${SITE}${p}`;

const fails = [];
const fail = (msg) => fails.push(msg);
const get = (url) => fetch(url, { redirect: 'manual', headers: { 'user-agent': 'lulwa-launch-check', 'cache-control': 'no-cache' } });
const attr = (html, re) => html.match(re)?.[1] ?? null;
const link = (html, rel, extra = '') => attr(html, new RegExp(`<link[^>]+rel="${rel}"${extra}[^>]*href="([^"]+)"`, 'i'));

const page = async (path, arPath) => {
  const r = await get(base + path);
  const html = r.status === 200 ? await r.text() : '';
  const row = { path, status: r.status, location: r.headers.get('location'),
    title: attr(html, /<title[^>]*>([^<]*)<\/title>/i)?.trim() ?? null, canonical: link(html, 'canonical'),
    robots: attr(html, /<meta[^>]+name="robots"[^>]*content="([^"]+)/i), xrobots: r.headers.get('x-robots-tag') };
  if (r.status !== 200) return fail(`${path}: ${r.status}`), row;
  if (row.canonical !== canon(path)) fail(`${path}: canonical ${row.canonical}`);
  if (/noindex/i.test(`${row.robots} ${row.xrobots}`)) fail(`${path}: noindex`);
  if (!html.includes(`content="${VERIFY}"`)) fail(`${path}: no Search Console tag`);
  const ar = link(html, 'alternate', ' hreflang="ar-SA"'), en = link(html, 'alternate', ' hreflang="en-SA"'), xd = link(html, 'alternate', ' hreflang="x-default"');
  if (ENGLISH_ROOT.includes(path)) {
    if (ar !== null || en !== canon(path) || xd !== canon(path) || !/<html lang="en"/.test(html)) fail(`${path}: English-root hreflang ar=${ar} en=${en} x=${xd}`);
    return row;
  }
  if (ar !== canon(arPath) || en !== canon(twin(arPath)) || xd !== canon(arPath)) fail(`${path}: hreflang ar=${ar} en=${en} x=${xd}`);
  return row;
};

const pages = [];
for (let i = 0; i < paths.length; i += 6) {
  const chunk = paths.slice(i, i + 6);
  pages.push(...(await Promise.all(chunk.flatMap((p) => (twin(p) === p ? [page(p, p)] : [page(p, p), page(twin(p), p)])))));
}

// One hop: a single 301 straight to a URL that answers 200.
const hop = async (from, to) => {
  const r = await get(from);
  const loc = r.headers.get('location') && new URL(r.headers.get('location'), from).href;
  if (r.status !== 301 || loc !== to) return fail(`redirect ${from}: ${r.status} -> ${loc} (want 301 -> ${to})`);
  const end = await get(to);
  if (end.status !== 200) fail(`redirect ${from}: target ${to} is ${end.status}`);
};
const www = `www.${host}`;
await Promise.all([
  // Scheme and host hops only exist on the real site (local Apache has no TLS).
  ...(base === SITE ? [
    hop(`http://${host}/about`, abs('/about')),
    hop(`https://${www}/about`, abs('/about')),
    hop(`http://${www}/about`, abs('/about')),
    hop(`http://${host}/`, abs('/')),
  ] : []),
  hop(abs('/about/'), abs('/about')),
  hop(abs('/about.html'), abs('/about')),
  hop(abs('/services/ac-repair/'), abs('/services/ac-repair')),
  hop(abs('/services/ac-repair.html'), abs('/services/ac-repair')),
  hop(abs('/en/about/'), abs('/en/about')),
  hop(abs('/faults'), abs('/services')),
  hop(abs('/en/faults'), abs('/en/services')),
]);

// Files.
const robots = await (await get(abs('/robots.txt'))).text();
if (/^User-agent:\s*\*[^]*?^Disallow:\s*\/\s*$/im.test(robots)) fail('robots.txt blocks the whole site');
if (!/^Sitemap:/im.test(robots)) fail('robots.txt has no Sitemap line');
let locs = 0;
const index = await get(abs('/sitemap-index.xml'));
if (index.status !== 200) fail(`sitemap-index.xml ${index.status}`);
for (const sm of [...(await index.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])) {
  const r = await get(sm.replace(SITE, base));
  if (r.status !== 200) fail(`${sm} ${r.status}`);
  locs += [...(await r.text()).matchAll(/<url>/g)].length;
}
if (locs !== paths.length * 2) fail(`sitemaps list ${locs} URLs, want ${paths.length * 2}`);
for (const f of ['/sitemap.xml', '/favicon.ico', '/favicon.svg', '/apple-touch-icon.png', '/manifest.json', '/blog/rss.xml']) {
  const r = await get(abs(f));
  if (r.status !== 200) fail(`${f} ${r.status}`);
}

// Diff with the pre-launch record.
const diff = [];
for (const p of pages.filter((x) => before[x.path])) {
  const b = before[p.path];
  if (b.canonical !== p.canonical) diff.push(`${p.path} canonical: ${b.canonical} -> ${p.canonical}`);
  if (b.title !== p.title) diff.push(`${p.path} title: ${b.title} -> ${p.title}`);
}

if (out) writeFileSync(out, JSON.stringify({ base, recorded: new Date().toISOString(), fails, diff, pages }, null, 1));
console.log(`${pages.length} pages, ${pages.filter((p) => p.status === 200).length} answer 200, ${locs} sitemap URLs`);
console.log(`changed vs pre-launch: ${diff.filter((d) => d.includes(' canonical:')).length} canonicals, ${diff.filter((d) => d.includes(' title:')).length} titles`);
if (fails.length) console.log(`FAIL (${fails.length}):\n  ${fails.join('\n  ')}`);
else console.log('PASS');
process.exit(fails.length ? 1 : 0);
