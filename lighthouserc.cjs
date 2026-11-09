// T18. Every route in the built sitemap, mobile (Lighthouse default), median of 3.
const { existsSync, readFileSync } = require('node:fs');

const locs = (file) => (existsSync(file) ? [...readFileSync(file, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname) : []);
const built = locs('dist/sitemap-index.xml').flatMap((sitemap) => locs(`dist${sitemap}`));
// Also every page the finished site owes (same list as tests/lib.ts), so a missing page is red, not skipped.
const required = readFileSync('docs/url-map.csv', 'utf8').split(/\r?\n/).filter((line) => line.split(',')[1] === 'keep').map((line) => line.split(',')[0]);
const owed = required;
const paths = [...new Set([...built, ...owed, ...owed.map((path) => (path === '/' ? '/en' : `/en${path}`))])];
const assertions = {
  'categories:performance': ['error', { minScore: 0.95 }],
  'categories:accessibility': ['error', { minScore: 0.95 }],
  'categories:best-practices': ['error', { minScore: 0.95 }],
  'categories:seo': ['error', { minScore: 0.95 }],
  'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
  'total-blocking-time': ['error', { maxNumericValue: 100 }],
  'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
};

module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: 'node scripts/serve-apache.mjs dist --port 4322',
      startServerReadyPattern: 'Apache on',
      url: paths.map((path) => `http://localhost:4322${path}`),
      chromePath: process.env.CHROME_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
      settings: { chromeFlags: '--headless=new' },
    },
    assert: {
      aggregationMethod: 'median',
      assertions,
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
};
