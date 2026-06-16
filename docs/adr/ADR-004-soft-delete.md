# ADR-004: Soft-Delete Strategy

**Status:** Accepted

## Context

GDPR requires the ability to handle deletion requests. At the same time, referential integrity must be maintained — orders reference users and products, and deleting a document would break historical records. Admins also need the ability to restore accidentally deleted records.

## Decision

Users, products, and orders are never hard-deleted from the database. Instead, a `deletedAt` timestamp is set on the document. A `deletedBy` reference and a `deleteReason` string are also stored for audit purposes.

Business logic enforces that:
- Soft-deleted users cannot log in (`requireAuth` checks `deletedAt`).
- Soft-deleted products are excluded from public product listings.
- Admin endpoints can query and restore soft-deleted records.
- The GDPR data export endpoint (`GET /api/v1/users/me/data`) still returns data for soft-deleted users if queried before a hard-delete is performed.

## Consequences

- Historical data (orders, reviews) remains consistent even after a user or product is deleted.
- Admins can restore deleted records without data loss.
- All queries that should exclude deleted records must explicitly filter on `deletedAt: null` — this is enforced in services, not at the model level.
- True GDPR erasure (hard-delete) is not currently implemented. If a user invokes their right to erasure, an admin must perform a manual hard-delete and handle orphaned references to that user ID.

## Alternatives Considered

**Hard-delete with nullification** — Replace all references to the deleted user with a null or a placeholder value. Rejected because it destroys historical order data and is harder to reverse.

**Separate archive collection** — Move deleted documents to an archive collection. Rejected as over-engineering for the project's current scale.
