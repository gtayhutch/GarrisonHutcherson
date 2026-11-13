/**
 * @fileoverview Content collection schemas (ACF-03, DB-08). Every content
 * file is validated here at build time; a bad entry fails the build. The
 * collections are documented in docs/project/data-model.md.
 */
import {defineCollection} from 'astro:content';
import {file, glob} from 'astro/loaders';
import {z} from 'astro/zod';

/** Icon names a content entry may reference; see src/components/ui/Icon.astro. */
export const ICON_NAMES = [
  'briefcase',
  'code',
  'credit-card',
  'headphones',
  'layers',
  'lightbulb',
  'message-circle',
  'monitor',
  'trending-up',
  'users',
  'wrench',
] as const;

const iconName = z.enum(ICON_NAMES);
const shortText = z.string().trim().min(1).max(120);
const sentence = z.string().trim().min(1).max(400);
/** A human-readable period such as "Sep 2022 – Aug 2025". */
const period = z.string().trim().min(4).max(40);

const role = z.object({
  title: shortText,
  team: shortText.optional(),
  period: period.optional(),
  highlights: z.array(sentence).max(8).default([]),
});

/** One employer, with the roles held there (newest first). */
const experience = defineCollection({
  loader: glob({pattern: '*.yaml', base: './src/content/experience'}),
  schema: z.object({
    company: shortText,
    location: shortText,
    period,
    /** Sort key: 1 is the most recent employer. */
    order: z.number().int().positive(),
    icon: iconName,
    /** One-line summary used on the home page and résumé. */
    summary: sentence,
    roles: z.array(role).min(1),
  }),
});

/** A group of related skills, shown as a card with tags. */
const skills = defineCollection({
  loader: file('./src/content/skills.yaml'),
  schema: z.object({
    title: shortText,
    order: z.number().int().positive(),
    icon: iconName,
    summary: sentence,
    tags: z.array(shortText).min(1).max(12),
  }),
});

/** The key-strength cards on the home page. */
const strengths = defineCollection({
  loader: file('./src/content/strengths.yaml'),
  schema: z.object({
    title: shortText,
    order: z.number().int().positive(),
    icon: iconName,
    body: sentence,
  }),
});

/** Projects, one Markdown file each. */
const projects = defineCollection({
  loader: glob({pattern: '*.md', base: './src/content/projects'}),
  schema: z.object({
    title: shortText,
    order: z.number().int().positive(),
    summary: sentence,
    url: z.url().optional(),
    repo: z.url().optional(),
    tags: z.array(shortText).max(10).default([]),
  }),
});

/** Long-form page copy (home hero, about). */
const pages = defineCollection({
  loader: glob({pattern: '*.md', base: './src/content/pages'}),
  schema: z.object({
    title: shortText,
    description: sentence,
    eyebrow: z.array(shortText).max(4).optional(),
    headline: shortText.optional(),
    headlineAccent: shortText.optional(),
    intro: sentence.optional(),
  }),
});

/** All collections, registered with Astro. */
export const collections = {experience, skills, strengths, projects, pages};
