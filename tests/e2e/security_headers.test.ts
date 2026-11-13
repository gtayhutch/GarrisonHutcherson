/**
 * @fileoverview Asserts the security headers from public/_headers on HTML
 * and static asset responses (SEC-WEB-01..06, TEST-10, OVR-003).
 */
import {expect, test} from '@playwright/test';

const EXPECTED_HEADERS: Readonly<Record<string, string>> = {
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'cross-origin-opener-policy': 'same-origin',
};

const REQUIRED_CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' https://static.cloudflareinsights.com",
  "style-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
];

for (const path of ['/', '/robots.txt', '/this-page-does-not-exist']) {
  test(`${path} sends the security headers`, async ({request}) => {
    const response = await request.get(path);
    const headers = response.headers();

    for (const [name, value] of Object.entries(EXPECTED_HEADERS)) {
      expect(headers[name], name).toBe(value);
    }
    const csp = headers['content-security-policy'] ?? '';
    for (const directive of REQUIRED_CSP_DIRECTIVES) {
      expect(csp, directive).toContain(directive);
    }
  });
}

test('HTML is served with a UTF-8 content type', async ({request}) => {
  const response = await request.get('/');

  expect(response.headers()['content-type']).toMatch(
    /text\/html;\s*charset=utf-8/i,
  );
});
