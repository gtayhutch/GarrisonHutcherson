/**
 * @fileoverview Site-wide behavior: navigation, content order, contact
 * details, the no-JS mobile menu, and the printable résumé.
 */
import {expect, test} from '@playwright/test';

import {PUBLIC_EMAIL, ROUTES} from './routes';

test('main navigation reaches every section and marks the current page', async ({
  page,
}) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', {name: 'Main', exact: true});

  await nav.getByRole('link', {name: 'Experience'}).click();

  await expect(page).toHaveURL(/\/experience\/$/);
  await expect(
    page
      .getByRole('navigation', {name: 'Main', exact: true})
      .getByRole('link', {name: 'Experience'}),
  ).toHaveAttribute('aria-current', 'page');
});

test('experience lists employers newest first', async ({page}) => {
  await page.goto('/experience/');

  const companies = page.getByRole('main').getByRole('heading', {level: 2});

  await expect(companies.first()).toHaveText('One Inc');
  await expect(companies.last()).toHaveText('Cloud 10 Corporation');
});

test('home page previews three employers and four skill groups', async ({
  page,
}) => {
  await page.goto('/');

  const experience = page.getByRole('region', {name: 'Experience'});
  const skills = page.getByRole('region', {name: 'Skills'});

  await expect(experience.getByRole('heading', {level: 3})).toHaveCount(3);
  await expect(skills.getByRole('heading', {level: 3})).toHaveCount(4);
});

for (const route of ROUTES) {
  test(`${route.path} publishes only the site email and no phone links`, async ({
    page,
  }) => {
    await page.goto(route.path);

    const mailtoLinks = await page
      .locator('a[href^="mailto:"]')
      .evaluateAll(links => links.map(link => link.getAttribute('href')));

    for (const href of mailtoLinks) {
      expect(href).toBe(`mailto:${PUBLIC_EMAIL}`);
    }
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  });
}

test('external links use HTTPS', async ({page}) => {
  for (const route of ROUTES) {
    await page.goto(route.path);
    const hrefs = await page
      .locator('a[href^="http"]')
      .evaluateAll(links => links.map(link => link.getAttribute('href')));
    for (const href of hrefs) {
      expect(href, `${route.path}: ${String(href)}`).toMatch(/^https:\/\//);
    }
  }
});

test.describe('on a phone', () => {
  test.use({viewport: {width: 375, height: 812}});

  test('the menu opens without JavaScript and links to every section', async ({
    page,
  }) => {
    await page.goto('/');
    const menu = page.getByRole('navigation', {name: 'Main (mobile)'});

    await expect(menu).toBeHidden();
    await page.locator('details summary').click();

    await expect(menu).toBeVisible();
    await expect(menu.getByRole('link')).toHaveCount(6);
  });

  test('pages do not scroll sideways', async ({page}) => {
    for (const route of ROUTES) {
      await page.goto(route.path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, route.path).toBeLessThanOrEqual(0);
    }
  });
});

test('printing the résumé hides the site header and footer', async ({page}) => {
  await page.goto('/resume/');
  await page.emulateMedia({media: 'print'});

  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('.site-footer')).toBeHidden();
  await expect(page.getByRole('heading', {level: 1})).toBeVisible();
});
