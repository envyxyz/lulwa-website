// Zips the contents of the build folder into hostinger-upload.zip at the repo root, ready to extract into public_html.
// Paths sit at the zip root with forward slashes; dotfiles (.htaccess) and the logs/ folder are included.
// Input: --outDir <dir>, --outDir=<dir> or env OUT_DIR (default dist). Output: --zip <file> (default hostinger-upload.zip).
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { crc32, deflateRawSync } from 'node:zlib';

const flag = (name) => {
  const eq = process.argv.find((a) => a.startsWith(`${name}=`));
  if (eq) return eq.slice(name.length + 1);
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
const outDir = resolve(process.env.OUT_DIR || flag('--outDir') || 'dist');
const zipFile = resolve(flag('--zip') || 'hostinger-upload.zip');
if (!existsSync(join(outDir, 'index.html'))) throw new Error(`package: ${outDir} has no index.html, build first`);
for (const required of ['.htaccess', 'contact-submit.php', 'logs/.htaccess']) {
  if (!existsSync(join(outDir, required))) throw new Error(`package: ${required} missing from ${outDir}`);
}

const entries = []; // { name, data? } ; directories end with "/"
const walk = (dir, prefix) => {
  for (const entry of readdirSync(dir).sort()) {
    const path = join(dir, entry);
    const name = `${prefix}${entry}`;
    if (statSync(path).isDirectory()) {
      entries.push({ name: `${name}/` });
      walk(path, `${name}/`);
    } else entries.push({ name, data: readFileSync(path) });
  }
};
walk(outDir, '');

const now = new Date();
const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
const UTF8 = 0x0800;
const chunks = [];
const central = [];
let offset = 0;

for (const { name, data } of entries) {
  const nameBuf = Buffer.from(name, 'utf8');
  const raw = data ?? Buffer.alloc(0);
  const packed = data && raw.length ? deflateRawSync(raw, { level: 9 }) : raw;
  const method = data && raw.length ? 8 : 0;
  const crc = data ? crc32(raw) : 0;
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(UTF8, 6);
  local.writeUInt16LE(method, 8);
  local.writeUInt16LE(dosTime, 10);
  local.writeUInt16LE(dosDate, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(packed.length, 18);
  local.writeUInt32LE(raw.length, 22);
  local.writeUInt16LE(nameBuf.length, 26);
  chunks.push(local, nameBuf, packed);

  const dir = Buffer.alloc(46);
  dir.writeUInt32LE(0x02014b50, 0);
  dir.writeUInt16LE(0x031e, 4); // made by: Unix, v3.0
  dir.writeUInt16LE(20, 6);
  dir.writeUInt16LE(UTF8, 8);
  dir.writeUInt16LE(method, 10);
  dir.writeUInt16LE(dosTime, 12);
  dir.writeUInt16LE(dosDate, 14);
  dir.writeUInt32LE(crc, 16);
  dir.writeUInt32LE(packed.length, 20);
  dir.writeUInt32LE(raw.length, 24);
  dir.writeUInt16LE(nameBuf.length, 28);
  dir.writeUInt32LE((data ? 0o100644 : 0o040755) * 0x10000 + (data ? 0 : 0x10), 38); // unix mode, DOS directory bit
  dir.writeUInt32LE(offset, 42);
  central.push(dir, nameBuf);
  offset += 30 + nameBuf.length + packed.length;
}

const centralSize = central.reduce((n, b) => n + b.length, 0);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(entries.length, 8);
end.writeUInt16LE(entries.length, 10);
end.writeUInt32LE(centralSize, 12);
end.writeUInt32LE(offset, 16);
if (entries.length > 65534) throw new Error('package: too many files for a plain zip');
writeFileSync(zipFile, Buffer.concat([...chunks, ...central, end]));
console.log(`package: ${entries.filter((e) => e.data).length} files, ${entries.filter((e) => !e.data).length} folders -> ${zipFile}`);
