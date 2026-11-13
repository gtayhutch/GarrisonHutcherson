---
id: standards/code-style/html-css
version: 2.0.0
load_when: Writing web markup (HTML, JSX/TSX, or templates), CSS, or utility classes.
---

# HTML and CSS

Source: [Google HTML/CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html).
Utility-CSS rules are *(house)* and apply only when `docs/project/stack.md`
lists a utility-first CSS framework such as Tailwind. Accessibility and
performance rules live in `docs/standards/frontend.md`.

## Rules

### Markup (HTML and JSX)

- **WEB-01 Semantic elements first.** Use the element for its purpose:
  `<button>` for actions, `<a>` for navigation, headings in order, `<main>`,
  `<nav>`, `<label>` for every input. No clickable `<div>`.
- **WEB-02 Lowercase** element and attribute names; double quotes for
  attribute values; UTF-8.
- **WEB-03 Media has alternatives.** Meaningful `alt` text for images; empty
  `alt=""` for decorative ones.
- **WEB-04 No inline styles or inline event-handler attributes** in HTML
  strings; in component frameworks use props and classes.
- **WEB-05 HTTPS for every embedded resource.** No protocol-relative or
  `http:` URLs.
- **WEB-06 No `type` attribute** on `<script>` and `<link rel="stylesheet">`
  unless it is not JavaScript/CSS.

### CSS

- **WEB-07 Meaningful class names,** hyphen-delimited, describing purpose, not
  appearance (`.error-banner`, not `.red-box`).
- **WEB-08 No ID selectors for styling;** avoid qualifying classes with
  element names (`div.card`).
- **WEB-09** Use shorthand properties where they help readability; omit units
  on `0`; lowercase hex colors.
- **WEB-10** Design tokens (color, spacing, type scale, radius) are defined
  once and referenced, never hard-coded in components.
- **WEB-15 Interaction states.** Every interactive element has visible
  focus (`:focus-visible`), hover, and disabled styles, in light and dark
  themes.

### Utility-first CSS, e.g. Tailwind *(house; only if the stack uses one)*

- **WEB-11 Utilities first.** Compose utilities in markup; extract a UI
  component for repetition rather than `@apply` chains.
- **WEB-12 Sorted classes.** A formatter plugin orders classes (for Tailwind,
  `prettier-plugin-tailwindcss`).
- **WEB-13 Tokens in the theme.** Colors, spacing, and fonts come from the
  theme configuration. Arbitrary values (`w-[437px]`) need a comment.
- **WEB-14 Conditional classes** are built with a helper (for example
  `clsx` + `tailwind-merge`), never string concatenation of untrusted input.
