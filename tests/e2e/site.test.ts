/**
 * @fileoverview Site-wide behavior: navigation, content order, contact
 * details, the no-JS mobile menu, and the printable résumé.
 */
import {expect, test} from './fixtures';
import {PUBLIC_EMAIL, PUBLIC_PHONE_HREF, RESUME_ROUTE, ROUTES} from './routes';

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

test('case studies are reachable from the main navigation and have separate cards', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('navigation', {name: 'Main', exact: true})
    .getByRole('link', {name: 'Case Studies'})
    .click();

  await expect(page).toHaveURL(/\/case-studies\/$/);
  const main = page.getByRole('main');
  await expect(main.getByRole('article')).toHaveCount(2);
  await expect(
    main.getByRole('article', {
      name: 'Payment failures and an acknowledgement endpoint',
    }),
  ).toContainText('resume payments quickly');
  await expect(
    main.getByRole('article', {name: 'Notifications missing for two users'}),
  ).toContainText('normal response code');
});

test.describe('narrow no-JavaScript viewport', () => {
  test.use({
    javaScriptEnabled: false,
    viewport: {width: 320, height: 720},
  });

  test('case study cards fit without horizontal scrolling', async ({page}) => {
    await page.goto('/case-studies/');
    const cards = page.getByRole('main').getByRole('article');
    await expect(cards).toHaveCount(2);
    await expect(cards.first().getByText('Outcome:')).toBeVisible();
    await expect(cards.last().getByText('Next step:')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(320);
  });
});

test('skills link to the SQL work sample', async ({page}) => {
  await page.goto('/skills/');
  await page
    .getByRole('link', {name: 'SQL and settlement reconciliation sample'})
    .click();

  await expect(page).toHaveURL(/\/projects\/#settlement-reconciliation$/);
  await expect(
    page.locator('#settlement-reconciliation').getByRole('heading', {
      name: 'Reconciling payments against settlements with SQL',
    }),
  ).toBeVisible();
});

test('the résumé links to a downloadable PDF', async ({page, request}) => {
  await page.goto('/resume/');
  const download = page.getByRole('link', {name: 'Download résumé (PDF)'});
  const href = await download.getAttribute('href');
  expect(href).toBe('/garrison-hutcherson-resume.pdf');
  await expect(download).toHaveAttribute('download', '');
  const response = await request.get('/garrison-hutcherson-resume.pdf');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('application/pdf');
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
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
  test(`${route.path} publishes only the site email`, async ({page}) => {
    await page.goto(route.path);

    const mailtoLinks = await page
      .locator('a[href^="mailto:"]')
      .evaluateAll(links => links.map(link => link.getAttribute('href')));

    for (const href of mailtoLinks) {
      expect(href).toBe(`mailto:${PUBLIC_EMAIL}`);
    }
  });

  const phoneLinks = route.path === RESUME_ROUTE ? 1 : 0;
  test(`${route.path} has ${String(phoneLinks)} phone link(s)`, async ({
    page,
  }) => {
    await page.goto(route.path);

    const tel = page.locator('a[href^="tel:"]');

    await expect(tel).toHaveCount(phoneLinks);
    if (phoneLinks > 0) {
      await expect(tel).toHaveAttribute('href', PUBLIC_PHONE_HREF);
    }
  });
}

test('the contact band links to LinkedIn and GitHub', async ({page}) => {
  await page.goto('/');
  const band = page.getByRole('region', {name: "Let's Work Together"});

  await expect(
    band.getByRole('link', {name: 'LinkedIn profile'}),
  ).toHaveAttribute('href', 'https://www.linkedin.com/in/gtayhutch');
  await expect(
    band.getByRole('link', {name: 'GitHub profile'}),
  ).toHaveAttribute('href', 'https://github.com/gtayhutch');
});

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
    await expect(menu.getByRole('link')).toHaveCount(7);
    await expect(
      menu.getByRole('link', {name: 'Case Studies'}),
    ).toHaveAttribute('href', '/case-studies/');
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

for (const path of ['/', '/about/']) {
  test(`${path} shows the headshot with alt text`, async ({page}) => {
    await page.goto(path);

    const portrait = page.getByRole('img', {
      name: 'Portrait of Garrison Hutcherson',
    });

    await expect(portrait).toBeVisible();
    expect(
      await portrait.evaluate(img => (img as HTMLImageElement).naturalWidth),
    ).toBeGreaterThan(0);
  });
}

test('the résumé header shows the city and state', async ({page}) => {
  await page.goto('/resume/');

  await expect(page.getByText('Anderson, SC', {exact: true})).toBeVisible();
});

test('the header logo loads and the home link is named for the site', async ({
  page,
}) => {
  await page.goto('/about/');
  const home = page.getByRole('link', {
    name: 'Garrison Hutcherson',
    exact: true,
  });

  await expect(home).toHaveAttribute('href', '/');
  const logo = home.locator('img');
  await expect(logo).toBeVisible();
  await expect(logo).toHaveAttribute('alt', '');
  expect(
    await logo.evaluate(img => (img as HTMLImageElement).naturalWidth),
  ).toBeGreaterThan(0);
});

test.describe('home hero space scene', () => {
  test('animates drifting stars, twinkles, and shooting stars', async ({
    page,
  }) => {
    await page.emulateMedia({reducedMotion: 'no-preference'});
    await page.goto('/');

    const names = await page.evaluate(() =>
      document.getAnimations().map(a => (a as CSSAnimation).animationName),
    );

    expect(names.filter(n => n === 'drift')).toHaveLength(3);
    expect(names.some(n => n === 'twinkle')).toBe(true);
    expect(names.filter(n => n.startsWith('shoot'))).toHaveLength(3);
  });

  test('is still and shows no shooting stars when reduced motion is preferred', async ({
    page,
  }) => {
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.goto('/');

    await expect(page.locator('.space-scene')).toBeVisible();
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    for (const star of await page.locator('.shooting').all()) {
      await expect(star).toHaveCSS('opacity', '0');
    }
  });
});

test('the About globe turns once and reveals its Greenville marker', async ({
  page,
}) => {
  await page.goto('/about/');
  const globe = page.locator('svg.globe');
  const positions = await globe.evaluate(element => {
    if (!(element instanceof SVGSVGElement)) throw new Error('Missing globe');
    const coast = element.querySelector<SVGPathElement>('.coast.turning');
    if (!coast) throw new Error('Missing coastline');
    element.pauseAnimations();
    return [0, 1.5, 3, 6].map(time => {
      element.setCurrentTime(time);
      const {x, y} = coast.getPointAtLength(40);
      return {x, y};
    });
  });
  const [start, midway, settled, later] = positions;
  expect(start).not.toEqual(midway);
  expect(midway).not.toEqual(settled);
  expect(settled).toEqual(later);
  await expect(globe.locator('.marker')).toHaveCSS('opacity', '1');
  await expect(globe.getByText('Greenville, SC')).toBeVisible();
});

test.describe('About globe with reduced motion and no JavaScript', () => {
  test.use({
    reducedMotion: 'reduce',
    javaScriptEnabled: false,
    viewport: {width: 320, height: 720},
  });

  test('shows the settled map and keeps the marker inside the viewport', async ({
    page,
  }) => {
    await page.goto('/about/');
    const globe = page.locator('svg.globe');
    await expect(globe.locator('.coast.turning')).toBeHidden();
    await expect(globe.locator('.coast.settled')).toBeVisible();
    await expect(globe.locator('.marker')).toHaveCSS('animation-name', 'none');
    await expect(globe.getByText('Greenville, SC')).toBeInViewport({ratio: 1});
  });
});

test('favicons and the web manifest are served', async ({page, request}) => {
  await page.goto('/');
  const hrefs = await page
    .locator('link[rel="icon"], link[rel="apple-touch-icon"]')
    .evaluateAll(links => links.map(link => link.getAttribute('href')));
  const manifest = await request.get('/site.webmanifest');
  const icons = ((await manifest.json()) as {icons: {src: string}[]}).icons;

  expect(manifest.status()).toBe(200);
  for (const href of [...hrefs, ...icons.map(icon => icon.src)]) {
    const response = await request.get(String(href));
    expect(response.status(), String(href)).toBe(200);
    expect(response.headers()['content-type'], String(href)).toMatch(
      /^image\//,
    );
  }
});

test('HTML pages send exactly one UTF-8 Content-Type header', async ({
  request,
}) => {
  for (const path of ['/', '/about/', '/resume/']) {
    const response = await request.get(path);
    const types = response
      .headersArray()
      .filter(header => header.name.toLowerCase() === 'content-type');

    expect(types, path).toHaveLength(1);
    expect(types[0]?.value, path).toBe('text/html; charset=utf-8');
  }
});
