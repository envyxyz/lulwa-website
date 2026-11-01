import { defineConfig } from '@playwright/test';

const port = process.env.PW_PORT ?? '4321';

// Runs against the built site: `pnpm build` first. Served by wrangler so _redirects and the Worker's 410s are real.
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  timeout: 60_000,
  reporter: [['list'], ['json', { outputFile: 'test-results/contract.json' }]],
  updateSnapshots: 'none',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
  use: { baseURL: `http://localhost:${port}`, channel: 'msedge', actionTimeout: 5_000, contextOptions: { reducedMotion: 'reduce' } },
  webServer: { command: `pnpm exec wrangler dev --port ${port}`, url: `http://localhost:${port}`, reuseExistingServer: true },
});
