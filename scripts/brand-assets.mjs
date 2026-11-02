// Favicon set, app icons, logo for schema and the OG image, all from the one brand mark. Run: node scripts/brand-assets.mjs
// The mark is the same path the header logo draws (src/components/Logo.astro). Old file names stay (docs/LAUNCH-PLAN.md).
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const TEAL = '#0f6e7a';
const TEAL_DARK = '#47b6c2'; // the lifted teal the site uses on a dark ground (tokens.css)
const COPPER = '#d9772b';
const PEARL = '#eef2ef';
const out = 'public';
const icons = `${out}/images/icons`;
mkdirSync(icons, { recursive: true });
mkdirSync(`${out}/images/brand`, { recursive: true });

// Mark geometry in a 256 box. The stroke and the pearl together span x 25..195, y 23..201, centre (110, 112), 178 tall.
const PATH = 'M178 40V128C178 164 152 184 112 184C78 184 54 168 42 118';
const CX = 110, CY = 112, H = 178, REACH = 116; // REACH: farthest point of the mark from its centre

/** The mark scaled so its height is `frac` of the square, centred, on `bg` (or transparent). */
const svg = (size, frac, bg) => {
  const s = (size * frac) / H;
  const t = `translate(${(size / 2 - CX * s).toFixed(3)} ${(size / 2 - CY * s).toFixed(3)}) scale(${s.toFixed(5)})`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : ''}<g transform="${t}" fill="none"><path d="${PATH}" stroke="${TEAL}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/><circle cx="112" cy="138" r="28" fill="${COPPER}"/></g></svg>`;
};
// Drawn at 8x and shrunk, so a 16 px icon is anti-aliased by a good filter rather than by the rasteriser alone.
const render = (size, frac, bg) => sharp(Buffer.from(svg(size * 8, frac, bg)), { density: 72 }).resize(size, size, { kernel: 'lanczos3' }).png({ compressionLevel: 9 });
// A circle crop (Google shows favicons in a circle) must not clip the mark: REACH * scale <= half the square.
const CIRCLE_SAFE = (0.5 * H) / REACH; // 0.767
const SAFE = CIRCLE_SAFE;
const MASK = (0.4 * 2 * H) / (2 * REACH); // maskable: inside the central 80% circle

// favicon.svg, with a lighter teal when the device is dark.
writeFileSync(
  `${out}/favicon.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 12 200 200" fill="none"><style>.m{stroke:${TEAL}}@media (prefers-color-scheme:dark){.m{stroke:${TEAL_DARK}}}</style><path class="m" d="${PATH}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/><circle cx="112" cy="138" r="28" fill="${COPPER}"/></svg>\n`,
);

// PNG favicons: transparent, mark sized for the pixel grid.
const fav = { 32: 0.92, 48: SAFE, 96: SAFE, 192: SAFE };
for (const [n, frac] of Object.entries(fav)) await render(Number(n), frac).toFile(`${out}/favicon-${n}.png`);

// favicon.ico: 16, 32, 48 as PNG entries (6-byte header, 16 bytes per entry, then the images).
const sizes = [16, 32, 48];
const frames = await Promise.all(sizes.map((n) => render(n, n === 16 ? 0.94 : n === 32 ? 0.92 : SAFE).toBuffer()));
const head = Buffer.alloc(6 + 16 * frames.length);
head.writeUInt16LE(1, 2);
head.writeUInt16LE(frames.length, 4);
let at = head.length;
frames.forEach((png, i) => {
  const n = sizes[i], e = 6 + 16 * i;
  head[e] = n; head[e + 1] = n;
  head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
  head.writeUInt32LE(png.length, e + 8); head.writeUInt32LE(at, e + 12);
  at += png.length;
});
writeFileSync(`${out}/favicon.ico`, Buffer.concat([head, ...frames]));

// App icons. "any" is the mark alone; maskable and Apple/Windows tiles sit on pearl with a safe zone (the OS crops them).
await render(180, 0.7, PEARL).flatten({ background: PEARL }).toFile(`${out}/apple-touch-icon.png`);
await render(150, 0.7, PEARL).flatten({ background: PEARL }).toFile(`${out}/mstile-150x150.png`);
for (const n of [192, 512]) {
  await render(n, 0.8).toFile(`${icons}/icon-${n}x${n}.png`);
  await render(n, MASK, PEARL).flatten({ background: PEARL }).toFile(`${icons}/icon-${n}x${n}-maskable.png`);
}
for (const name of ['services', 'areas', 'brands', 'contact']) await render(192, 0.7, PEARL).flatten({ background: PEARL }).toFile(`${icons}/shortcut-${name}.png`);

// Logo for schema: the full lockup on white. Brand folder holds the artwork.
const lockup = '../growth/Brand/lulwa-logo-full.png';
await sharp(lockup).resize({ width: 600 }).flatten({ background: '#ffffff' }).png({ compressionLevel: 9 }).toFile(`${out}/images/brand/lulwa-logo.png`);
// OG: the lockup centred on pearl, no text so one file serves both languages.
const logo = await sharp(lockup).resize({ width: 760 }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: PEARL } }).composite([{ input: logo, gravity: 'centre' }]).png({ compressionLevel: 9 }).toFile(`${out}/images/og-default.png`);
console.log('brand assets written');
