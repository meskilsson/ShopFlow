# ShopFlow API Documentation

Base URL: `/api/v1`

All responses are JSON. All request bodies must use `Content-Type: application/json`.

---

## Authentication

ShopFlow uses **cookie-based JWT authentication**.

- On login, the server sets an `httpOnly` cookie named `token`.
- All subsequent requests from the browser include this cookie automatically.
- Token lifetime: **1 day**.
- When the token expires, protected endpoints return `401 Unauthorized`.

**Roles:**

| Role | Description |
|---|---|
| `buyer` | Default role. Can browse, add to cart, checkout, and review products. |
| `seller` | Can create and manage their own products. |
| `admin` | Full system access — can manage all users, products, orders, and restore deleted records. |

---

## Error Response Format

All errors follow this structure:

```json
{
  "message": "Human-readable error description",
  "errors": [
    { "field": "email", "message": "Invalid email address" }
  ]
}
```

`errors` is only included for validation failures (400).

---

## Endpoints

### Auth

#### POST /api/v1/auth/login

Authenticate with email and password.

**Auth:** Not required

**Request body:**

```json
{
  "email": "user@example.com",
  "password": "secretpassword"
}
```

**Success: 200 OK**

```json
{
  "message": "Login successful",
  "user": {
    "_id": "64abc123...",
    "name": "Jane Doe",
    "email": "user@example.com",
    "username": "janedoe",
    "role": "buyer"
  }
}
```

Sets `token` cookie (httpOnly, secure in production, sameSite=lax).

**Errors:**
- `400 Bad Request` — missing or invalid fields
- `401 Unauthorized` — wrong email or password

---

#### POST /api/v1/auth/logout

Clear the authentication token.

**Auth:** Not required

**Success: 200 OK**

```json
{ "message": "Logged out" }
```

---

#### GET /api/v1/auth/profile

Get the authenticated user's basic profile (from token payload).

**Auth:** Required (any role)

**Success: 200 OK**

```json
{
  "_id": "64abc123...",
  "email": "user@example.com",
  "role": "buyer"
}
```

**Errors:**
- `401 Unauthorized` — missing or expired token

---

#### GET /api/v1/auth/me

Get the full user object for the authenticated user.

**Auth:** Required (any role)

**Success: 200 OK**

```json
{
  "_id": "64abc123...",
  "name": "Jane Doe",
  "email": "user@example.com",
  "username": "janedoe",
  "role": "buyer",
  "storeName": null,
  "wishlist": [],
  "createdAt": "2025-10-01T10:00:00Z"
}
```

**Errors:**
- `401 Unauthorized`

---

### Users

#### POST /api/v1/users

Register a new user account. New accounts get the `buyer` role by default.

**Auth:** Not required

**Request body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "username": "janedoe",
  "password": "securepassword123"
}
```

**Validation:**
- `name`: string, 2–50 characters, required
- `email`: valid email address, must be unique
- `username`: string, 3–20 characters, must be unique
- `password`: string, minimum 8 characters

**Success: 201 Created**

```json
{
  "_id": "64abc123...",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "username": "janedoe",
  "role": "buyer"
}
```

**Errors:**
- `400 Bad Request` — validation failed
- `409 Conflict` — email or username already in use

---

#### GET /api/v1/users

List all users in the system.

**Auth:** Required — `admin`

**Success: 200 OK** — array of user objects

---

#### GET /api/v1/users/:id

Get a user by ID.

**Auth:** Required — self (own ID) or `admin`

**Path parameters:**
- `id`: MongoDB ObjectId

**Success: 200 OK** — user object (passwordHash excluded)

**Errors:**
- `401 Unauthorized`
- `403 Forbidden` — not own account and not admin
- `404 Not Found`

---

#### PATCH /api/v1/users/:id

Update user profile fields.

**Auth:** Required — self or `admin`

**Path parameters:**
- `id`: MongoDB ObjectId

**Request body** (at least one field required):

```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "username": "janesmith",
  "storeName": "Jane's Store"
}
```

**Success: 200 OK** — updated user object

**Errors:**
- `400 Bad Request` — no fields provided or validation failed
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict` — email or username already taken

---

#### PATCH /api/v1/users/:id/password

Change a user's password.

**Auth:** Required — self or `admin`

**Request body:**

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Success: 200 OK**

**Errors:**
- `400 Bad Request` — current password is incorrect
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`

---

#### DELETE /api/v1/users/:id

Soft-delete a user account. The user is marked as deleted but data is retained.

**Auth:** Required — self or `admin`

**Success: 204 No Content**

**Errors:**
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`

---

#### GET /api/v1/users/wishlist

Get the authenticated user's wishlist.

**Auth:** Required

**Success: 200 OK** — array of product objects

---

#### POST /api/v1/users/wishlist

Toggle a product in the wishlist (adds if not present, removes if already present).

**Auth:** Required

**Request body:**

```json
{ "productId": "64abc123..." }
```

**Success: 200 OK**

```json
{ "message": "Added to wishlist" }
```

or

```json
{ "message": "Removed from wishlist" }
```

---

#### GET /api/v1/users/me/data

Export all personal data for the authenticated user (GDPR right of access).

**Auth:** Required

**Success: 200 OK** — JSON object with all stored personal data for the user

---

#### DELETE /api/v1/users/me

Delete own account (GDPR right to erasure). Clears the auth cookie.

**Auth:** Required

**Success: 204 No Content**

---

### Products

#### GET /api/v1/products

List products with optional filtering and pagination.

**Auth:** Not required

**Query parameters:**

| Parameter | Type | Description |
|---|---|---|
| `category` | string | Filter by category (e.g. `T-shirts`, `Shoes`) |
| `sort` | string | Sort field: `price`, `name`, `createdAt` |
| `order` | string | Sort direction: `asc` (default) or `desc` |
| `page` | integer | Page number (default: `1`) |
| `limit` | integer | Items per page (default: `20`, max: `100`) |

**Success: 200 OK**

```json
{
  "data": [
    {
      "_id": "64abc123...",
      "name": "Classic White T-Shirt",
      "price": 299,
      "category": "T-shirts",
      "ProductImage": "https://...",
      "seller": "64def456...",
      "createdAt": "2025-10-01T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 42
  }
}
```

---

#### GET /api/v1/products/:id

Get a single product with all its variants.

**Auth:** Not required

**Path parameters:**
- `id`: MongoDB ObjectId

**Success: 200 OK**

```json
{
  "_id": "64abc123...",
  "name": "Classic White T-Shirt",
  "price": 299,
  "category": "T-shirts",
  "description": "A timeless wardrobe essential.",
  "ProductImage": "https://...",
  "seller": { "_id": "64def456...", "name": "Store Name" },
  "variants": [
    { "_id": "64ghi789...", "size": "S", "inStock": true, "sku": "CWT-S-001" },
    { "_id": "64ghi790...", "size": "M", "inStock": true, "sku": "CWT-M-001" }
  ]
}
```

**Errors:**
- `404 Not Found`

---

#### POST /api/v1/products

Create a new product.

**Auth:** Required — `seller` or `admin`

**Request body:**

```json
{
  "name": "Classic White T-Shirt",
  "price": 299,
  "category": "T-shirts",
  "description": "A timeless wardrobe essential.",
  "ProductImage": "https://..."
}
```

**Validation:**
- `name`: string, required
- `price`: number, ≥ 0, required
- `category`: one of `T-shirts`, `Shoes`, `Pants`, `Shirts`, `Jackets`, `Accessories`
- `description`: string, optional

**Success: 201 Created** — created product object

**Errors:**
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`

---

#### PATCH /api/v1/products/:id

Update a product.

**Auth:** Required — product owner (`seller`) or `admin`

**Request body:** Partial product fields (same as POST)

**Success: 200 OK** — updated product object

**Errors:**
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`

---

#### DELETE /api/v1/products/:id

Soft-delete a product.

**Auth:** Required — product owner or `admin`

**Success: 204 No Content**

**Errors:**
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`

---

#### POST /api/v1/products/upload-image

Upload a product image to Supabase storage.

**Auth:** Required — `seller` or `admin`

**Content-Type:** `multipart/form-data`

**Form field:**
- `image`: image file (JPEG, PNG, WebP)

**Success: 200 OK**

```json
{ "url": "https://your-project.supabase.co/storage/v1/object/public/product-images/..." }
```

---

#### GET /api/v1/products/seller/:sellerId

Get all products by a specific seller.

**Auth:** Not required

**Success: 200 OK** — array of products

---

#### GET /api/v1/products/mine

Get the authenticated seller's own products.

**Auth:** Required — `seller` or `admin`

**Success: 200 OK** — array of products

---

#### GET /api/v1/products/:id/variants

Get all size variants for a product.

**Auth:** Not required

**Success: 200 OK** — array of variant objects

**Errors:**
- `404 Not Found` — product not found

---

#### GET /api/v1/products/variants/:variantId

Get a specific product variant by its ID.

**Auth:** Not required

**Success: 200 OK** — variant object

**Errors:**
- `404 Not Found`

---

#### POST /api/v1/products/:id/variants

Add a size variant to a product.

**Auth:** Required — `seller` or `admin`

**Request body:**

```json
{
  "size": "M",
  "inStock": true,
  "sku": "CWT-M-001"
}
```

**Validation:**
- `size`: string, required
- `inStock`: boolean, optional (default: `true`)
- `sku`: string, optional

**Success: 201 Created** — created variant object

**Errors:**
- `400 Bad Request`
- `404 Not Found` — product not found

---

#### PATCH /api/v1/products/variants/:variantId

Update a product variant.

**Auth:** Required — `admin`

**Request body:** Partial variant fields

**Success: 200 OK** — updated variant object

---

#### DELETE /api/v1/products/variants/:variantId

Delete a product variant.

**Auth:** Required — `seller` or `admin`

**Success: 204 No Content**

---

### Cart

The cart supports both authenticated users and guests. Guest carts are identified by the `shopflow.guestId` cookie (set automatically on first cart interaction).

#### POST /api/v1/cart

Create a cart for the current user or guest session.

**Auth:** Not required (guest or user)

**Success: 201 Created** — cart object

**Errors:**
- `409 Conflict` — cart already exists for this session

---

#### GET /api/v1/cart

Get the current cart with all items.

**Auth:** Not required

**Success: 200 OK**

```json
{
  "_id": "64abc123...",
  "items": [
    {
      "_id": "64def456...",
      "productVariant": {
        "_id": "64ghi789...",
        "size": "M",
        "product": { "_id": "64jkl012...", "name": "Classic White T-Shirt", "price": 299 }
      },
      "quantity": 2,
      "unitPrice": 299
    }
  ]
}
```

**Errors:**
- `404 Not Found` — no cart exists for this session

---

#### DELETE /api/v1/cart

Remove all items from the cart and delete the cart.

**Auth:** Not required

**Success: 204 No Content**

**Errors:**
- `404 Not Found`

---

#### POST /api/v1/cart/items

Add a product variant to the cart.

**Auth:** Not required

**Request body:**

```json
{
  "productVariantId": "64ghi789...",
  "quantity": 1
}
```

**Validation:**
- `productVariantId`: MongoDB ObjectId, required
- `quantity`: integer ≥ 1, required

**Success: 201 Created** — cart item object

**Errors:**
- `400 Bad Request` — validation failed or variant out of stock
- `404 Not Found` — variant not found

---

#### PATCH /api/v1/cart/items/:productVariantId

Update the quantity of a cart item. Setting quantity ≤ 0 removes the item.

**Auth:** Not required

**Path parameters:**
- `productVariantId`: MongoDB ObjectId

**Request body:**

```json
{ "quantity": 3 }
```

**Success: 200 OK** — updated cart item

**Errors:**
- `404 Not Found` — item not in cart

---

#### DELETE /api/v1/cart/items/:productVariantId

Remove a specific item from the cart.

**Auth:** Not required

**Success: 204 No Content**

**Errors:**
- `404 Not Found`

---

### Address

Addresses support both authenticated users and guests (via `shopflow.guestId` cookie).

#### GET /api/v1/address

Get all addresses for the current user or guest session.

**Auth:** Not required

**Success: 200 OK** — array of address objects (empty array if none)

---

#### POST /api/v1/address

Create a shipping or billing address.

**Auth:** Not required

**Request body:**

```json
{
  "fullName": "Jane Doe",
  "street": "Storgatan 1",
  "city": "Malmö",
  "postalCode": "21120",
  "country": "Sweden",
  "type": "shipping"
}
```

**Validation:**
- All fields required
- `type`: `shipping` or `billing`
- Only one address per type per owner is allowed

**Success: 201 Created** — address object

**Errors:**
- `400 Bad Request`
- `409 Conflict` — address of this type already exists for this session

---

#### PUT /api/v1/address/:id

Replace an existing address.

**Auth:** Not required (owner resolved from session)

**Request body:** Full address object (same fields as POST)

**Success: 200 OK** — updated address object

**Errors:**
- `400 Bad Request`
- `404 Not Found`

---

#### DELETE /api/v1/address/:id

Delete an address.

**Auth:** Not required (owner resolved from session)

**Success: 204 No Content**

**Errors:**
- `404 Not Found`

---

### Orders

#### POST /api/v1/orders/from-cart

Convert the current cart into an order. Works for both guests and authenticated users. Cart is cleared on success.

**Auth:** Not required

**Success: 201 Created**

```json
{
  "_id": "64abc123...",
  "user": "64def456...",
  "totalPrice": 897,
  "status": "pending",
  "paymentStatus": "pending",
  "createdAt": "2025-11-10T14:30:00Z"
}
```

**Errors:**
- `400 Bad Request` — cart is empty
- `404 Not Found` — no cart found for this session

---

#### GET /api/v1/orders

List all orders in the system.

**Auth:** Required — `admin`

**Success: 200 OK** — array of order objects

---

#### GET /api/v1/orders/:id

Get a single order by ID.

**Auth:** Required — order owner or `admin`

**Success: 200 OK** — order object

**Errors:**
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`

---

#### GET /api/v1/orders/user/:userId

Get all orders for a specific user.

**Auth:** Required — self or `admin`

**Success: 200 OK** — array of orders (empty if none)

---

#### GET /api/v1/orders/user/:userId/with-items

Get all orders for a user including full line item details.

**Auth:** Required — self or `admin`

**Success: 200 OK** — array of orders with populated order items

---

#### PATCH /api/v1/orders/:id

Update the status of an order.

**Auth:** Required — `admin`

**Request body:**

```json
{
  "status": "shipped",
  "paymentStatus": "paid"
}
```

**Validation:**
- `status`: one of `pending`, `processing`, `shipped`, `delivered`, `cancelled`
- `paymentStatus`: one of `pending`, `paid`, `failed`, `refunded`

**Success: 200 OK** — updated order object

**Errors:**
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`

---

### Reviews

#### GET /api/v1/products/:productId/reviews

Get all reviews for a product.

**Auth:** Not required

**Success: 200 OK** — array of review objects

---

#### POST /api/v1/products/:productId/reviews

Submit a review for a product.

**Auth:** Required (any authenticated user)

**Request body:**

```json
{
  "rating": 5,
  "comment": "Great quality, very comfortable!"
}
```

**Validation:**
- `rating`: integer 1–5, required
- `comment`: string, max 100 characters, required

**Success: 201 Created** — review object

**Errors:**
- `400 Bad Request`
- `401 Unauthorized`
- `404 Not Found` — product not found

---

### Payments

All payment endpoints require `admin` role.

#### POST /api/v1/payments

Create a payment record for an order.

**Auth:** Required — `admin`

**Request body:**

```json
{
  "order": "64abc123...",
  "paymentMethod": "card",
  "amount": 897,
  "status": "pending",
  "transactionId": "txn_abc123"
}
```

**Validation:**
- `order`: MongoDB ObjectId, required
- `paymentMethod`: one of `card`, `swish`, `invoice`, `klarna`, `paypal`
- `amount`: number ≥ 0, required
- `status`: one of `pending`, `paid`, `failed`, `refunded`
- `transactionId`: string, optional

**Success: 201 Created** — payment object

---

#### GET /api/v1/payments/:id

Get a payment by ID.

**Auth:** Required — `admin`

**Success: 200 OK** — payment object

**Errors:**
- `404 Not Found`

---

#### GET /api/v1/payments/order/:orderId

Get all payments for a specific order.

**Auth:** Required — `admin`

**Success: 200 OK** — array of payment objects

---

#### PATCH /api/v1/payments/:id

Update payment status.

**Auth:** Required — `admin`

**Request body:**

```json
{
  "status": "paid",
  "transactionId": "txn_abc123"
}
```

**Success: 200 OK** — updated payment object

**Errors:**
- `400 Bad Request`
- `404 Not Found`

---

### Admin

All admin endpoints require authentication and the `admin` role. Returns `403 Forbidden` for any other role.

#### Users

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/users` | List all users including soft-deleted |
| `GET` | `/admin/users/:id` | Get user by ID |
| `DELETE` | `/admin/users/:id` | Soft-delete user with a reason |
| `PATCH` | `/admin/users/:id/restore` | Restore a soft-deleted user |

#### Products

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/products` | List all products including soft-deleted |
| `GET` | `/admin/products/:id` | Get product by ID |
| `DELETE` | `/admin/products/:id` | Soft-delete product |
| `PATCH` | `/admin/products/:id/restore` | Restore a soft-deleted product |

#### Orders

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/orders` | List all orders including soft-deleted |
| `GET` | `/admin/orders/:id` | Get order by ID |
| `DELETE` | `/admin/orders/:id` | Soft-delete order |
| `PATCH` | `/admin/orders/:id/restore` | Restore a soft-deleted order |

---

### Health

#### GET /

Returns a confirmation that the backend is running.

**Success: 200 OK** — `"ShopFlow backend is running"`

#### GET /health

Health check endpoint.

**Success: 200 OK**

```json
{ "ok": true }
```
