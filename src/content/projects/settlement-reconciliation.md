---
title: Reconciling payments against settlements with SQL
order: 2
summary: A runnable synthetic example that flags missing settlement rows, duplicate rows, and amount mismatches.
tags: [SQL, Payments, Reconciliation]
---

The sample represents one closed settlement batch in a single currency. Amounts
are integer cents. Each payment is expected to have one settlement row.

```sql
WITH payments(id, cents) AS (
  VALUES ('p1', 4200), ('p2', 3600), ('p3', 1500), ('p4', 2900)
), settlements(payment_id, cents) AS (
  VALUES ('p1', 4200), ('p3', 1500), ('p3', 1500), ('p4', 2800)
), totals AS (
  SELECT payment_id, COUNT(*) AS row_count, SUM(cents) AS settled_cents
  FROM settlements
  GROUP BY payment_id
)
SELECT p.id, p.cents AS expected_cents, t.settled_cents,
  CASE
    WHEN t.payment_id IS NULL THEN 'missing'
    WHEN t.row_count > 1 THEN 'duplicate rows'
    ELSE 'amount mismatch'
  END AS finding
FROM payments AS p
LEFT JOIN totals AS t ON t.payment_id = p.id
WHERE t.payment_id IS NULL OR t.row_count > 1 OR t.settled_cents <> p.cents
ORDER BY p.id;
```

Expected findings: `p2` has no settlement, `p3` has duplicate rows, and `p4`
is short by 100 cents. `p1` matches and is omitted. Pre-aggregating settlements
keeps the output to one line per payment. Review the original batch and its
cutoff before escalating, since legitimate splits or adjustments can change
what counts as a mismatch.
