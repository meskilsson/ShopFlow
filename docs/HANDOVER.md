# ShopFlow Handover Document

**Date:** 2026-06-16
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
- Rate limiting on `/api/v1` and stricter auth routes
- Input validation with Zod across most core routes (auth, users, products, orders, cart, address, reviews) — see `docs/VALIDATION.md`
- Unit + Supertest endpoint coverage for utilities and core validation/auth gates (5 suites, 37 tests, all passing as of this writing)
- Seller dashboard: list own products, upload images
- Frontend (`apps/web`): React/Vite SPA covering home, products, product detail, cart, checkout, order confirmation, account/profile, address management, wishlist, seller dashboard, admin pages
- Vercel deployment config for the frontend (`vercel.json`, SPA rewrite rule)

### Fixed Since Last Handover (2026-06-08)

The following issues were previously listed as open bugs. They have been verified fixed in the current code:

- Product variant and order route collisions — static segments (`/seller/:sellerId`, `/variants/:variantId`, `/user/:userId`) are now registered before dynamic `/:id` segments in `productRoutes.ts` and `orderRoutes.ts`.
- `getOrdersWithItemsByUser` now correctly reads `req.validatedParams.userId` (previously read the wrong param).
- `deleteProduct` and `deleteVariant` now throw `NotFoundError` (404) instead of silently returning 204 when the target doesn't exist.

### Partially Done

- **Zod validation** — most routes are wired up now (see `docs/VALIDATION.md` for the full per-route table). Remaining gaps: admin product/order routes still use manual controller validation (route files literally have `// FIXA VALIDATEREQUEST NÄR SCHEMAT ÄR GJORT!` comments in `adminRoutes.ts`), and payment routes have no Zod schemas at all.
- **Category and Brand management** — models, routes, controllers, and services are implemented but the routes are still **not mounted** in `server.ts`. This has been known for at least a week and hasn't moved.
- **Test infrastructure** — there's an uncommitted change in progress (`apps/backend/jest.config.cjs` + new `apps/backend/tsconfig.test.json`) that points ts-jest at a dedicated test tsconfig. It works locally but isn't committed yet — decide whether to land it.
- **Frontend testing** — there are zero automated tests in `apps/web` despite it being a fairly large SPA (10+ feature folders, 15+ pages). Everything frontend has been verified manually only, as far as I can tell from the repo.

## Known Issues

---

### Correctness Issues

**§1 — `createPayment` doesn't verify the order exists**
`POST /api/v1/payments` calls `Payment.create(req.body)` directly. There's no check that `req.body.order` actually references an existing order, so you can create orphaned payment records.

**Fix:** Look up the order in `paymentService.createPayment` and throw `NotFoundError` if it doesn't exist.

**§2 — JWT expiry still hardcoded**
`src/utils/jwt.ts` hardcodes `expiresIn: "1d"` and ignores the documented `JWT_EXPIRES_IN` env variable. This was flagged in the last handover and is still true.

**Fix:** Read from `process.env.JWT_EXPIRES_IN` with a sensible default.

**§3 — No refresh token mechanism**
Still no automatic re-authentication when the access token expires — also unchanged from last handover.

---

### Low Priority / Cleanup

**§4 — Brand and Category routes not mounted**
Full implementations exist for both (controllers, services, models, schemas) but are not registered in `server.ts`. Decide whether to mount them at `/api/v1/brands` and `/api/v1/categories` or remove the unused code. This has been sitting unmounted for a while now — worth a decision either way rather than leaving it dangling.

**§5 — Leftover debug route**
`userRoutes.ts` still has `GET /api/v1/users/test-wishlist`, a temporary debug endpoint with a comment that literally says "Temp: For debuging". Should be removed before any real deployment.

**§6 — Payment route declaration order**
`paymentRoutes.ts` declares `GET /:id` before `GET /order/:orderId`. In practice these don't collide in Express since they have different path-segment counts, so this isn't an active bug — but `docs/VALIDATION.md` and the previous handover both flagged it as a collision risk, which isn't quite accurate. Worth reordering anyway for clarity/consistency with the other route files, but it's cosmetic, not a correctness fix.

**§7 — `docs/VALIDATION.md` overstates a "duplicate route" issue**
The validation doc claims `GET /api/v1/users` is registered twice in `userRoutes.ts`. Checked the current file — it isn't; there's only one `GET "/"` registration. That line in `VALIDATION.md` should be corrected or removed.

---

## Technical Debt

- Admin product/order list/detail/delete/restore routes still rely on manual controller-side validation rather than Zod schemas (see `docs/VALIDATION.md` for the full list).
- Payment routes have no Zod validation and are explicitly mock/demo-only (no real payment gateway behavior).
- `createPayment` doesn't verify the referenced order exists (§1 above).
- No refresh token mechanism (§3 above).
- No automated frontend tests.
- Backend deployment target is unclear from the repo — recent commits (`cors changes`, `origins added`, `deploy?`) suggest deployment work is in progress, but there's no Render config, Procfile, or similar in the repo, and the third-party services table below (carried over from the last handover) still lists Render as "planned." Whoever picks this up should confirm where the backend is actually meant to run before trusting that table.

---

## Third-Party Services

| Service | Purpose | Account |
|---|---|---|
| MongoDB Atlas | Database (cloud) | Shared team account — contact Olivia Mach |
| Supabase | Image storage | Shared project — contact Pontus Ingenius |
| Vercel | Frontend hosting | `vercel.json` present, SPA rewrites configured |
| Render (status unconfirmed) | Backend hosting (originally planned) | No deployment config found in repo as of this writing — verify before relying on this |

---

## Architecture Decisions

See `docs/adr/` for individual ADR files.

| ADR | Decision |
|---|---|
| [ADR-001](adr/ADR-001-mongodb.md) | MongoDB as primary database |
| [ADR-002](adr/ADR-002-jwt-authentication.md) | JWT in httpOnly cookie for authentication |
| [ADR-003](adr/ADR-003-zod-validation.md) | Zod for input validation |
| [ADR-004](adr/ADR-004-soft-delete.md) | Soft-delete strategy for GDPR compliance |
