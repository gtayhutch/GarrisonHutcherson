/**
 * @fileoverview The site's routes, shared by the page-level e2e specs. Add
 * every new page here so it gets the smoke, accessibility, and no-script
 * checks.
 */

/** A page route and the main heading it must render. */
export interface Route {
  /** Path relative to the site root. */
  path: string;
  /** Exact text of the page's `<h1>`. */
  heading: string;
}

/** Every page the site serves with HTTP 200. */
export const ROUTES: readonly Route[] = [
  {path: '/', heading: 'Garrison Hutcherson'},
];
