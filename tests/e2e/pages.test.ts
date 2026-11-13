/**
 * @fileoverview Smoke, accessibility (TEST-11), and zero-JS (ACF-02) checks
 * for every route in ROUTES.
 */
import AxeBuilder from '@axe-core/playwright';
import {expect, test} from '@playwright/test';

import {ROUTES} from './routes';

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

    test('ships no client-side scripts', async ({page}) => {
      await page.goto(route.path);

      await expect(page.locator('script')).toHaveCount(0);
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
