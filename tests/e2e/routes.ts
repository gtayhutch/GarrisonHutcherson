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
    heading: /Support Engineer\s*APIs, Payments & Escalations/,
  },
  {path: '/about/', heading: "Hi, I'm Garrison"},
  {path: '/experience/', heading: '10+ years of remote support'},
  {path: '/skills/', heading: 'What I bring to a support team'},
  {path: '/case-studies/', heading: 'Support case studies'},
  {path: '/projects/', heading: "Things I've built"},
  {path: '/contact/', heading: "Let's work together"},
  {path: '/resume/', heading: 'Garrison Hutcherson'},
];

/** The only email address the site may publish (ADR 0003). */
export const PUBLIC_EMAIL = 'garrison@garrisonhutcherson.com';

/** The only page allowed to show a phone number (the owner's choice). */
export const RESUME_ROUTE = '/resume/';

/** The `tel:` link the résumé page must use. */
export const PUBLIC_PHONE_HREF = 'tel:+18647499707';

/** Cloudflare Web Analytics beacon the layout must load, and its site token. */
export const ANALYTICS_BEACON_SRC =
  'https://static.cloudflareinsights.com/beacon.min.js';
export const ANALYTICS_TOKEN = '0e9074a91c6f4a0ba8e67ad4bd5af89a';
