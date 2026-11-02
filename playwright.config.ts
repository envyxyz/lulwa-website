import { defineConfig } from '@playwright/test';

const port = process.env.PW_PORT ?? '4330';
const docroot = process.env.PW_DOCROOT ?? 'dist';

// Runs against the built site (`pnpm build` first, or a build made with --outDir and PW_DOCROOT set to it).
// Served by real Apache and PHP, so .htaccess and contact-submit.php are what Hostinger runs. Needs env HTTPD_DIR
// (the Apache24 folder; PHP is read from ../php beside it, or PHP_DIR). See scripts/serve-apache.mjs.
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  timeout: 60_000,
  reporter: [['list'], ['json', { outputFile: 'test-results/contract.json' }]],
  updateSnapshots: 'none',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
  use: { baseURL: `http://localhost:${port}`, channel: 'msedge', actionTimeout: 5_000, contextOptions: { reducedMotion: 'reduce' } },
  webServer: { command: `node scripts/serve-apache.mjs "${docroot}" --port ${port}`, url: `http://localhost:${port}/`, reuseExistingServer: true, timeout: 30_000 },
});
