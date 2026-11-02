// T22. Every image in dist needs an entry in src/images/provenance.json:
//   { "<name>": { "kind": "real" | "generated", "source": "<raw file>", "sourceWidth": 680, "note": "..." } }
// kind "generated" = unbranded product illustration on white, raw file in design/generated/ (docs/DESIGN-DIRECTION.md).
// It is allowed, but never as a job photo. Nothing may render wider than its source.
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const PROVENANCE = 'src/images/provenance.json';
const fail = [];

if (!existsSync(PROVENANCE)) {
  console.error(`T22: ${PROVENANCE} is missing`);
  process.exit(1);
}
const provenance = JSON.parse(readFileSync(PROVENANCE, 'utf8'));

for (const [name, entry] of Object.entries(provenance)) {
  if (!['real', 'generated'].includes(entry.kind)) fail.push(`${name}: kind must be real or generated`);
  if (!entry.source || !Number.isInteger(entry.sourceWidth)) fail.push(`${name}: needs source and sourceWidth`);
  if (entry.kind === 'generated' && !entry.source?.startsWith('design/generated/')) fail.push(`${name}: generated images keep their raw file in design/generated/`);
  if (/shopfront/i.test(`${name} ${entry.source}`)) fail.push(`${name}: the shopfront stays off the site until the new sign is up`);
}

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]));
const files = existsSync('dist') ? walk('dist') : [];

// Exports are named <name>-<width>.<ext> by the Phase 4 pipeline.
const exportName = /\/images\/(.+)-(\d+)\.(avif|webp|jpe?g|png)$/;
// Logo artwork from scripts/brand-assets.mjs, not photos. Named one by one so a stray photo in public/ still fails.
const brandAsset = /^dist\/(logo\.png|og\.jpg|apple-touch-icon\.png|favicon-(32|48|96|192)\.png|mstile-150x150\.png|images\/(og-default\.png|brand\/lulwa-logo\.png|icons\/[a-z0-9-]+\.png))$/;
// The old site's images keep their names and paths (docs/LAUNCH-PLAN.md rule 2). They are copied as they were, not made by the pipeline.
const legacyNames = new Set(["AC Repair in Dammam.avif", "Dishwasher Repair in Dammam.avif", "Dryer Repair in Dammam.avif", "Freezer Repair in Dammam.avif", "Microwave Repair in Dammam.avif", "Oven & Stove Repair in Dammam.avif", "Washing Machine Repair in Dammam.avif", "Water Heater Repair in Dammam.avif", "WhatsApp_Logo_green.svg.webp", "ac mechanic.avif", "ac repair near me.avif", "ac repair services near me.avif", "ac repair services.avif", "ac repair shop near me.avif", "ac repair shop.avif", "ac repair.avif", "ac service near me.avif", "ac service.avif", "air conditioner maintenance near me.avif", "air conditioning repair near me.avif", "air conditioning repair service.avif", "air conditioning repair.avif", "air conditioning service near me.avif", "hvac service.avif", "refrigerator repair dammam.avif"]);
const legacy = (file) => /^dist\/(assets\/img\/|uploads\/|blog\/images\/|images\/screenshots\/)/.test(file) || (file.startsWith('dist/images/') && legacyNames.has(file.slice('dist/images/'.length)));
for (const file of files) {
  const match = file.match(exportName);
  if (!match) {
    if (/\.(avif|webp|jpe?g|png|gif)$/i.test(file) && !brandAsset.test(file) && !legacy(file)) fail.push(`${file}: not from the image pipeline`);
    continue;
  }
  const [, name, width] = match;
  const entry = provenance[name];
  if (!entry) fail.push(`${file}: no provenance entry`);
  else if (Number(width) > entry.sourceWidth) fail.push(`${file}: wider than its ${entry.sourceWidth} px source`);
}

for (const file of files.filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1] ?? '';
    const width = Number(tag.match(/\bwidth="(\d+)"/)?.[1]);
    const match = src.match(exportName);
    if (!match) continue;
    const entry = provenance[match[1]];
    if (!width) fail.push(`${file}: ${src} has no width`);
    if (entry && width > entry.sourceWidth) fail.push(`${file}: ${src} renders ${width} px, source is ${entry.sourceWidth} px`);
    if (entry?.kind === 'generated' && /\bdata-job\b/.test(tag)) fail.push(`${file}: ${src} is generated and cannot be shown as a job`);
  }
}

if (fail.length) {
  console.error(`T22: ${fail.length} problem(s)\n${fail.join('\n')}`);
  process.exit(1);
}
console.log(`T22: ${Object.keys(provenance).length} images, all with provenance, none past source width`);
