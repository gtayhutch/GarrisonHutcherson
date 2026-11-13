/**
 * @fileoverview Site-wide identity, contact links, and navigation (ARCH-07).
 * The only module that holds these values; pages and components import
 * from here instead of hard-coding them. Everything here is public.
 */

/** Identity and canonical URL of the site, used in `<head>` and links. */
export const SITE = {
  /** Display name shown in the header and page titles. */
  name: 'Garrison Hutcherson',
  /** Monogram shown in the header logo. */
  initials: 'GH',
  /** Short professional title for the résumé header. */
  title: 'Technical Support & Client Success Professional',
  /** Canonical production origin; matches `site` in astro.config.mjs. */
  url: 'https://garrisonhutcherson.com',
  /** Default meta description for pages that don't set their own. */
  description:
    'Garrison Hutcherson: technical support and client success professional with 15 years of remote experience.',
} as const;

/**
 * Public contact details. The email is a Cloudflare Email Routing address
 * (ADR 0003); never put personal addresses or phone numbers here.
 */
export const CONTACT = {
  email: 'garrison@garrisonhutcherson.com',
  github: 'https://github.com/gtayhutch',
} as const;

/** A link in the main navigation. */
export interface NavItem {
  /** Visible link text. */
  label: string;
  /** Root-relative path with a trailing slash. */
  href: string;
}

/** Main navigation, in display order. */
export const NAV: readonly NavItem[] = [
  {label: 'About', href: '/about/'},
  {label: 'Experience', href: '/experience/'},
  {label: 'Skills', href: '/skills/'},
  {label: 'Projects', href: '/projects/'},
  {label: 'Contact', href: '/contact/'},
];

/** Path of the printable HTML résumé. */
export const RESUME_PATH = '/resume/';

/**
 * Builds the `<title>` text for a page.
 *
 * @param pageTitle Title of the current page, or undefined for the home page.
 * @returns "Page · Site name", or just the site name for the home page.
 */
export function pageTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} · ${SITE.name}` : SITE.name;
}
