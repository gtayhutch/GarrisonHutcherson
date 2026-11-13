/**
 * @fileoverview The site's routes, shared by the page-level e2e specs. Add
 * every new page here so it gets the smoke, accessibility, and no-script
 * checks.
 */

/** A page route and the main heading it must render. */
export interface Route {
  /** Path relative to the site root. */
  path: string;
  /** Text (or pattern) of the page's only `<h1>`. */
  heading: string | RegExp;
}

/** Every page the site serves with HTTP 200. */
export const ROUTES: readonly Route[] = [
  {
    path: '/',
    heading: /Customer-Focused Support &\s*Client Success Professional/,
  },
  {path: '/about/', heading: "Hi, I'm Garrison"},
  {path: '/experience/', heading: '15 years of remote support'},
  {path: '/skills/', heading: 'What I bring to a support team'},
  {path: '/projects/', heading: "Things I've built"},
  {path: '/contact/', heading: "Let's work together"},
  {path: '/resume/', heading: 'Garrison Hutcherson'},
];

/** The only email address the site may publish (ADR 0003). */
export const PUBLIC_EMAIL = 'garrison@garrisonhutcherson.com';
