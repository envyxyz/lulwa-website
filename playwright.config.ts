import { defineConfig } from '@playwright/test';

// Runs against the built site: `pnpm build` first. Served by wrangler so _redirects and the Worker's 410s are real.
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  timeout: 60_000,
  reporter: [['list'], ['json', { outputFile: 'test-results/contract.json' }]],
  updateSnapshots: 'none',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
  use: { baseURL: 'http://localhost:4321', channel: 'msedge', actionTimeout: 5_000 },
  webServer: { command: 'pnpm exec wrangler dev --port 4321', url: 'http://localhost:4321', reuseExistingServer: true },
});
