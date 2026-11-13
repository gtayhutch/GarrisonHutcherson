/**
 * @fileoverview Typed, sorted access to the content collections (ARCH-06,
 * ACF-03). Components read content only through these functions, never
 * through `getCollection` directly.
 */
import {getCollection, getEntry, type CollectionEntry} from 'astro:content';

/** One employer with its roles, as defined in src/content/experience/. */
export type Experience = CollectionEntry<'experience'>;
/** One skill group card. */
export type SkillGroup = CollectionEntry<'skills'>;
/** One key-strength card. */
export type Strength = CollectionEntry<'strengths'>;
/** One project. */
export type Project = CollectionEntry<'projects'>;
/** A long-form page (home hero copy, about). */
export type Page = CollectionEntry<'pages'>;

interface Ordered {
  data: {order: number};
}

function byOrder(a: Ordered, b: Ordered): number {
  return a.data.order - b.data.order;
}

/**
 * Returns every employer, most recent first.
 *
 * @param limit Optional maximum number of employers to return.
 */
export async function getExperience(limit?: number): Promise<Experience[]> {
  const entries = (await getCollection('experience')).sort(byOrder);
  return limit === undefined ? entries : entries.slice(0, limit);
}

/**
 * Returns the skill groups in display order.
 *
 * @param limit Optional maximum number of groups to return.
 */
export async function getSkillGroups(limit?: number): Promise<SkillGroup[]> {
  const entries = (await getCollection('skills')).sort(byOrder);
  return limit === undefined ? entries : entries.slice(0, limit);
}

/** Returns the key-strength cards in display order. */
export async function getStrengths(): Promise<Strength[]> {
  return (await getCollection('strengths')).sort(byOrder);
}

/** Returns all projects in display order. */
export async function getProjects(): Promise<Project[]> {
  return (await getCollection('projects')).sort(byOrder);
}

/**
 * Returns a page's copy by its file name (without `.md`).
 *
 * @param id Page id, for example `about`.
 * @throws Error if the page file doesn't exist, which fails the build.
 */
export async function getPage(id: string): Promise<Page> {
  const page = await getEntry('pages', id);
  if (!page)
    throw new Error(`Missing page content: src/content/pages/${id}.md`);
  return page;
}
