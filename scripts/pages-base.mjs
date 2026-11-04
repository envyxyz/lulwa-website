// Copies dist to dist-pages for the GitHub Pages preview, which lives under /lulwa-website instead of a domain root. dist stays the Hostinger build.
// Root-relative URLs get the prefix, server-only files go, and every page is noindex so the preview never competes with lulwa.com.sa.
// Canonicals, hreflang and schema already point at lulwa.com.sa and stay as they are. Run after `pnpm build`.
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const base = '/lulwa-website';
const from = 'dist';
const to = 'dist-pages';
if (!existsSync(join(from, 'index.html'))) throw new Error(`pages: ${from} has no index.html, build first`);

rmSync(to, { recursive: true, force: true });
cpSync(from, to, { recursive: true });
for (const path of ['.htaccess', 'contact-submit.php', 'error-en.php', 'logs']) rmSync(join(to, path), { recursive: true, force: true });

const prefix = (url) => url.replace(/^\/(?!\/)/, `${base}/`);
const attributes = (text) =>
  text
    .replace(/\b(href|src|content|data-endpoint|data-thanks)="(\/[^"]*)"/g, (_, name, url) => `${name}="${prefix(url)}"`)
    .replace(/\bsrcset="([^"]*)"/g, (_, list) => `srcset="${list.split(', ').map(prefix).join(', ')}"`);
const noindex = (text) => text.replace(/<meta name="robots"[^>]*>/g, '').replace('</head>', '<meta name="robots" content="noindex"></head>');

const rewrite = (file, text) => {
  if (file.endsWith('.html')) return noindex(attributes(text));
  if (file.endsWith('.css')) return text.replace(/url\(\/(?!\/)/g, `url(${base}/`);
  if (file.endsWith('browserconfig.xml')) return attributes(text);
  if (file.endsWith('manifest.json')) return text.replace(/"\/(?!\/)/g, `"${base}/`);
  return text;
};

let changed = 0;
for (const file of readdirSync(to, { recursive: true, encoding: 'utf8' })) {
  if (!/\.(?:html|css|xml|json)$/.test(file)) continue;
  const path = join(to, file);
  const text = readFileSync(path, 'utf8');
  const out = rewrite(file, text);
  if (out !== text) {
    writeFileSync(path, out);
    changed++;
  }
}
console.log(`pages: ${changed} files rewritten for ${base} in ${to}`);
