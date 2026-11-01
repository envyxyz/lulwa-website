// pnpm test:contract: builds, runs T1 to T22, prints one line per test against the phase that owes it.
// Pass --fast to skip Lighthouse (T18), which takes minutes. Exit 1 if anything is red.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const GREEN_BY = { T1: 6, T2: 8, T3: 8, T4: 8, T5: 8, T6: 2, T7: 3, T8: 9, T9: 7, T10: 6, T11: 6, T12: 3, T13: 3, T14: 4, T15: 7, T16: 7, T17: 9, T18: 9, T19: 1, T20: 9, T21: 2, T22: 4 };
const run = (command) => spawnSync(command, { shell: true, stdio: 'inherit' }).status === 0;
const quiet = (command) => spawnSync(command, { shell: true, stdio: 'ignore' }).status === 0;

if (!run('pnpm build')) process.exit(1);

const results = {};
const add = (id, ok) => {
  results[id] ??= { pass: 0, fail: 0 };
  results[id][ok ? 'pass' : 'fail']++;
};

add('T19', quiet('pnpm lint') && quiet('node scripts/prove-lint.mjs'));
add('T22', quiet('node scripts/check-photos.mjs'));
add('T20', quiet('node scripts/taste.mjs'));
if (!process.argv.includes('--fast')) add('T18', quiet('pnpm test:lighthouse'));

quiet('pnpm exec playwright test');
const walk = (suite) => [...(suite.specs ?? []), ...(suite.suites ?? []).flatMap(walk)];
for (const spec of walk(JSON.parse(readFileSync('test-results/contract.json', 'utf8')))) add(spec.title.split(' ')[0], spec.ok);

let red = false;
for (const id of Object.keys(GREEN_BY)) {
  const r = results[id];
  const state = !r ? 'skipped' : r.fail ? 'RED' : 'green';
  if (r?.fail) red = true;
  console.log(`${id.padEnd(4)} ${state.padEnd(8)} ${r ? `${r.pass} passed, ${r.fail} failed` : ''}`.padEnd(42) + `owed by phase ${GREEN_BY[id]}`);
}
process.exit(red ? 1 : 0);
