// T19. Writes one deliberate violation per rule, checks that exact rule fires, removes it,
// and checks allowed code (rounded tone-step cards) stays clean. Exit 1 if any rule stays silent.
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';

const dir = 'src/components/__proof__';
const astro = (markup) => `---\n---\n${markup}\n`;
const fires = [
  ['eslint', 'lulwa/no-raw-hex', 'Hex.astro', astro(`<svg><path fill="#ff0000" /></svg>`)],
  ['eslint', 'lulwa/no-raw-hex', 'HexClass.astro', astro(`<div class="text-[#ff0000]"></div>`)],
  ['eslint', 'lulwa/no-raw-hex', 'hex.ts', `export const c = '#0f6e7a';\n`],
  ['eslint', 'lulwa/no-arbitrary-tailwind', 'Arbitrary.astro', astro(`<div class="mt-[13px]"></div>`)],
  ['eslint', 'lulwa/no-arbitrary-tailwind', 'ArbitraryProp.astro', astro(`<div class:list={['[color:red]']}></div>`)],
  ['eslint', 'lulwa/no-physical-tailwind', 'Physical.astro', astro(`<div class="ml-4 md:text-left"></div>`)],
  ['eslint', 'lulwa/no-literal-copy', 'CopyAr.astro', astro(`<p>المكيف وقف</p>`)],
  ['eslint', 'lulwa/no-literal-copy', 'CopyEn.astro', astro(`<p>Call us</p>`)],
  ['eslint', 'lulwa/no-literal-copy', 'CopyAria.astro', astro(`<button aria-label="Open menu"></button>`)],
  ['stylelint', 'color-no-hex', 'hex.css', `a { color: #ff0000; }\n`],
  ['stylelint', 'color-no-hex', 'HexStyle.astro', astro(`<style>a { color: #ff0000; }</style>`)],
  ['stylelint', 'property-disallowed-list', 'margin.css', `a { margin-left: 1rem; }\n`],
  ['stylelint', 'declaration-property-value-disallowed-list', 'align.css', `a { text-align: left; }\n`],
  ['stylelint', 'declaration-property-value-disallowed-list', 'shadow.css', `a { box-shadow: 0 1px 2px black; }\n`],
  ['stylelint', 'declaration-property-value-disallowed-list', 'radius.css', `a { border-radius: 13px; }\n`],
  ['stylelint', 'function-disallowed-list', 'gradient.css', `a { background: linear-gradient(red, blue); }\n`],
];
const clean = [
  ['eslint', 'Card.astro', astro(`<div class="rounded-card bg-pearl-step p-card ms-4 text-start"></div>`)],
  ['stylelint', 'card.css', `a { border-radius: var(--radius-card); background: var(--color-pearl-step); margin-inline-start: 1rem; }\n`],
];

const run = (tool, file) => {
  const args = tool === 'eslint' ? ['eslint', '--format', 'json', '--no-warn-ignored', file] : ['stylelint', '--formatter', 'json', file];
  const { stdout, stderr } = spawnSync('pnpm', ['exec', ...args], { encoding: 'utf8', shell: true });
  const json = (tool === 'eslint' ? stdout : stderr + stdout).match(/\[[\s\S]*\]/)?.[0] ?? '[]';
  return JSON.parse(json).flatMap((r) => (tool === 'eslint' ? r.messages.map((m) => m.ruleId) : r.warnings.map((w) => w.rule)));
};

mkdirSync(dir, { recursive: true });
let failed = 0;
try {
  for (const [tool, rule, name, body] of fires) {
    const file = `${dir}/${name}`;
    writeFileSync(file, body);
    const hit = run(tool, file).includes(rule);
    console.log(`${hit ? 'fires ' : 'SILENT'} ${rule} on ${name}`);
    if (!hit) failed++;
  }
  for (const [tool, name, body] of clean) {
    const file = `${dir}/${name}`;
    writeFileSync(file, body);
    const hits = run(tool, file);
    console.log(`${hits.length ? 'WRONGLY FLAGGED' : 'allowed'} ${name} ${hits.join(' ')}`);
    if (hits.length) failed++;
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
console.log(failed ? `T19: ${failed} failed` : 'T19: every rule fires');
process.exit(failed ? 1 : 0);
