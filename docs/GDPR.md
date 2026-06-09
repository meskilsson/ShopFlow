# GDPR Documentation

This document describes how ShopFlow handles personal data. It is intended for developers, project managers, and anyone who needs to understand the data processing that takes place in this system.

---

## Data Register

The following personal data is collected and processed by ShopFlow.

### users collection

| Field | Data | Purpose | Legal Basis | Retention | Access | Protection |
|---|---|---|---|---|---|---|
| `name` | Full name | Display in UI, order records | Contract (service use) | Until account deleted | User + admin | Stored as plaintext; access requires auth |
| `email` | Email address | Login identifier, account communication | Contract | Until account deleted | User + admin | Stored as plaintext; access requires auth |
| `username` | Username | Public display name | Contract | Until account deleted | Public (read), user + admin (write) | Stored as plaintext |
| `passwordHash` | Hashed password | Authentication | Contract | Until account deleted | Not returned by API (select: false) | Hashed with bcrypt, never returned in responses |
| `role` | User role | Authorization | Legitimate interest | Until account deleted | User + admin | Stored as plaintext |
| `storeName` | Store name | Seller identification | Contract | Until account deleted | Public (read), user + admin (write) | Stored as plaintext |
| `deletedAt` | Deletion timestamp | GDPR soft-delete record | Legal obligation | Indefinite (audit log) | Admin only | — |
| `deletedBy` | Admin user ID | Audit trail | Legal obligation | Indefinite | Admin only | — |
| `deleteReason` | Deletion reason | Audit trail | Legal obligation | Indefinite | Admin only | — |

### orders collection

| Field | Data | Purpose | Legal Basis | Retention | Access | Protection |
|---|---|---|---|---|---|---|
| `user` | Reference to user | Link order to account | Contract | Life of order record | User (own) + admin | Requires auth |
| `sessionId` | Guest session ID (UUID) | Link guest order to cart session | Legitimate interest | Life of order record | — (no PII lookup) | Not linked to identity |
| `totalPrice` | Order total | Financial record | Contract + legal obligation | Indefinite | User (own) + admin | Requires auth |

> **Note:** Guest orders are linked to a session ID (UUID) only, not to any identified individual. No personal identity is collected for guest checkouts.

### addresses collection

| Field | Data | Purpose | Legal Basis | Retention | Access | Protection |
|---|---|---|---|---|---|---|
| `fullName` | Full name | Shipping/billing address | Contract | Until deleted by user | User (own session) + admin | Session cookie required |
| `street` | Street address | Delivery | Contract | Until deleted by user | User (own session) + admin | Session cookie required |
| `city` | City | Delivery | Contract | Until deleted by user | Same | — |
| `postalCode` | Postal code | Delivery | Contract | Until deleted by user | Same | — |
| `country` | Country | Delivery | Contract | Until deleted by user | Same | — |

### reviews collection

| Field | Data | Purpose | Legal Basis | Retention | Access | Protection |
|---|---|---|---|---|---|---|
| `user` | Reference to user | Attribution of review | Contract | Life of review | Public (read), admin (delete) | — |
| `comment` | Review text | Product feedback | Contract | Life of review | Public | Free text — users must not include PII |
| `rating` | Numeric rating | Product feedback | Contract | Life of review | Public | — |

---

## Data Minimization

ShopFlow collects only what is needed for the platform to function.

- No phone number or date of birth is collected during registration.
- Guest checkout requires no personal identification beyond a shipping address.
- `passwordHash` is excluded from all API responses (`select: false` in Mongoose schema).
- The `wishlist` array stores only product IDs — no behavioral metadata.

Decisions not to add fields must be as intentional as decisions to add them. If a proposed feature requires a new personal data field, that field must be justified against the five criteria in the data register above before it is added.

---

## User Rights Implementation

### Right of Access (Art. 15 GDPR)

`GET /api/v1/users/me/data` returns all personal data stored for the authenticated user.

### Right to Erasure (Art. 17 GDPR)

`DELETE /api/v1/users/me` soft-deletes the user account. The `deletedAt` timestamp is set, the auth cookie is cleared, and the user cannot log in again.

**Note:** Soft-delete retains the record for referential integrity (e.g. existing orders reference the user ID). A full hard-delete is not currently implemented. If a user demands complete erasure, an admin must manually remove the document and handle orphaned references.

### Right to Rectification (Art. 16 GDPR)

`PATCH /api/v1/users/:id` allows users to update their name, email, and username.

---

## Logging Policy

Logs are produced by [Pino](https://getpino.io/) and written to stdout as structured JSON.

### What Is Logged

For every HTTP request:

- HTTP method and path (e.g. `GET /api/v1/products`)
- Response status code
- Response time in milliseconds
- User ID (from JWT token, if authenticated) — **not** email or name

For application errors:

- Error message and stack trace (development only)
- Request context (method, path, status code)

### What Is Never Logged

- Passwords (neither plaintext nor hash)
- Email addresses or usernames
- Full name or address fields
- The content of request bodies
- Authorization headers or cookie values
- Any field from the `addresses` collection

This policy is enforced by convention, not by automated tooling. All developers must follow it when adding new log statements.

### Log Retention

Logs are written to stdout and managed by the hosting platform (Render). Log retention and rotation is configured at the platform level, outside this codebase.

---

## Third-Party Data Processors

| Service | Data Shared | Purpose | Privacy Policy |
|---|---|---|---|
| MongoDB Atlas | All database records | Data storage | See MongoDB Atlas DPA |
| Supabase | Product image files (no PII) | Image storage | See Supabase privacy policy |
| Render | Application logs (see logging policy above) | Hosting | See Render privacy policy |

Product images uploaded to Supabase contain no personal data and are publicly readable by design.
