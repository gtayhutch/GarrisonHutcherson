/**
 * @fileoverview Site-wide metadata (ARCH-07). The only module that holds
 * site identity values; pages and layouts import from here instead of
 * hard-coding them.
 */

/** Identity and canonical URL of the site, used in `<head>` and links. */
export const SITE = {
  /** Display name shown in the header and page titles. */
  name: 'Garrison Hutcherson',
  /** Canonical production origin; matches `site` in astro.config.mjs. */
  url: 'https://garrisonhutcherson.com',
  /** Default meta description for pages that don't set their own. */
  description:
    'Garrison Hutcherson: customer support and client success professional.',
} as const;

/**
 * Builds the `<title>` text for a page.
 *
 * @param pageTitle Title of the current page, or undefined for the home page.
 * @returns "Page · Site name", or just the site name for the home page.
 */
export function pageTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} · ${SITE.name}` : SITE.name;
}
