# Validation Backlog

> 🔴 TODO · 🟡 In progress · 🟢 Done

Read-only scan of `apps/backend/src/` — 2026-05-11.
Do not edit route, controller, or model files while working through this list.

---

## Auth

| Method | Path | Body | Params | Query | 404 | 409 | Owner | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|
| POST | /api/v1/auth/login | loginBodySchema | – | – | – | – | – | 🔴 | Returns 401 (not 404) on bad credentials |
| GET | /api/v1/auth/profile | – | – | – | – | – | – | 🔴 | Auth required; reads `req.user` from token |
| GET | /api/v1/auth/buyer | – | – | – | – | – | – | 🔴 | Test/demo route; auth + role=buyer |
| GET | /api/v1/auth/seller | – | – | – | – | – | – | 🔴 | Test/demo route; auth + role=seller |
| GET | /api/v1/auth/admin | – | – | – | – | – | – | 🔴 | Test/demo route; auth + role=admin |
| GET | /api/v1/auth/seller-admin | – | – | – | – | – | – | 🔴 | Test/demo route; auth + role=seller or admin |

---

## Users

| Method | Path | Body | Params | Query | 404 | 409 | Owner | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|
| GET | /api/v1/users | – | – | – | – | – | – | 🔴 | Auth required; no role restriction |
| GET | /api/v1/users/:id | – | idParamSchema | – | ✅ | – | – | 🔴 | Auth required |
| POST | /api/v1/users | createUserSchema | – | – | – | email unique, username unique | – | 🔴 | No auth required; hash password before save |
| PATCH | /api/v1/users/:id | updateUserSchema | idParamSchema | – | ✅ | email unique, username unique | – | 🔴 | Auth required; at least one field required |
| PATCH | /api/v1/users/:id/password | changePasswordSchema | idParamSchema | – | ✅ | – | – | 🔴 | Auth required; 400 if current password incorrect |
| DELETE | /api/v1/users/:id | – | idParamSchema | – | ✅ | – | – | 🔴 | Auth required |

---

## Products

| Method | Path | Body | Params | Query | 404 | 409 | Owner | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|
| GET | /api/v1/products | – | – | listProductsQuerySchema | – | – | – | 🔴 | No auth; paginated `{ data, meta }` response |
| GET | /api/v1/products/:id | – | idParamSchema | – | ✅ | – | – | 🔴 | No auth; includes variants sorted by size |
| POST | /api/v1/products | createProductSchema | – | – | – | – | – | 🔴 | No auth or authorization — mutation endpoint unprotected |
| PATCH | /api/v1/products/:id | updateProductSchema | idParamSchema | – | ✅ | – | – | 🔴 | No auth or authorization |
| DELETE | /api/v1/products/:id | – | idParamSchema | – | ? | – | – | 🔴 | No auth; no null-check on `findByIdAndDelete` — 404 behavior unclear (see §7) |
| GET | /api/v1/products/:id/variants | – | idParamSchema | – | ✅ | – | – | 🔴 | No auth; 404 if parent product not found |
| GET | /api/v1/products/variants/:variantId | – | variantIdParamSchema | – | ✅ | – | – | 🔴 | No auth; route collision risk (see §2) |
| POST | /api/v1/products/:id/variants | createVariantSchema | idParamSchema | – | ✅ | – | – | 🔴 | No auth; 404 if parent product not found |
| PATCH | /api/v1/products/variants/:variantId | updateVariantSchema | variantIdParamSchema | – | ✅ | – | – | 🔴 | No auth; route collision risk (see §2) |
| DELETE | /api/v1/products/variants/:variantId | – | variantIdParamSchema | – | ? | – | – | 🔴 | No auth; 404 behavior unclear; route collision risk (see §2) |

---

## Orders

| Method | Path | Body | Params | Query | 404 | 409 | Owner | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|
| GET | /api/v1/orders | – | – | – | – | – | – | 🔴 | No auth or authorization — should be admin-only |
| GET | /api/v1/orders/:id | – | idParamSchema | – | ✅ | – | – | 🔴 | No auth; route collision risk (see §3) |
| GET | /api/v1/orders/user/:userId | – | userIdParamSchema | – | – | – | – | 🔴 | No auth; returns empty array if no orders; route collision risk (see §3) |
| GET | /api/v1/orders/user/:userId/with-items | – | userIdParamSchema | – | – | – | – | 🔴 | No auth; param name mismatch bug (see §5) |
| POST | /api/v1/orders | createOrderSchema | – | – | – | – | – | 🔴 | No auth or authorization |
| POST | /api/v1/orders/from-cart | – | – | – | ✅ | – | – | 🔴 | `resolveCartOwner` middleware; 400 if cart is empty |
| PATCH | /api/v1/orders/:id | updateOrderStatusSchema | idParamSchema | – | ✅ | – | – | 🔴 | No auth or authorization |

---

## Cart

| Method | Path | Body | Params | Query | 404 | 409 | Owner | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|
| POST | /api/v1/cart | – | – | – | – | cart owner unique | – | 🟢 | `resolveCartOwner`; 409 if cart already exists for this owner |
| GET | /api/v1/cart | – | – | – | ✅ | – | – | 🔴 | `resolveCartOwner`; 404 if no cart |
| DELETE | /api/v1/cart | – | – | – | ✅ | – | – | 🔴 | `resolveCartOwner`; 404 if no cart |
| POST | /api/v1/cart/items | addCartItemSchema | – | – | ✅ | – | – | 🔴 | `resolveCartOwner`; 404 if variant not found; 400 if out of stock |
| PATCH | /api/v1/cart/items/:productVariantId | updateCartItemQuantitySchema | productVariantIdParamSchema | – | ✅ | – | – | 🔴 | `resolveCartOwner`; quantity ≤ 0 deletes item |
| DELETE | /api/v1/cart/items/:productVariantId | – | productVariantIdParamSchema | – | ✅ | – | – | 🔴 | `resolveCartOwner`; 404 if item not found |

---

## Address

| Method | Path | Body | Params | Query | 404 | 409 | Owner | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|
| GET | /api/v1/address | – | – | – | – | – | – | 🔴 | `resolveAddressOwner`; returns empty array if none |
| POST | /api/v1/address | createAddressSchema | – | – | – | same address type exists | – | 🔴 | `resolveAddressOwner`; 409 if a `shipping`\|`billing` address already exists for this owner |
| PUT | /api/v1/address/:id | updateAddressSchema | idParamSchema | – | ✅ | – | – | 🔴 | `resolveAddressOwner`; 404 if not found |
| DELETE | /api/v1/address/:id | – | idParamSchema | – | ✅ | – | – | 🔴 | `resolveAddressOwner`; 404 if not found |

---

## Payments

| Method | Path | Body | Params | Query | 404 | 409 | Owner | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|
| POST | /api/v1/payments | createPaymentSchema | – | – | – | – | – | 🔴 | No auth; no check that referenced `order` exists |
| GET | /api/v1/payments/:id | – | idParamSchema | – | ✅ | – | – | 🔴 | No auth; route collision risk (see §4) |
| GET | /api/v1/payments/order/:orderId | – | orderIdParamSchema | – | – | – | – | 🔴 | No auth; returns empty array if no payments; route collision risk (see §4) |
| PATCH | /api/v1/payments/:id | updatePaymentStatusSchema | idParamSchema | – | ✅ | – | – | 🔴 | No auth or authorization |

---

## Schemas to create

### Auth
- [ ] `loginBodySchema` — `{ email: string, password: string }`

### Users
- [ ] `createUserSchema` — `{ name, email, username, password, role? }`
- [ ] `updateUserSchema` — at least one of `{ name?, email?, username? }`
- [ ] `changePasswordSchema` — `{ currentPassword, newPassword }`
- [ ] `idParamSchema` — `{ id: mongoId }` *(shared across all resources)*

### Products
- [ ] `createProductSchema` — `{ name, price, category, productImage, ... }`
- [ ] `updateProductSchema` — partial product data
- [ ] `createVariantSchema` — `{ size, stock, price?, ... }`
- [ ] `updateVariantSchema` — partial variant data
- [ ] `variantIdParamSchema` — `{ variantId: mongoId }`
- [ ] `listProductsQuerySchema` — `{ category?, inStock?, sort?, order?, page?, limit? }`

### Orders
- [ ] `createOrderSchema` — `{ items: [...], ...orderData }`
- [ ] `updateOrderStatusSchema` — `{ status, paymentStatus? }`
- [ ] `userIdParamSchema` — `{ userId: mongoId }`

### Cart
- [ ] `addCartItemSchema` — `{ productVariantId: mongoId, quantity: positiveInt }`
- [ ] `updateCartItemQuantitySchema` — `{ quantity: int }` (0 or below removes item)
- [ ] `productVariantIdParamSchema` — `{ productVariantId: mongoId }`

### Address
- [ ] `createAddressSchema` — `{ full_name, street, city, postal_code, country, type: 'shipping'|'billing' }`
- [ ] `updateAddressSchema` — partial address data

### Payments
- [ ] `createPaymentSchema` — `{ order: mongoId, paymentMethod, amount, status, transactionId? }`
- [ ] `updatePaymentStatusSchema` — `{ status, transactionId? }`
- [ ] `orderIdParamSchema` — `{ orderId: mongoId }`

### Brands *(routes exist but are not mounted — see §1)*
- [ ] `createBrandSchema` — `{ name: string }` (unique)
- [ ] `updateBrandSchema` — `{ name?: string }`

### Categories *(routes exist but are not mounted — see §1)*
- [ ] `createCategorySchema` — `{ name: string, parent?: mongoId }` (name unique)
- [ ] `updateCategorySchema` — `{ name?: string, parent?: mongoId }`

---

## Infrastructure (Steg 2)

- [ ] `errors/AppError.js`
- [ ] `errors/NotFoundError.js`
- [ ] `errors/ConflictError.js`
- [ ] `middleware/validate.js`
- [ ] `middleware/errorHandler.js`
- [ ] `NODE_ENV` defaults to `production`

---

## Needs investigation

### §1 — Brand and Category routes not mounted

`brandRoutes.ts` and `categoryRoutes.ts` have full CRUD implementations (controllers, services, models) but are **not registered in `server.ts`**. Both models have `name: unique` constraints. Confirm whether these are intentionally omitted or should be mounted at `/api/v1/brands` and `/api/v1/categories` before the validation pass begins.

### §2 — Products variant route collision

Routes `GET/PATCH/DELETE /api/v1/products/variants/:variantId` use a static `/variants/` prefix on the same router as `GET/PATCH/DELETE /api/v1/products/:id`. Express matches routes in registration order — if `/:id` is registered before `/variants/:variantId`, the literal string `"variants"` is captured as `:id`, causing incorrect DB lookups or silent wrong results. Verify the order of `router.get('/:id', ...)` vs `router.get('/variants/:variantId', ...)` in [productRoutes.ts](../src/routes/productRoutes.ts).

### §3 — Orders route collision

`GET /api/v1/orders/:id` and `GET /api/v1/orders/user/:userId` share the same router. If `/:id` is registered first, a request to `/orders/user/xxx` will match with `id = "user"` and attempt `Order.findById("user")`, likely returning a cast error rather than 404. Verify registration order in [orderRoutes.ts](../src/routes/orderRoutes.ts).

### §4 — Payments route collision

`GET /api/v1/payments/:id` and `GET /api/v1/payments/order/:orderId` have the same collision risk as §3. Verify registration order in [paymentRoutes.ts](../src/routes/paymentRoutes.ts).

### §5 — `getOrdersWithItemsByUser` parameter name mismatch

The route is `GET /api/v1/orders/user/:userId` but the handler reportedly reads `req.params.id` instead of `req.params.userId`. If confirmed, every call to this endpoint passes `undefined` as the user ID and will return wrong results silently. Inspect [orderController.ts](../src/controllers/orderController.ts) → `getOrdersWithItemsByUser`.

### §6 — Mutation endpoints lack authentication

`POST`, `PATCH`, and `DELETE` on `/api/v1/products`, `/api/v1/orders`, and `/api/v1/payments` have **no `authenticateToken` or `authorizeRoles` middleware**. Any unauthenticated client can create, modify, or delete products, orders, and payments. Determine whether this is intentional or an oversight before the validation refactor ships.

### §7 — `deleteProduct` and `deleteVariant` silent 204 on missing resource

`productService.deleteProduct` calls `Product.findByIdAndDelete(id)` with no null check on the return value. If the product does not exist the handler returns `204 No Content` instead of `404`. Same pattern in `deleteVariant`. Confirm the intended contract (idempotent delete vs. strict 404).
