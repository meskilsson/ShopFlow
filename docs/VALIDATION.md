# Validation Status

> Current scan of `apps/backend/src/` — 2026-06-09.  
> This document tracks which request validation schemas exist and where they are wired into routes.

Legend: 🟢 Done · 🟡 Partial / intentional exception · 🔴 Missing

---

## Summary

Most core API validation is now wired through `validateRequest(...)`.

The main remaining gaps are:

- Admin product/order routes still use manual controller validation instead of Zod middleware.
- Payment routes are intentionally mock/demo-only and do not currently use Zod validation schemas.
- Brand and category routes exist in code, but they are not mounted in `server.ts`.
- `GET /api/v1/users` is registered twice in `userRoutes.ts`; the first admin-only route handles the path.

---

## Schema Inventory

| Area | Schema file | Status | Notes |
|---|---|---|---|
| Common | `common.schemas.ts` | 🟢 | Shared `objectIdField` exists. |
| Auth / Users | `userSchemas.ts` | 🟢 | Login, create/update user, password, user ID params, wishlist body. |
| Products | `productSchemas.ts` | 🟢 | Product params/query/body and variant params/body. |
| Orders | `orderSchemas.ts` | 🟢 | Order ID/user ID params, create order, update status/payment status. |
| Cart | `cartSchemas.ts` | 🟡 | Cart item body/params exist. `quantity` is an integer with max 50, but is not positive-only. |
| Address | `adressValidation.ts` | 🟢 | Create/update address body and address ID params. |
| Reviews | `reviewSchemas.ts` | 🟢 | Product ID params and create review body. |
| Admin | `admin.schemas.ts` | 🟡 | User soft-delete body exists. Product/order admin params/bodies are not yet Zod schemas. |
| Payments | — | 🟡 | No Zod schemas. Payment routes are mock/admin demo only. |
| Brands | — | 🔴 | Routes exist but are not mounted; no Zod schemas. |
| Categories | — | 🔴 | Routes exist but are not mounted; no Zod schemas. |

---

## Route Validation Status

### Auth

| Method | Path | Validation | Auth / Rate limit | Status | Notes |
|---|---|---|---|---|---|
| POST | `/api/v1/auth/login` | `loginSchema` body | `authLimiter` | 🟢 | Bad credentials are handled as `401`, not validation. |
| POST | `/api/v1/auth/logout` | — | — | 🟢 | No request data to validate. |
| GET | `/api/v1/auth/profile` | — | `requireAuth`, roles | 🟢 | Reads user from token. |
| GET | `/api/v1/auth/me` | — | `requireAuth` | 🟢 | No request data to validate. |

### Users

| Method | Path | Validation | Auth / Owner | Status | Notes |
|---|---|---|---|---|---|
| POST | `/api/v1/users` | `createUserSchema` body | `authLimiter` | 🟢 | Public registration route. |
| GET | `/api/v1/users` | — | `requireAuth`, `admin` | 🟢 | Duplicate route exists later in file; first admin-only registration handles this path. |
| GET | `/api/v1/users/wishlist` | — | `requireAuth` | 🟢 | No request data to validate. |
| POST | `/api/v1/users/wishlist` | `toggleWishlistSchema` body | `requireAuth` | 🟢 | Validates product ID. |
| GET | `/api/v1/users/me/data` | — | `requireAuth` | 🟢 | GDPR export, no request data. |
| DELETE | `/api/v1/users/me` | — | `requireAuth` | 🟢 | Own-account deletion, no request data. |
| GET | `/api/v1/users/:id` | `userIdParamsSchema` params | self or admin | 🟢 | Uses `requireSelfOrRole("id", "admin")`. |
| PATCH | `/api/v1/users/:id` | `userIdParamsSchema` params, `updateUserSchema` body | self or admin | 🟢 | Body requires at least one update field. |
| PATCH | `/api/v1/users/:id/password` | `userIdParamsSchema` params, `changePasswordSchema` body | self or admin | 🟢 | Current password check is service logic. |
| DELETE | `/api/v1/users/:id` | `userIdParamsSchema` params | self or admin | 🟢 | Soft-delete route. |

### Products

| Method | Path | Validation | Auth / Owner | Status | Notes |
|---|---|---|---|---|---|
| GET | `/api/v1/products` | `productQuerySchema` query | public | 🟢 | Supports category/search/inStock/sort/order/page/limit. |
| GET | `/api/v1/products/seller/:sellerId` | `sellerIdParamsSchema` params | public | 🟢 | Registered before `/:id`. |
| GET | `/api/v1/products/mine` | — | seller/admin | 🟢 | No request data to validate. |
| POST | `/api/v1/products/upload-image` | multer file field | seller/admin | 🟡 | File validation is handled by upload middleware/service, not Zod. |
| GET | `/api/v1/products/:id` | `productIdParamsSchema` params | public | 🟢 | 404 handled in service. |
| POST | `/api/v1/products` | `createProductSchema` body | seller/admin | 🟢 | Protected mutation route. |
| PATCH | `/api/v1/products/:id` | `productIdParamsSchema` params, `updateProductSchema` body | owner/admin | 🟢 | Body requires at least one field. |
| DELETE | `/api/v1/products/:id` | `productIdParamsSchema` params | owner/admin | 🟢 | Missing product now throws 404. |
| GET | `/api/v1/products/:id/variants` | `productIdParamsSchema` params | public | 🟢 | Parent product 404 handled in service. |
| GET | `/api/v1/products/variants/:variantId` | `variantIdParamsSchema` params | public | 🟡 | Validation exists, but route is declared after `/:id`, so route collision risk remains. |
| POST | `/api/v1/products/:id/variants` | `productIdParamsSchema` params, `createProductVariantSchema` body | owner/admin | 🟢 | Protected route. |
| PATCH | `/api/v1/products/variants/:variantId` | `variantIdParamsSchema` params, `updateProductVariantSchema` body | admin | 🟢 | Body requires at least one field. |
| DELETE | `/api/v1/products/variants/:variantId` | `variantIdParamsSchema` params | seller/admin | 🟡 | Validation exists, but route collision risk remains. |

### Orders

| Method | Path | Validation | Auth / Owner | Status | Notes |
|---|---|---|---|---|---|
| POST | `/api/v1/orders/from-cart` | — | `resolveCartOwner` | 🟢 | Cart ownership is resolved from user token or guest cookie. Empty cart is service validation. |
| POST | `/api/v1/orders` | `createOrderSchema` body | admin | 🟢 | Protected mutation route. |
| GET | `/api/v1/orders` | — | admin | 🟢 | No request data to validate. |
| GET | `/api/v1/orders/user/:userId` | `userIdParamSchema` params | self/admin | 🟢 | Registered before `/:id`. |
| GET | `/api/v1/orders/user/:userId/with-items` | `userIdParamSchema` params | self/admin | 🟢 | Controller reads `params.userId`. |
| GET | `/api/v1/orders/:id` | `orderIdParamSchema` params | owner/admin | 🟢 | Registered after `/user/:userId`. |
| PATCH | `/api/v1/orders/:id` | `orderIdParamSchema` params, `updateOrderStatusSchema` body | admin | 🟢 | Body requires `status` or `paymentStatus`. |

### Cart

| Method | Path | Validation | Owner | Status | Notes |
|---|---|---|---|---|---|
| POST | `/api/v1/cart` | — | `resolveCartOwner` | 🟢 | No request body. Duplicate cart is service conflict logic. |
| GET | `/api/v1/cart` | — | `resolveCartOwner` | 🟢 | No request data. |
| DELETE | `/api/v1/cart` | — | `resolveCartOwner` | 🟢 | No request data. |
| POST | `/api/v1/cart/items` | `addCartItemSchema` body | `resolveCartOwner` | 🟡 | Validates product variant ID and integer quantity; quantity is not positive-only. |
| PATCH | `/api/v1/cart/items/:productVariantId` | `productVariantIdParamSchema` params, `updateCartItemQuantitySchema` body | `resolveCartOwner` | 🟢 | Quantity can be zero or below so controller/service can remove item. |
| DELETE | `/api/v1/cart/items/:productVariantId` | `productVariantIdParamSchema` params | `resolveCartOwner` | 🟢 | Validates variant ID param. |

### Address

| Method | Path | Validation | Owner | Status | Notes |
|---|---|---|---|---|---|
| GET | `/api/v1/address` | — | `resolveAddressOwner` | 🟢 | No request data. |
| POST | `/api/v1/address` | `addressDataSchema` body | `resolveAddressOwner` | 🟢 | Validates shipping/billing body. |
| PUT | `/api/v1/address/:id` | `idParamSchema` params, `updateAddressDataSchema` body | `resolveAddressOwner` | 🟢 | Body requires at least one field. |
| DELETE | `/api/v1/address/:id` | `idParamSchema` params | `resolveAddressOwner` | 🟢 | Validates address ID param. |

### Reviews

| Method | Path | Validation | Auth | Status | Notes |
|---|---|---|---|---|---|
| GET | `/api/v1/products/:productId/reviews` | `reviewProductIdParamsSchema` params | public | 🟢 | Validates product ID. |
| POST | `/api/v1/products/:productId/reviews` | `reviewProductIdParamsSchema` params, `createReviewBodySchema` body | token required | 🟢 | Uses legacy `authenticateToken`, not `requireAuth`. |

### Admin

All admin routes are mounted behind `requireAuth` and `authorizeRoles("admin")` in `server.ts`.

| Method | Path | Validation | Status | Notes |
|---|---|---|---|---|
| GET | `/api/v1/admin/users` | manual query parsing in controller | 🟡 | Could be moved to Zod query schema later. |
| GET | `/api/v1/admin/users/:id` | `userIdParamsSchema` params | 🟢 | Validates user ID. |
| DELETE | `/api/v1/admin/users/:id` | `userIdParamsSchema` params, `softDeleteUserBodySchema` body | 🟢 | Validates optional delete reason. |
| PATCH | `/api/v1/admin/users/:id/restore` | `userIdParamsSchema` params | 🟢 | Validates user ID. |
| GET | `/api/v1/admin/products` | manual query parsing in controller | 🟡 | Could be moved to Zod query schema later. |
| GET | `/api/v1/admin/products/:id` | manual controller validation | 🟡 | TODO comment remains in route file. |
| DELETE | `/api/v1/admin/products/:id` | manual controller validation | 🟡 | TODO comment remains in route file. |
| PATCH | `/api/v1/admin/products/:id/restore` | manual controller validation | 🟡 | TODO comment remains in route file. |
| GET | `/api/v1/admin/orders` | manual query parsing in controller | 🟡 | Could be moved to Zod query schema later. |
| GET | `/api/v1/admin/orders/:id` | manual controller validation | 🟡 | TODO comment remains in route file. |
| DELETE | `/api/v1/admin/orders/:id` | manual controller validation | 🟡 | TODO comment remains in route file. |
| PATCH | `/api/v1/admin/orders/:id/restore` | manual controller validation | 🟡 | TODO comment remains in route file. |

### Payments

Payment routes are currently mock/demo routes. They are admin-only, but not Zod-validated.

| Method | Path | Validation | Auth | Status | Notes |
|---|---|---|---|---|---|
| POST | `/api/v1/payments` | Mongoose model validation only | admin | 🟡 | Mock/demo only; no real gateway behavior. |
| GET | `/api/v1/payments/:id` | Mongoose cast/error handling | admin | 🟡 | Route collision risk: declared before `/order/:orderId`. |
| GET | `/api/v1/payments/order/:orderId` | Mongoose cast/error handling | admin | 🟡 | Should be declared before `/:id` if kept. |
| PATCH | `/api/v1/payments/:id` | Mongoose model/service validation | admin | 🟡 | Mock/demo only. |

### Brands and Categories

Brand and category route files exist, but neither router is mounted in `server.ts`.

| Area | Mounted? | Zod validation | Status | Notes |
|---|---|---|---|---|
| Brands | No | No | 🔴 | Decide whether to mount and validate, or remove/defer. |
| Categories | No | No | 🔴 | Decide whether to mount and validate, or remove/defer. |

---

## Remaining Validation Work

1. Move admin product/order ID and delete-reason validation from controllers into Zod schemas.
2. Consider Zod query schemas for admin user/product/order list filters.
3. Decide whether payment mock routes should stay as admin-only mock routes or get lightweight Zod schemas.
4. If payment routes stay, register `/order/:orderId` before `/:id` to avoid route collision.
5. Decide whether brand/category routes should be mounted and validated or kept out of scope.
6. Decide whether `addCartItemSchema.quantity` should require positive quantity on add.
7. Remove or consolidate the duplicate `GET /api/v1/users` route.

---

## Completed Since Original Backlog

- Auth login validation is wired.
- Core user schemas are created and wired.
- Product and product variant schemas are created and mostly wired.
- Product/order mutation routes are protected with auth/role/owner middleware.
- Order route collision between `/user/:userId` and `/:id` is fixed by route order.
- `getOrdersWithItemsByUser` now reads `params.userId`.
- Address and cart item validation are wired.
- Review validation is wired.
- Rate limiting is mounted for `/api/v1` and stricter auth routes.
- Supertest endpoint coverage exists for validation/auth gates.
