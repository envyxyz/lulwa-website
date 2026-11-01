// Favicon set, apple touch icon, logo for schema and one brand OG image, from ../growth/Brand. Run: node scripts/brand-assets.mjs
import sharp from 'sharp';

const PEARL = '#eef2ef';
const mark = '../growth/Brand/lulwa-mark.png';
const out = 'public';

await sharp('../growth/Brand/lulwa-mark.svg', { density: 300 }).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(`${out}/icon-512.png`);
await sharp(`${out}/icon-512.png`).resize(192, 192).png().toFile(`${out}/icon-192.png`);
await sharp(`${out}/icon-512.png`).resize(32, 32).png().toFile(`${out}/favicon-32.png`);
await sharp(mark).resize(140, 140, { fit: 'contain', background: PEARL }).extend({ top: 20, bottom: 20, left: 20, right: 20, background: PEARL }).flatten({ background: PEARL }).png().toFile(`${out}/apple-touch-icon.png`);
// Logo for JSON-LD publisher: full lockup on white.
await sharp('../growth/Brand/lulwa-logo-full.png').resize({ width: 600 }).flatten({ background: '#ffffff' }).png().toFile(`${out}/logo.png`);
// OG: full lockup centred on pearl, no text so one file serves both languages.
const logo = await sharp('../growth/Brand/lulwa-logo-full.png').resize({ width: 760 }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: PEARL } }).composite([{ input: logo, gravity: 'centre' }]).jpeg({ quality: 82 }).toFile(`${out}/og.jpg`);
console.log('brand assets written');
