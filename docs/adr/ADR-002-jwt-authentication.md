# ADR-002: JWT Stored in httpOnly Cookie

**Status:** Accepted  
**Date:** 2025-10-01

## Context

ShopFlow needs a stateless authentication mechanism that works with the React SPA frontend. The token must be protected from JavaScript access to reduce XSS risk, and must survive page reloads without requiring localStorage.

## Decision

We use JSON Web Tokens (JWT) signed with a secret stored in an environment variable. The token is issued at login and stored in an `httpOnly` cookie (`token`) with `secure: true` in production and `sameSite: lax`.

JWT payload contains: `{ id, email, role }`.

Token lifetime is currently hardcoded to **1 day** in `src/utils/jwt.ts`.

## Consequences

- The `httpOnly` flag prevents JavaScript from reading the token, protecting against XSS attacks.
- `sameSite: lax` provides basic CSRF protection for modern browsers.
- No server-side session storage — the token is stateless and self-contained.
- Revocation requires a token blacklist or a short expiry — we currently accept that a compromised token is valid until it expires (1 day).
- No refresh token mechanism is implemented — when the token expires, the user must log in again.

## Alternatives Considered

**localStorage** — Rejected because it is accessible from JavaScript and therefore vulnerable to XSS.

**Session-based auth (express-session)** — Considered but rejected to keep the backend stateless and horizontally scalable.

**Authorization header (Bearer token)** — This pattern requires frontend code to manually attach the header to every request. The cookie approach is simpler and more secure for browser clients.
