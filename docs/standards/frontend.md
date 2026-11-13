---
id: standards/frontend
version: 2.0.0
load_when: Building screens, pages, layouts, components, forms, client state, loading and error states; accessibility or performance work; SEO and metadata.
---

# Frontend

Stack-neutral UI standards for web and native clients. Language style rules are
in `code-style/`; framework-specific rules (rendering model, routing files,
built-in components) are in the stack profile.

## Rules

### Structure and data

- **FE-01 Data is fetched and authorized on the server.** Screens get data
  through the server (server rendering or the API), already authorized and
  reduced to what the screen renders. Client code holds no business rules that
  the server doesn't also enforce.
- **FE-02 Direct client-to-database access is deliberate.** Only when the stack
  supports database access policies, the feature needs realtime or offline
  behavior, and the policies cover it (SEC-AZ-08). Record the choice in
  `codemap.md`.
- **FE-03 State lives in the right place.** Shareable state (filters, tabs,
  pagination) in the URL or navigation state; server data in a server-state
  layer (server rendering or a query cache); local UI state in the component. A
  global client store needs an ADR.
- **FE-04 Forms.** One schema for client and server (SEC-IO-15); submit through
  a server-side mutation handler; show field errors from the result's
  `fieldErrors`; prevent double-submit; on the web, work before JavaScript
  loads where the framework supports it.
- **FE-05 Every screen has its states:** loading, empty, error (OBS-14), and
  not found.

### Accessibility (WCAG 2.2 AA; platform equivalents on native)

- **FE-06 Keyboard and assistive tech first.** Every interaction works with a
  keyboard (web) or the platform's screen reader and switch controls (native);
  focus order follows the visual order; focus is visible (WEB-15); dialogs trap
  and restore focus.
- **FE-07 Semantics and names.** Semantic elements or native controls
  (WEB-01); every input has a visible label; icon-only buttons have accessible
  names; ARIA only when no native element fits.
- **FE-08 Perceivable.** Text contrast ≥ 4.5:1 (3:1 for large text and UI
  components); information is never conveyed by color alone; respects reduced
  motion and dynamic text size; pointer targets at least 24×24 CSS pixels
  (native: the platform's minimum touch target).
- **FE-09 Tested.** Automated accessibility checks in end-to-end tests
  (TEST-11) plus a manual keyboard or screen-reader pass for every new flow.

### Performance

- **FE-10 Budgets.** Web: Core Web Vitals at the 75th percentile on mobile —
  LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Native: cold start and frame-rate
  budgets recorded in `docs/project/overview.md`. A PR that regresses a budget
  explains why.
- **FE-11 Ship less code to the client.** Keep client-only code small;
  lazy-load heavy screens and components; check bundle or binary size on PRs
  that add client dependencies (DEP-01).
- **FE-12 Use the framework's optimized primitives** for images, fonts, links,
  and third-party scripts (the profile names them).

### Content and metadata

- **FE-13 Metadata** (titles, descriptions, social cards) comes from the
  framework's metadata mechanism; non-production environments are not indexed
  (ENV-08).
- **FE-14 Strings and formats.** Dates, numbers, and currency are formatted with
  the platform's internationalization APIs using the user's locale and time
  zone. If the product will be localized, user-facing strings live in message
  catalogs from day one.
- **FE-15 Analytics events** are defined in one typed catalog, named
  `object_action` (`invite_sent`), and carry no personal data (SEC-DATA-06).
- **FE-16 Responsive, mobile-first** layouts on the web; adaptive layouts for
  tablets and large screens on native.
