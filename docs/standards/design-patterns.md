---
id: standards/design-patterns
version: 2.0.0
load_when: Designing a new module or abstraction, refactoring for flexibility, choosing between approaches, reviewing a design.
---

# Design patterns

Based on the 23 patterns in *Design Patterns: Elements of Reusable
Object-Oriented Software* (Gamma, Helm, Johnson, Vlissides). Summaries here are
our own; read the book for the full treatment.

## Rules

- **PAT-01 Problem first.** Use a pattern only to solve a problem you can name
  today, found in the selection table below. No speculative abstraction.
- **PAT-02 Program to an interface.** Callers depend on a type (interface or
  function type) rather than a concrete implementation, especially at I/O
  boundaries (repositories, external services, clock, random).
- **PAT-03 Composition over inheritance.** Combine small functions and objects.
  Class inheritance MAY be one level deep (abstract base → concrete) and only
  when a pattern calls for it or a framework requires it.
- **PAT-04 Functional form by default.** In languages with first-class
  functions, prefer the functional form of a pattern (functions, closures,
  modules, tagged unions / sealed types). Use classes when the pattern needs
  encapsulated mutable state *and* identity.
- **PAT-05 Name the pattern.** When you apply a pattern, say so in the doc
  comment (`Strategy for …`) and, where natural, in the name
  (`ShippingStrategy`, `createReportBuilder`). Readers should recognize it
  without reverse-engineering.
- **PAT-06 Singleton is restricted.** Only for process-wide resources such as
  the database client, the logger, or config. Implement it as a module-level
  instance, never as mutable global app state, and make it replaceable in tests.
- **PAT-07 Record significant choices.** A pattern that shapes a whole feature
  or crosses features gets one line in `docs/project/codemap.md`, and an ADR if
  alternatives were weighed.
- **PAT-08 No anti-patterns.** See the list at the end. Reviewers reject them.

## Selection guide: problem → pattern

| You need to… | Consider |
| --- | --- |
| Create objects without hard-coding their concrete type | Factory Method, Abstract Factory, Prototype |
| Build a complex object step by step, or several representations | Builder |
| Swap an algorithm or policy at runtime | Strategy |
| Fix an algorithm's skeleton but vary some steps | Template Method (or a function with hook parameters) |
| Wrap a third-party API in the interface your code expects | Adapter |
| Give a subsystem one simple entry point | Facade |
| Add behavior (logging, caching, auth) without changing the target | Decorator, Proxy |
| Control access to, or lazily create, an expensive resource | Proxy |
| Let several handlers take a turn at a request | Chain of Responsibility |
| Treat a request as data (queue, log, retry, undo) | Command |
| Notify many listeners of a change | Observer |
| Coordinate many components without them knowing each other | Mediator |
| Change behavior as an entity moves through statuses | State |
| Treat single items and groups uniformly (trees) | Composite |
| Vary an abstraction and its platform implementation independently | Bridge |
| Snapshot and restore state (undo, drafts) | Memento |
| Walk a collection without exposing its structure | Iterator |
| Add operations over a fixed set of types | Visitor (exhaustive `switch` on a union) |
| Share many fine-grained immutable objects | Flyweight |
| Evaluate a small rule language | Interpreter (prefer an existing library) |

## Catalog with functional forms

### Creational

| Pattern | Intent (our words) | Functional form (TypeScript-style example) | Typical use |
| --- | --- | --- | --- |
| Abstract Factory | Create families of related objects behind one interface | A function returning an object of related factories | Hosted vs. local-test adapters; theme or platform kits |
| Builder | Assemble a complex object in steps, separate from its representation | Fluent builder or a chain of pure `with…` functions | Test fixtures, complex queries, email composition |
| Factory Method | Let a creator decide which concrete type to produce | `createX(options)` function returning an interface | Payment provider clients, notification senders |
| Prototype | Make new objects by copying a configured instance | `structuredClone(template)` then override | Default documents, form templates |
| Singleton | One shared instance with a known access point | Module-level `const` initialized once (PAT-06) | Database client, logger, config |

### Structural

| Pattern | Intent (our words) | Functional form (TypeScript-style example) | Typical use |
| --- | --- | --- | --- |
| Adapter | Make an existing interface fit the one clients expect | A module that wraps the SDK and exports your interface | Payment, email, or AI providers behind a port |
| Bridge | Split an abstraction from its implementation so both can vary | Interface for the implementation, passed to the abstraction | Notification type × delivery channel; KMP `expect`/`actual` |
| Composite | Compose objects into trees and treat leaves and groups alike | Recursive union type with a common render/evaluate function | Navigation menus, nested comments, permission groups |
| Decorator | Wrap an object to add responsibilities dynamically | Higher-order function: `withRetry(withLogging(fn))` | Action wrappers, caching, metrics |
| Facade | One simple interface over a subsystem | A feature's public interface module | Every feature boundary (ARCH-02) |
| Flyweight | Share intrinsic state among many small objects | Frozen, memoized objects | Icon maps, formatters, static lookup tables |
| Proxy | Stand in for an object to control access to it | Wrapper with the same interface (lazy, cached, guarded) | Lazy SDK loading, read-through cache |

### Behavioral

| Pattern | Intent (our words) | Functional form (TypeScript-style example) | Typical use |
| --- | --- | --- | --- |
| Chain of Responsibility | Pass a request along handlers until one handles it | Array of handler functions, each may return or pass on | Request preprocessing, validation chains |
| Command | Represent a request as an object | Serializable `{type, payload}` plus a handler map | Task queues, audit log entries, undo |
| Interpreter | Represent a grammar and evaluate sentences in it | AST union + `evaluate(node)`; prefer a library | Search filters, pricing rules |
| Iterator | Traverse a collection without exposing its internals | Generators / async generators | Paginated database reads |
| Mediator | Centralize how a set of objects interact | A coordinator hook or module that owns the interactions | Multi-step forms, wizards |
| Memento | Capture state to restore it later without breaking encapsulation | Immutable snapshots of state | Undo/redo, unsaved drafts |
| Observer | Notify dependents automatically when something changes | Subscriptions that return an unsubscribe function | Database change feeds, domain events |
| State | Change behavior when internal state changes | Discriminated union + transition table | Order, subscription, or onboarding status |
| Strategy | Make a family of algorithms interchangeable | Pass a function (or an object of functions) | Pricing, sorting, sign-in providers |
| Template Method | Fix an algorithm's skeleton; let parts vary | A function that takes step functions as parameters | Import/export pipelines, report generation |
| Visitor | Add operations to a fixed set of types without changing them | Exhaustive `switch` on a union with a `never` check | Rendering or exporting heterogeneous blocks |

Two non-GoF patterns are standard here and complement the catalog:
**Repository** (data access behind a domain interface, ARCH-06) and
**Dependency Injection** by parameters (pass collaborators in rather than
importing concrete singletons inside business logic).

## Worked example: Strategy, functional form (TypeScript)

The same shape works in any language with first-class functions.

```ts
/** Strategy for computing a shipping cost from an order. */
export type ShippingStrategy = (order: Order) => Money;

/** Flat-rate shipping regardless of order contents. */
export const flatRate: ShippingStrategy = () => money(500);

/** Free shipping above a threshold; otherwise falls back to `fallback`. */
export function freeAbove(
  threshold: Money,
  fallback: ShippingStrategy,
): ShippingStrategy {
  return (order) => (order.subtotal >= threshold ? money(0) : fallback(order));
}
```

## Anti-patterns (PAT-08)

- **God object or "Manager/Helper/Utils" grab-bags** that do unrelated things.
- **Deep inheritance** (more than one level) or inheritance used only for reuse.
- **Service locator / hidden globals** that make dependencies invisible.
- **Interface with one implementation and no seam need.** Exception: I/O
  boundaries, where the seam exists for tests.
- **Pattern for its own sake:** an abstraction that removes no duplication and
  isolates no change.
- **Stringly-typed state machines** (`status === 'done2'`) instead of a union.
- **Anemic wrappers** that only forward calls and add nothing.
