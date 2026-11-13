---
paths:
  - "src/**/*.astro"
  - "src/styles/**"
  - "src/components/**"
  - "src/layouts/**"
---
# UI components

Read `docs/standards/frontend.md`, `docs/standards/code-style/html-css.md`, and the framework rules in `docs/stacks/astro-cloudflare/README.md`.

- Zero JS by default. Add client scripts or islands only when a feature needs them; no `is:inline` (ACF-02).
- Images via `astro:assets` with `alt` and dimensions; the LCP image is eager (ACF-04).
- `set:html` only for build-time Markdown output (ACF-05, SEC-IO-01).
- Use tokens from `src/styles/tokens.css`; self-hosted fonts only (ACF-06).
- Keyboard access, visible focus, semantic landmarks, contrast (FE-06..FE-08).
