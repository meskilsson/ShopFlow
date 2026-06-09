# ADR-001: MongoDB as Primary Database

**Status:** Accepted  
**Date:** 2025-10-01

## Context

ShopFlow needs a database to store users, products, orders, cart items, reviews, and addresses. The data model includes flexible product metadata (variable attributes per category) and will evolve frequently during development. The team has more experience with document databases than relational databases.

## Decision

We use MongoDB Atlas via Mongoose as the primary database.

## Consequences

- Flexible document schemas allow the product model to evolve without migrations.
- No JOIN support — related data is fetched using Mongoose `populate()`, which generates multiple sequential queries.
- Requires disciplined use of `populate` to avoid N+1 query patterns.
- MongoDB Atlas provides managed hosting with automatic backups.
- All data is stored as BSON documents — aggregation pipelines are needed for complex reporting queries.

## Alternatives Considered

**PostgreSQL** — Considered for its relational integrity and JOIN performance. Rejected because the team's experience with SQL was lower and the flexible schema of a document database is better suited to the evolving product model in this project phase.
