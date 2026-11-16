/**
 * @fileoverview Smoke, accessibility (TEST-11), and script (ACF-02) checks
 * for every route in ROUTES. The only executable script is the analytics beacon.
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

    test('ships no executable scripts except the analytics beacon', async ({
      page,
    }) => {
      await page.goto(route.path);

      const scripts = page.locator('script:not([type="application/ld+json"])');

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

test('home and about identify Garrison Hutcherson in search metadata', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Garrison Hutcherson · Support Engineer');
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    'content',
    'Garrison Hutcherson',
  );
  const structuredData = page.locator('script[type="application/ld+json"]');
  expect(JSON.parse((await structuredData.textContent()) ?? '')).toMatchObject({
    '@type': 'WebSite',
    name: 'Garrison Hutcherson',
    url: 'https://garrisonhutcherson.com/',
  });

  await page.goto('/about/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://garrisonhutcherson.com/about/',
  );
  expect(JSON.parse((await structuredData.textContent()) ?? '')).toMatchObject({
    '@type': 'ProfilePage',
    url: 'https://garrisonhutcherson.com/about/',
    mainEntity: {
      '@type': 'Person',
      name: 'Garrison Hutcherson',
      sameAs: [
        'https://www.linkedin.com/in/gtayhutch',
        'https://github.com/gtayhutch',
      ],
    },
  });
});

test('unknown paths return the 404 page', async ({page}) => {
  const response = await page.goto('/this-page-does-not-exist');

  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', {level: 1})).toHaveText(
    'Page not found',
  );
});
