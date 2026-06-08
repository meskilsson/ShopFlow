# ADR-003: Zod for Input Validation

**Status:** Accepted  
**Date:** 2025-10-15

## Context

All incoming API data must be validated before reaching service or database layers. The validation library must integrate well with TypeScript so that validated data is automatically typed, and must produce structured errors that can be returned to clients.

## Decision

We use Zod 4 for all input validation. Schemas are defined in `src/schemas/` and applied via the `validate` middleware (`src/middleware/validate.ts`).

The `validate` middleware wraps a Zod schema, calls `schema.safeParse(req.body)`, and either attaches the parsed data to `req.body` (replacing the raw input) or throws a `ValidationError` with the formatted error list.

## Consequences

- TypeScript types are inferred directly from Zod schemas — no duplication between validation rules and type definitions.
- Validation errors are structured as `[{ field, message }]` and returned as `400 Bad Request`.
- Zod is used on both the backend (`src/schemas/`) and frontend (`src/` in the web app) — consistent validation logic.
- As of 2026-05-11, many schemas are defined but not yet applied as middleware on routes. This is tracked as technical debt in `docs/HANDOVER.md`.

## Alternatives Considered

**Joi** — More established but lacks native TypeScript type inference.

**express-validator** — Chains validation inline with route definitions, making routes harder to read. Rejected in favour of centralized schema files.

**Manual validation** — Rejected due to inconsistency and maintenance burden.
