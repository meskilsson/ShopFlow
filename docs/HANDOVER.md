# ShopFlow Handover Document

**Date:** 2026-06-08  
**Team:** Malmö 1 (Team Kattarp)  
**Project:** ShopFlow – Boiler Room, Backend Development in Node.js, Databases and Security

---

## Project Status

### Done

- User authentication (register, login, logout) with JWT cookie
- Role-based access control: `buyer`, `seller`, `admin`
- Full CRUD for products with soft-delete and admin restore
- Product variants (size, stock, SKU)
- Product image upload to Supabase
- Guest and user shopping cart with full item management
- Address management (shipping + billing) for both guests and users
- Checkout: cart-to-order conversion (guests and users)
- Order management with status tracking
- Product reviews (create + list)
- Admin panel: soft-delete and restore for users, products, and orders
- GDPR: soft-delete, personal data export endpoint, data minimization
- Structured logging with Pino
- Centralized error handling with custom error classes
- Input validation with Zod (partial — see known issues)
- Unit tests for utilities (JWT, guest cookie, error classes, validation formatting)
- Seller dashboard: list own products, upload images

### Partially Done

- **Zod validation schemas** — infrastructure exists (`middleware/validate.ts`, `schemas/`) but many endpoints are not yet wired up. See `apps/backend/docs/VALIDATION.md` for the full list.
- **Category and Brand management** — models, routes, controllers, and services are implemented but the routes are **not mounted** in `server.ts`.
- **Integration tests** — Jest + Supertest are configured. Only utility unit tests exist; endpoint integration tests are not yet written.

### Not Done / Out of Scope

- Full-text product search
- CI/CD pipeline (GitHub Actions)
- Rate limiting
- Production CORS hardening (currently set via `CORS_ORIGIN` env var)

---

## Known Issues
---

### Correctness Issues

**§2 — Product variant route collision**  
`GET/PATCH/DELETE /api/v1/products/variants/:variantId` and `GET/PATCH/DELETE /api/v1/products/:id` share the same router. If `/:id` is registered before `/variants/:variantId`, Express captures the literal string `"variants"` as `:id`, causing incorrect DB lookups.

**Fix:** Ensure all static segments (`/variants/`) are registered before dynamic segments (`/:id`) in `productRoutes.ts`.

**§3 — Order route collision**  
`GET /api/v1/orders/:id` and `GET /api/v1/orders/user/:userId` have the same issue. A request to `/orders/user/xxx` may match `:id = "user"` and attempt `Order.findById("user")`.

**Fix:** Register `/user/:userId` before `/:id` in `orderRoutes.ts`.

**§4 — Payment route collision**  
Same collision pattern as §3 between `GET /api/v1/payments/:id` and `GET /api/v1/payments/order/:orderId`.

**Fix:** Register `/order/:orderId` before `/:id` in `paymentRoutes.ts`.

**§5 — `getOrdersWithItemsByUser` reads wrong param**  
The handler reportedly reads `req.params.id` instead of `req.params.userId`. Calls to `GET /api/v1/orders/user/:userId/with-items` pass `undefined` as the user ID and silently return wrong results.

**Fix:** Update `orderController.ts → getOrdersWithItemsByUser` to read `req.params.userId`.

**§7 — Silent 204 on delete of non-existent resource**  
`productService.deleteProduct` and `deleteVariant` call `findByIdAndDelete` without checking the return value. Deleting a non-existent ID returns `204 No Content` instead of `404 Not Found`.

**Fix:** Add a null check after `findByIdAndDelete` and throw `NotFoundError` if the result is null.

---

### Low Priority

**§1 — Brand and Category routes not mounted**  
Full implementations exist for both (controllers, services, models, schemas) but are not registered in `server.ts`. Decide whether to mount them at `/api/v1/brands` and `/api/v1/categories` or remove the unused code.

---

## Technical Debt

- Most Zod validation schemas are defined but not applied as middleware on routes. The full list of schemas that need to be wired up is in `apps/backend/docs/VALIDATION.md`.
- Token expiry is hardcoded to `1d` in `src/utils/jwt.ts` and does not read from `JWT_EXPIRES_IN` in the environment. The env variable is documented but ignored.
- The `POST /api/v1/payments` endpoint does not verify that the referenced `order` exists before creating the payment record.
- No refresh token mechanism — when the 1-day token expires, the user must log in again with no automatic re-authentication.

---

## Roadmap (Logical Next Steps)
2. Wire up all remaining Zod validation schemas
3. Mount brand and category routes (or remove dead code)
4. Write integration tests for all endpoint groups
5. Add rate limiting (`express-rate-limit`)
6. Implement email notifications (order confirmation)
7. Replace simulated payment with a real gateway

---

## Third-Party Services

| Service | Purpose | Account |
|---|---|---|
| MongoDB Atlas | Database (cloud) | Shared team account — contact Olivia Mach |
| Supabase | Image storage | Shared project — contact Pontus Ingenius |
| Render (planned) | Hosting | Not yet deployed to production |

---

## Architecture Decisions

See `docs/adr/` for individual ADR files.

| ADR | Decision |
|---|---|
| [ADR-001](adr/ADR-001-mongodb.md) | MongoDB as primary database |
| [ADR-002](adr/ADR-002-jwt-authentication.md) | JWT in httpOnly cookie for authentication |
| [ADR-003](adr/ADR-003-zod-validation.md) | Zod for input validation |
| [ADR-004](adr/ADR-004-soft-delete.md) | Soft-delete strategy for GDPR compliance |
