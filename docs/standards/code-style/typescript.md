---
id: standards/code-style/typescript
version: 2.0.0
load_when: Editing .ts, .tsx, .js, .mjs files, in any framework. Framework-specific rules live in the stack profile.
---

# TypeScript, JavaScript, React

Source: [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html).
Rules marked *(house)* are our project-level decisions on top of Google's.

## Rules

### Compiler and modules

- **TS-01 Strict compiler.** `strict: true`, plus `noUncheckedIndexedAccess`,
  `noImplicitOverride`, `noFallthroughCasesInSwitch`, `useUnknownInCatchVariables`.
  All code must type-check with the standard toolchain. *(house: flags beyond `strict`)*
- **TS-02 ES modules only.** No `namespace`, no `require`, no
  `/// <reference>`. To namespace code, use separate files.
- **TS-03 Named exports only.** No `export default` — **except** where a
  framework or tool requires one (for example route or page files in
  file-based routers, and tool config files). The stack profile lists the
  exact files. *(house exception)*
- **TS-04 Type-only imports** use `import type {…}`.
- **TS-05 Import paths.** Relative imports (`./x`, `../x`) inside a feature;
  the project's root path alias (configured in `tsconfig.json`) for anything
  outside the current feature. No more than two `../` steps. *(house)*

### Naming

- **TS-06 Casing.**

  | Style | Use for |
  | --- | --- |
  | `UpperCamelCase` | classes, interfaces, types, enums, decorators, type parameters, React components |
  | `lowerCamelCase` | variables, parameters, functions, methods, properties, module aliases |
  | `CONSTANT_CASE` | module-level constants and enum values (values not meant to change) |

- **TS-07 No decoration of names.** No `I` prefix on interfaces, no `_`
  prefix/suffix (except a deliberately unused parameter like `_event`), no
  `#private` fields (use the `private` modifier). Acronyms are words:
  `customerId`, `HttpClient`, not `customerID`.
- **TS-08 File names.** `snake_case.ts` / `snake_case.tsx`. Framework-reserved
  file and folder names (routes, special files, config) follow the framework,
  as listed in the stack profile. Tests: `<name>.test.ts` next to the code.

### Types

- **TS-09 No `any`.** Use a specific type, or `unknown` plus narrowing. A
  justified `any` needs a one-line suppression with a reason (STY-09).
- **TS-10 Interfaces for object shapes;** `type` aliases for unions,
  intersections, tuples, and mapped types.
- **TS-11 Arrays.** `T[]` / `readonly T[]` for simple element types;
  `Array<…>` for complex ones.
- **TS-12 Null at the use site.** Type aliases must not include `| null` or
  `| undefined`; add them where the value is actually optional, and handle
  absence close to where it arises.
- **TS-13 Validate, don't assert.** Avoid `as` and the non-null `!`. At trust
  boundaries, parse with a runtime schema (for example zod) instead of
  casting. When an assertion is unavoidable, comment why it is safe.
- **TS-14 No error suppression.** No `@ts-ignore`, `@ts-expect-error`, or
  `@ts-nocheck` in production code. Tests may use `@ts-expect-error` with a
  comment.
- **TS-15 Enums.** Prefer string-literal unions or `as const` objects. If an
  `enum` is used, never a `const enum`. *(house preference)*
- **TS-16 Explicit return types on exported functions.** *(house; Google lets
  projects require this)*

### Language features

- **TS-17 Declarations.** `const` by default, `let` when reassigned, never
  `var`. One variable per declaration.
- **TS-18 Equality.** `===` and `!==` only. Exception: `== null` to test for
  both `null` and `undefined`.
- **TS-19 Functions.** Function declarations for named functions; arrow
  functions for callbacks and nested functions; no function expressions.
- **TS-20 Errors.** Throw only `Error` (or subclasses), always with `new`.
  Keep `try` blocks small. Never swallow an error (see `observability.md`).
- **TS-21 Iteration.** `for…of` for arrays and iterables; `Object.entries()`
  for objects. No `for…in` on arrays.
- **TS-22 Forbidden.** `eval`, `new Function()`, `with`, `debugger` in
  committed code, wrapper objects (`new String()`), modifying built-in
  prototypes, relying on automatic semicolon insertion.
- **TS-23 Visibility.** Keep symbols as private as possible. Never write the
  `public` modifier (it is the default) except on non-readonly constructor
  parameter properties.

### React *(house; applies when the stack uses React)*

- **TS-24 Components** are function declarations named in `UpperCamelCase`,
  with a `<Component>Props` interface. Hooks start with `use`.
- **TS-25** *Retired in 2.0.0 — moved to the Next.js profile as NXF-02.*
- **TS-26** *Retired in 2.0.0 — moved to the Next.js profile as NXF-03.*
- **TS-27** *Retired in 2.0.0 — moved to the Next.js profile as NXF-04.*

### Comments

- **TS-28 JSDoc for docs, `//` for implementation notes.** `/** … */` on every
  export (DOC-01). Never put types in JSDoc tags (DOC-04).

## Example

```ts
import type {Clock} from '../../shared/clock';

import type {Trial} from './domain';

/** Length of a free trial, in days. */
export const TRIAL_LENGTH_DAYS = 14;

/** Milliseconds in one day. */
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Returns how many whole days remain in `trial`, never less than zero.
 *
 * Pure: the current time comes from `clock` (ARCH-05).
 */
export function trialDaysLeft(trial: Trial, clock: Clock): number {
  const endsAtMs = trial.startedAt.getTime() + TRIAL_LENGTH_DAYS * MS_PER_DAY;
  return Math.max(0, Math.ceil((endsAtMs - clock.now().getTime()) / MS_PER_DAY));
}
```

## Tooling

- Formatter: Prettier with Google's `gts` settings.
- Linter: ESLint flat config with `typescript-eslint` (`strict-type-checked`),
  the framework's ESLint plugin if it has one, and rules that encode TS-03,
  TS-07, TS-09, TS-14, TS-18, and ARCH-01..08 boundaries.
- Type check: `tsc --noEmit` in CI.
