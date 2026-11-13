// Builds the blog-editor preview pages dist/cms/preview-ar.html and preview-en.html from a real built post.
// They expose window.lulwaRender(data) and report clicks to the editor through window.top.lulwaFocus(lang, key).
// Usage: node scripts/cms-preview.mjs [distDir]  (default: dist)
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const dist = resolve(process.argv[2] || 'dist');
const cms = join(dist, 'cms');
const SITE = 'https://lulwa.com.sa';
const SOURCES = { ar: 'blog/ac-repair-in-dammam.html', en: 'en/blog/ac-repair-in-dammam.html' };

// Runs inside the preview page. Plain function, serialised into the page with toString().
function runtime(LANG, SITE) {
  const $ = (el, sel) => el.querySelector(sel);
  const main = document.querySelector('main');
  const head = $(main, 'h1').parentElement; // title block
  const article = $(main, 'article');
  const secTpl = $(article, ':scope > section').cloneNode(true);
  const itemTpl = $(article, 'h3').parentElement.cloneNode(true); // first section may have no sub-points
  const boxTpl = $(article, 'h3').parentElement.parentElement.cloneNode(false);
  const paraTpl = $(secTpl, 'p').cloneNode(true);
  const faqBox = $(main, 'details').parentElement;
  const faqTpl = $(faqBox, 'details').cloneNode(true);
  const dateP = head.querySelectorAll('p')[1];
  const dateLabel = dateP ? dateP.textContent.split(':')[0] : '';

  const url = (s) => (/^(https?:|blob:|data:)/.test(s) ? s : SITE + (s.startsWith('/') ? '' : '/') + s);
  const key = (el, k) => { el.dataset.cmsKey = k; return el; };
  // Fill an element's text, or show a faint placeholder when the field is empty.
  const text = (el, v, k) => {
    el.textContent = v || '\u2026';
    el.style.opacity = v ? '' : '.35';
    el.style.whiteSpace = 'pre-line';
    return key(el, k);
  };
  const figure = (img, k) => {
    const f = document.createElement('figure');
    f.style.margin = '0';
    const i = document.createElement('img');
    i.className = 'rounded-card';
    i.style.cssText = 'max-width:100%;height:auto;display:block';
    i.src = url(img.src); i.alt = img.alt || '';
    key(i, k); f.append(i);
    return f;
  };

  window.lulwaRender = (d) => {
    d = d || {};
    const h1 = $(main, 'h1');
    text(h1, d.h1, 'h1');
    const lead = head.querySelector('p');
    text(lead, d.lead, 'lead');
    // Like Page.astro: the featured image sits in its own section right after the title section.
    document.querySelectorAll('[data-cms-featured]').forEach((f) => f.remove());
    if (d.image && d.image.src) {
      const top = head.closest('section');
      const sec = top.cloneNode(false); const box = top.firstElementChild.cloneNode(false);
      sec.dataset.cmsFeatured = ''; box.append(figure(d.image, 'image_alt')); sec.append(box); top.after(sec);
    }
    if (dateP) dateP.textContent = d.date ? `${dateLabel}: ${d.date}` : '';
    if (dateP) dateP.hidden = !d.date;
    const t = document.title.split('|').slice(1).join('|').trim();
    document.title = (d.h1 || '') + (t ? ' | ' + t : '');

    article.replaceChildren();
    (d.sections || []).forEach((s, n) => {
      const sec = secTpl.cloneNode(true);
      sec.replaceChildren();
      const h2 = secTpl.querySelector('h2').cloneNode(true);
      sec.append(text(h2, s.h, `sections.${n}.h`));
      const paras = String(s.p || '').split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
      (paras.length ? paras : ['']).forEach((p) => sec.append(text(paraTpl.cloneNode(true), p, `sections.${n}.p`)));
      if (s.image && s.image.src) sec.append(figure(s.image, `sections.${n}.image.alt`));
      if ((s.items || []).length) {
        const box = boxTpl.cloneNode(false);
        s.items.forEach((it, m) => {
          const el = itemTpl.cloneNode(true);
          text($(el, 'h3'), it.h, `sections.${n}.items.${m}.h`);
          text($(el, 'p'), it.p, `sections.${n}.items.${m}.p`);
          box.append(el);
        });
        sec.append(box);
      }
      article.append(sec);
    });

    faqBox.replaceChildren();
    (d.faq || []).forEach((f, n) => {
      const el = faqTpl.cloneNode(true);
      el.open = true;
      const sum = $(el, 'summary');
      const q = [...sum.childNodes].find((c) => c.nodeType === 3);
      q.textContent = f.q || '\u2026';
      sum.style.opacity = f.q ? '' : '.35';
      key(sum, `faq.${n}.q`);
      text($(el, 'p'), f.a, `faq.${n}.a`);
      faqBox.append(el);
    });
    // The FAQ block is part of the page only when there are questions.
    const faqSection = faqBox.closest('section');
    if (faqSection) faqSection.hidden = !(d.faq || []).length;
  };

  const style = document.createElement('style');
  style.textContent = '[data-cms-key]{cursor:pointer}[data-cms-key]:hover{outline:2px solid rgba(20,120,120,.45);outline-offset:3px;border-radius:4px}';
  document.head.append(style);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    const k = e.target.closest('[data-cms-key]');
    if (a || k) e.preventDefault();
    if (k) { try { window.top.lulwaFocus?.(LANG, k.dataset.cmsKey); } catch {} }
  }, true);
  window.lulwaRender({});
}

const copyAsset = (rel) => {
  const from = join(dist, rel);
  if (!existsSync(from)) return console.warn('cms-preview: missing', rel);
  mkdirSync(dirname(join(cms, rel)), { recursive: true });
  copyFileSync(from, join(cms, rel));
};

const assets = new Set();
for (const [lang, src] of Object.entries(SOURCES)) {
  let html = readFileSync(join(dist, src), 'utf8');
  html = html
    .replace(/<script\b[\s\S]*?<\/script>/g, '') // analytics, JSON-LD, page scripts: none are needed to look right
    .replace(/<link rel="(?:canonical|alternate|manifest)"[^>]*>/g, '')
    .replace(/<meta name="robots"[^>]*>/g, '')
    .replace(/(\s(?:src|srcset|href)=")\/images\//g, `$1${SITE}/images/`)
    .replace('</head>', '<meta name="robots" content="noindex"></head>');
  for (const m of html.matchAll(/(?:href|src)="(\/(?:_astro|fonts)\/[^"]+)"/g)) assets.add(m[1]);
  const script = `<script>(${runtime.toString()})(${JSON.stringify(lang)},${JSON.stringify(SITE)})</script>`;
  html = html.replace('</body>', script + '</body>');
  mkdirSync(cms, { recursive: true });
  writeFileSync(join(cms, `preview-${lang}.html`), html);
}
// Fonts named inside the stylesheets are copied too, so the page renders with the real type.
for (const a of [...assets].filter((a) => a.endsWith('.css'))) {
  for (const m of readFileSync(join(dist, a), 'utf8').matchAll(/url\((\/fonts\/[^)]+)\)/g)) assets.add(m[1]);
}
assets.forEach((a) => copyAsset(a.slice(1)));
console.log(`cms-preview: wrote preview-ar.html, preview-en.html, copied ${assets.size} assets`);
