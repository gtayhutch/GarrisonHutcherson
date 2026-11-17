/**
 * @fileoverview Smoke, accessibility (TEST-11), and script (ACF-02) checks
 * for every route in ROUTES. Executable scripts handle theme and analytics.
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

    for (const theme of ['dark', 'light']) {
      test(`has no automatically detectable accessibility violations in ${theme} mode`, async ({
        page,
      }) => {
        await page.addInitScript(theme => {
          localStorage.setItem('portfolio-theme', theme);
        }, theme);
        await page.goto(route.path);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

        const results = await new AxeBuilder({page}).analyze();

        expect(results.violations).toEqual([]);
      });
    }

    test('ships only the theme script and analytics beacon', async ({page}) => {
      await page.goto(route.path);

      const scripts = page.locator('script:not([type="application/ld+json"])');

      await expect(scripts).toHaveCount(2);
      await expect(page.locator('script[src="/theme.js"]')).toHaveCount(1);
      const analytics = page.locator(`script[src="${ANALYTICS_BEACON_SRC}"]`);
      await expect(analytics).toHaveAttribute('type', 'module');
      await expect(analytics).toHaveAttribute(
        'data-cf-beacon',
        JSON.stringify({token: ANALYTICS_TOKEN}),
      );
    });
  });
}

test('light mode stays selected across pages and can return to dark mode', async ({
  page,
}) => {
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto('/');
  const toggle = page.getByRole('button', {name: 'Light mode'});
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.focus();
  await toggle.press('Space');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'light');
  await expect(page.locator('.contact-band')).toHaveCSS(
    'background-image',
    /linear-gradient\(rgb\(231, 237, 241\), rgb\(245, 247, 250\)\)/,
  );
  await expect(
    page.getByRole('banner').getByRole('link', {name: 'View Résumé'}),
  ).toHaveCSS('color', 'rgb(23, 42, 59)');

  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/contact/');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  const booking = page.getByRole('link', {name: /Schedule a meeting/});
  await expect(booking).toHaveCSS(
    'background-color',
    'rgba(255, 255, 255, 0.28)',
  );
  await expect(booking).toHaveCSS('backdrop-filter', /blur\(10px\)/);
  const menuToggle = page.locator('details summary');
  await menuToggle.click();
  const menu = page.getByRole('navigation', {name: 'Main (mobile)'});
  await expect(menu).toHaveCSS('background-color', 'rgba(247, 250, 253, 0.76)');
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  await menuToggle.click();
  await toggle.click();
  await page.reload();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark');
});

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
