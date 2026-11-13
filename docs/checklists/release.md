---
id: checklists/release
version: 2.0.0
load_when: Preparing a promotion PR (test → staging or staging → production), deploying, or rolling back.
---

# Release checklist

Copy the relevant section into the promotion PR description and check it off.

## Promote `test` → `staging`

- [ ] `verify` is green on `test`.
- [ ] Promotion PR titled `release: test → staging (YYYY-MM-DD)` lists the
      included changes (GIT-06).
- [ ] Backend changes identified: access policies, indexes, functions or
      workers, migrations, new secrets, new env vars.
- [ ] New secrets created in the **staging** environment's secrets manager and
      access granted only to the workloads that need them.
- [ ] Merge with a merge commit (not squash) (GIT-05).
- [ ] Backend deploy succeeded; app deploy succeeded (CI-03).
- [ ] Staging smoke tests passed (CI-08).
- [ ] Migrations run on staging with `--dry-run` first, then for real (DB-09).
- [ ] Manual check of the changed flows on staging, including on mobile width.

## Promote `staging` → `production`

- [ ] Changes have run on staging without new errors (check error tracking).
- [ ] `security-review.md` completed for security-relevant changes in this
      release.
- [ ] No dependency past its remediation deadline (DEP-05).
- [ ] New secrets created in the **production** environment and access granted.
- [ ] Production config overlay reviewed (the profile names the file).
- [ ] Backward compatibility confirmed: the old app works with the new policies,
      indexes, and workers during the deploy (CI-04).
- [ ] Rollback plan written in the PR: the previous release identifier and
      the previous `production` commit (CI-09).
- [ ] Promotion PR titled `release: staging → production (vX.Y.Z)`; merged with
      a merge commit; deployment-environment approval given.
- [ ] Deploy succeeded; production smoke test passed.
- [ ] Release tagged `vX.Y.Z`; release notes and SBOM attached (GIT-08, DEP-07).
- [ ] Watch error rate, latency, and budget alerts for the next hour.

## Hotfix

- [ ] Branch `hotfix/<slug>` from `production`.
- [ ] Fix with a regression test; `verify` green.
- [ ] PR into `production` with approval; deploy; smoke test.
- [ ] Back-merge `production → staging → test` the same day (GIT-07).
- [ ] Incident note written (OBS-13).

## Rollback

1. Return the app to the previous release with the platform's rollback (steps
   in the stack profile).
2. Re-run the backend deploy on the previous `production` commit if policies,
   indexes, or workers changed.
3. Open a revert PR on `production` so the branch matches what is live.
4. Write an incident note (OBS-13).
