/**
 * @fileoverview Site-wide identity, contact links, and navigation (ARCH-07).
 * The only module that holds these values; pages and components import
 * from here instead of hard-coding them. Everything here is public.
 */

/** Identity and canonical URL of the site, used in `<head>` and links. */
export const SITE = {
  /** Display name shown in the header and page titles. */
  name: 'Garrison Hutcherson',
  /** Concise professional role for the homepage title and profile metadata. */
  role: 'Support Engineer',
  /** Professional title for the résumé header. */
  title:
    'Remote Support Engineer · 10+ Years Technical & Software Support (SaaS, Payments)',
  /** Canonical production origin; matches `site` in astro.config.mjs. */
  url: 'https://garrisonhutcherson.com',
  /** Default meta description for pages that don't set their own. */
  description:
    'Garrison Hutcherson: remote support engineer with 10+ years of technical and software support in SaaS and payments.',
} as const;

/**
 * Public contact details. The email is a Cloudflare Email Routing address
 * (ADR 0003). The phone number is published on the résumé page only, by the
 * owner's choice; never add a street address or a personal email.
 */
export const CONTACT = {
  /** Public booking page for a 30-minute meeting. */
  booking: 'https://cal.com/garrisonhutcherson/30min',
  email: 'garrison@garrisonhutcherson.com',
  github: 'https://github.com/gtayhutch',
  linkedin: 'https://www.linkedin.com/in/gtayhutch',
  /** City and state only, shown on the résumé page. */
  location: 'Anderson, SC',
  /** Résumé page only. `href` is the E.164 `tel:` link. */
  phone: {display: '864-749-9707', href: 'tel:+18647499707'},
} as const;

/**
 * Cloudflare Web Analytics beacon (cookieless). The token is public by
 * design: it only identifies the site to the analytics service. Both
 * origins are allowed by the CSP in public/_headers.
 */
export const WEB_ANALYTICS = {
  scriptSrc: 'https://static.cloudflareinsights.com/beacon.min.js',
  token: '0e9074a91c6f4a0ba8e67ad4bd5af89a',
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
  {label: 'Support Cases', href: '/case-studies/'},
  {label: 'Projects', href: '/projects/'},
  {label: 'Contact', href: '/contact/'},
];

/** Path of the printable HTML résumé. */
export const RESUME_PATH = '/resume/';

/**
 * Builds the `<title>` text for a page.
 *
 * @param pageTitle Title of the current page, or undefined for the home page.
 * @returns The page and site names, or the site name and role for the homepage.
 */
export function pageTitle(pageTitle?: string): string {
  return pageTitle
    ? `${pageTitle} · ${SITE.name}`
    : `${SITE.name} · ${SITE.role}`;
}
