/**
 * @fileoverview Shared Playwright fixtures. Every page test stubs the
 * Cloudflare Web Analytics endpoints, so tests never reach a hosted service
 * (TEST-05) and the beacon can't add network noise or console errors
 * (TEST-12: mock third-party HTTP at the boundary).
 */
import {test as base, expect} from '@playwright/test';

/** Hosts the analytics beacon loads from and reports to. */
const ANALYTICS_HOSTS = /^https:\/\/(static\.)?cloudflareinsights\.com\//;

/** Playwright `test` with the analytics endpoints stubbed on every page. */
export const test = base.extend({
  page: async ({page}, use) => {
    await page.route(ANALYTICS_HOSTS, route =>
      route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: '',
      }),
    );
    await use(page);
  },
});

export {expect};
