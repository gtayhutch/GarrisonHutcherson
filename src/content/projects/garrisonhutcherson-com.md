---
title: GarrisonHutcherson.com
order: 4
summary: This site. A fast, accessible static site built with Astro and TypeScript and served from Cloudflare's edge, with automated checks on every change.
url: https://garrisonhutcherson.com
repo: https://github.com/gtayhutch/GarrisonHutcherson
tags: [Astro, TypeScript, CSS, Cloudflare Workers, Playwright, GitHub Actions]
---

I built this site to show my experience in one place and to sharpen the
technical side of my support work. Its only client-side JavaScript is the
cookieless Cloudflare Web Analytics beacon. Every public page is checked for
accessibility, and every change runs through formatting, linting, type checks,
browser tests, and a production-dependency security audit before it can merge.

**Architecture and release decisions.** Astro renders versioned Markdown and YAML into HTML at build time. Cloudflare
serves the static files, so there is no app server or database to maintain.
The mobile menu uses a native disclosure, and the hero honors reduced motion.
Cloudflare Access gates the staging site, and CI checks the site before each
promotion. Published releases include a software bill of materials.

**Troubleshooting example.** The workflow was uploading reports from the wrong
directory. An intentional local test failure confirmed that Playwright saved
its trace under `test-results/`. The workflow now collects that directory on
failure, and the temporary test was removed.

**Measured asset change.** The uploaded logo was 1.09 MB. The resized,
transparent master is 58 KB, and Astro emits smaller variants for the header.
