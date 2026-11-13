---
id: stacks/nextjs-firebase/testing
version: 2.0.0
load_when: Writing or running tests in a Next.js + Firebase project, especially Security Rules tests and emulator setup.
---

# Testing on Next.js + Firebase

Implements `docs/standards/testing.md`.

| TEST-02 layer | Tool | Runs against |
| --- | --- | --- |
| Unit | Vitest | Nothing external |
| Integration | Vitest | Firebase emulators (`demo-` project) |
| Access policies | `@firebase/rules-unit-testing` + Vitest | Firestore and Storage emulators |
| End-to-end | Playwright + axe | Built app + emulators |
| HTTP mocking | MSW | — |

## Rules

- **NXF-41 One emulator project ID.** Tests, the app, and the emulators all use
  the same `demo-` project ID, so the Emulator Suite UI and every emulator see
  the same data.
- **NXF-42 Clean state.** Call `clearFirestore()` (and clear Storage) between
  tests (TEST-06).
- **NXF-43 Rules tests cover every `match` block** with allowed and denied cases
  per actor (TEST-04), including a forbidden-field write for each
  `hasOnly()` restriction.
- **NXF-44 `npm run test:rules`** is the CI-01 `test-policies` task and runs
  inside `firebase emulators:exec`.

## Example: rules test

```ts
describe('workspaces/{workspaceId}/projects', () => {
  it('lets a member rename a project', async () => {
    const db = env.authenticatedContext('member-1').firestore();
    await assertSucceeds(updateDoc(projectRef(db), {name: 'Renamed'}));
  });

  it('rejects a member changing createdBy', async () => {
    const db = env.authenticatedContext('member-1').firestore();
    await assertFails(updateDoc(projectRef(db), {createdBy: 'member-1'}));
  });

  it('rejects a user from another workspace', async () => {
    const db = env.authenticatedContext('outsider').firestore();
    await assertFails(getDoc(projectRef(db)));
  });
});
```
