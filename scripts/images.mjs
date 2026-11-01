// Image pipeline: node scripts/images.mjs. Writes public/images/<name>-<width>.avif|webp and src/images/provenance.json.
// Real photos are read from the retouched set, but never exported wider than the WhatsApp original.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const EDITED = '../growth/Photos/Edited/2026-10-19_';
const ORIGINAL = '../growth/Photos/Originals/2026-10-19_';

// Left out on purpose: shopfront (old sign), technician-package-unit (AJCO on the coverall),
// delivery-truck and street-night (plates, other shops), lg-outdoor-units (reads as an LG agency).
const real = ['compressor-closeup_02', 'compressor-install_01', 'compressor-pair_01', 'condensing-unit-wiring_01', 'rooftop-compressor-swap_01', 'rooftop-unit-repair_01'];
const generated = ['split-ac-indoor', 'window-ac', 'outdoor-unit', 'fridge', 'washer', 'dryer'].filter((name) => existsSync(`design/generated/${name}.png`));

const exportAll = async (input, name, widths) => {
  for (const width of widths) {
    const resized = sharp(input).resize({ width });
    await resized.clone().avif({ quality: 55 }).toFile(`public/images/${name}-${width}.avif`);
    await resized.clone().webp({ quality: 72 }).toFile(`public/images/${name}-${width}.webp`);
  }
};

mkdirSync('public/images', { recursive: true });
const provenance = {};

for (const file of real) {
  const name = file.replace(/_\d+$/, '').concat(file.endsWith('02') ? '-2' : '');
  const { width: sourceWidth } = await sharp(`${ORIGINAL}${file}.jpeg`).metadata();
  await exportAll(`${EDITED}${file}.jpg`, name, sourceWidth > 400 ? [340, sourceWidth] : [sourceWidth]);
  provenance[name] = { kind: 'real', source: `growth/Photos/Edited/2026-10-19_${file}.jpg`, sourceWidth, note: 'WhatsApp job photo from the client, 19 Oct 2026. Retouched, not regenerated.' };
}

for (const name of generated) {
  const source = `design/generated/${name}.png`;
  const { width: sourceWidth } = await sharp(source).metadata();
  await exportAll(source, name, [320, 640]);
  provenance[name] = { kind: 'generated', source, sourceWidth, note: 'AI-generated unbranded product illustration, agy, 1 Nov 2026. Never a job photo.' };
}

writeFileSync('src/images/provenance.json', `${JSON.stringify(provenance, null, 2)}\n`);
console.log(`${Object.keys(provenance).length} images exported`);
