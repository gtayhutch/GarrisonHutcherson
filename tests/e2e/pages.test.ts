/**
 * @fileoverview Smoke, accessibility (TEST-11), and script (ACF-02) checks
 * for every route in ROUTES. The only allowed script is the analytics beacon.
 */
import AxeBuilder from '@axe-core/playwright';
import {expect, test} from './fixtures';
import {ANALYTICS_BEACON_SRC, ANALYTICS_TOKEN, ROUTES} from './routes';

for (const route of ROUTES) {
  test.describe(`page ${route.path}`, () => {
    test('loads with its heading and no console errors', async ({page}) => {
      const errors: string[] = [];
      page.on('console', message => {
        if (message.type() === 'error') errors.push(message.text());
      });
      page.on('pageerror', error => errors.push(error.message));

      const response = await page.goto(route.path);

      expect(response?.status()).toBe(200);
      await expect(page.getByRole('heading', {level: 1})).toHaveText(
        route.heading,
      );
      expect(errors).toEqual([]);
    });

    test('has no automatically detectable accessibility violations', async ({
      page,
    }) => {
      await page.goto(route.path);

      const results = await new AxeBuilder({page}).analyze();

      expect(results.violations).toEqual([]);
    });

    test('ships no scripts except the analytics beacon', async ({page}) => {
      await page.goto(route.path);

      const scripts = page.locator('script');

      await expect(scripts).toHaveCount(1);
      await expect(scripts).toHaveAttribute('src', ANALYTICS_BEACON_SRC);
      await expect(scripts).toHaveAttribute('type', 'module');
      await expect(scripts).toHaveAttribute(
        'data-cf-beacon',
        JSON.stringify({token: ANALYTICS_TOKEN}),
      );
    });
  });
}

test('unknown paths return the 404 page', async ({page}) => {
  const response = await page.goto('/this-page-does-not-exist');

  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', {level: 1})).toHaveText(
    'Page not found',
  );
});
