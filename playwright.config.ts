import { defineConfig } from '@playwright/test';

// Runs against the built site: `pnpm build` first. Phase 8 points this at wrangler for T2.
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  timeout: 60_000,
  reporter: [['list'], ['json', { outputFile: 'test-results/contract.json' }]],
  updateSnapshots: 'none',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
  use: { baseURL: 'http://localhost:4321', channel: 'msedge' },
  webServer: { command: 'pnpm exec astro preview --port 4321', url: 'http://localhost:4321', reuseExistingServer: true },
});
