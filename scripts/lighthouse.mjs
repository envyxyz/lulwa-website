// T18 collect: three Lighthouse runs per route into .lighthouseci, for `lhci assert` to judge.
// Replaces `lhci collect`, which has no per-run timeout: one stuck Edge hung a whole sweep for hours.
// Resumes by default, counting the runs already saved. --fresh starts over. Needs a preview on LH_PORT (4322).
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const { ci } = require('../lighthouserc.cjs');
const lhciDir = dirname(require.resolve('@lhci/cli/package.json'));
const cli = createRequire(join(lhciDir, 'x.js')).resolve('lighthouse/cli/index.js');
const port = process.env.LH_PORT ?? 4322;
const RUNS = ci.collect.numberOfRuns;
const TIMEOUT_MS = 240_000;
const dir = '.lighthouseci';

if (process.argv.includes('--fresh')) rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
const urls = ci.collect.url.map((url) => url.replace(':4322', `:${port}`));
if (!(await fetch(urls[0]).then((r) => r.ok, () => false))) throw new Error(`No preview on port ${port}: run pnpm exec astro preview --port ${port}`);

const done = {};
for (const f of readdirSync(dir).filter((name) => /^lhr-.*\.json$/.test(name))) {
  const { requestedUrl, runtimeError } = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  if (!runtimeError) done[requestedUrl] = (done[requestedUrl] ?? 0) + 1;
}

const once = (url, out) =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, [cli, url, '--output=json', `--output-path=${out}`, '--quiet', `--chrome-flags=${ci.collect.settings.chromeFlags}`], {
      stdio: 'ignore',
      env: { ...process.env, CHROME_PATH: ci.collect.chromePath },
    });
    const timer = setTimeout(() => {
      if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
      else child.kill();
      resolve('timeout');
    }, TIMEOUT_MS);
    child.on('exit', (code) => {
      clearTimeout(timer);
      resolve(code === 0 ? 'ok' : `exit ${code}`);
    });
  });

let failures = 0;
for (const [i, url] of urls.entries()) {
  for (let run = done[url] ?? 0, tries = 0; run < RUNS && tries < RUNS + 2; tries++) {
    const out = join(dir, `lhr-${Date.now()}.json`);
    const result = await once(url, out);
    console.log(`${i + 1}/${urls.length} ${new URL(url).pathname} run ${run + 1}: ${result}`);
    if (result === 'ok') run++;
    else {
      rmSync(out, { force: true });
      failures++;
    }
  }
}
console.log(`Collected. ${failures} failed runs were retried or dropped.`);
