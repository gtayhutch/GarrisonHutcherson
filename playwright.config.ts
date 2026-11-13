/**
 * @fileoverview Playwright end-to-end config (TEST-02). Tests run against the
 * built site served by `wrangler dev`, so `public/_headers` is applied exactly
 * as in production. Run `pnpm build` first; `pnpm verify` does this.
 */
import {defineConfig, devices} from '@playwright/test';

const PORT = 8787;
const isCi = Boolean(process.env['CI']);

// Tool config: Playwright requires a default export (TS-03 exception).
export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: '**/*.test.ts',
  fullyParallel: true,
  forbidOnly: isCi,
  retries: 0,
  reporter: isCi ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://localhost:${String(PORT)}`,
    trace: 'retain-on-failure',
  },
  projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
  webServer: {
    command: `pnpm exec wrangler dev --port ${String(PORT)} --ip 127.0.0.1`,
    url: `http://localhost:${String(PORT)}`,
    reuseExistingServer: !isCi,
    timeout: 60_000,
    env: {WRANGLER_SEND_METRICS: 'false'},
  },
});
