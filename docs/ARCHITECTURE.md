# ShopFlow Architecture

## System Overview

ShopFlow is a monorepo containing a React SPA frontend, a Node.js/Express REST API backend, and a MongoDB Atlas database. Images are stored separately in Supabase.

```mermaid
graph LR
    Client[React SPA\nVite + React 19]
    API[Express API\nNode.js + TypeScript]
    DB[(MongoDB Atlas\nMongoose)]
    Storage[Supabase\nImage Storage]
    Logs[Pino\nStructured Logs]

    Client -->|HTTPS / JSON + Cookie| API
    API -->|Mongoose ODM| DB
    API -->|Supabase SDK| Storage
    API -->|stdout| Logs
```

---

## Backend Layers

The backend follows a layered architecture with clear separation of concerns. Each layer has a single responsibility and communicates only with the layer below it.

```mermaid
graph TB
    Request[HTTP Request]
    Routes[Routes\nExpress Router]
    MW[Middleware\nAuth · Validation · Logger]
    Controllers[Controllers\nRequest / Response handling]
    Services[Services\nBusiness Logic]
    Models[Mongoose Models\nSchema + DB queries]
    DB[(MongoDB Atlas)]

    Request --> MW
    MW --> Routes
    Routes --> Controllers
    Controllers --> Services
    Services --> Models
    Models --> DB
```

**Routes** — Define HTTP method + path, apply middleware, and forward to the controller.  
**Middleware** — Auth (`authenticateToken`, `authorizeRoles`), Zod input validation (`validate`), Pino request logging, and the global error handler.  
**Controllers** — Thin layer: extract request data, call the service, send the response.  
**Services** — All business logic lives here (validation of business rules, DB queries, error throwing).  
**Models** — Mongoose schemas, indexes, and the `pre-save` hooks (e.g. password hashing is done at the service level, not here).

---

## Authentication Flow

### Login and First Authenticated Request

```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant MW as Auth Middleware
    participant API as Express API
    participant DB as MongoDB

    C->>API: POST /api/v1/auth/login with email and password
    API->>API: Validate input with Zod
    API->>DB: Find user by email
    DB-->>API: User document (with passwordHash)
    API->>API: bcrypt.compare(password, passwordHash)
    API->>API: Sign JWT { id, email, role }
    API-->>C: 200 OK with user payload
    API-->>C: Set-Cookie token jwt httpOnly

    Note over C: Token stored in httpOnly cookie

    C->>MW: GET /api/v1/auth/me with token cookie
    MW->>MW: jwt.verify(token, JWT_SECRET)
    MW->>MW: Check user.deletedAt is null
    MW-->>API: req.user = { id, email, role }
    API->>DB: Find user by id
    DB-->>API: User document
    API-->>C: 200 OK { user }
```

---

## Guest Cart and Checkout Flow

Unauthenticated users can add to cart and complete checkout using a session cookie. The guest session ID is stored in the `shopflow.guestId` cookie.

```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant MW as Cart Middleware
    participant API as Express API
    participant DB as MongoDB

    C->>API: POST /api/v1/cart
    API->>API: resolveCartOwner middleware
    API->>API: No user token → generate guestId
    API-->>C: 201 Created with cart
    API-->>C: Set-Cookie shopflow.guestId uuid

    C->>MW: POST /api/v1/cart/items with guest cookie
    MW->>DB: Find cart by sessionId
    DB-->>MW: Cart document
    MW-->>API: req.cart = cart
    API->>DB: Find ProductVariant, check inStock
    API->>DB: Create CartItem
    API-->>C: 201 Created { cartItem }

    C->>API: POST /api/v1/orders/from-cart with guest cookie
    API->>DB: Find cart + items by sessionId
    API->>DB: Create Order (sessionId, totalPrice)
    API->>DB: Create OrderItems for each cart item
    API->>DB: Delete cart and cart items
    API-->>C: 201 Created { order }
```

---

## RBAC Authorization

Role-Based Access Control is enforced through middleware chains on each route.

```mermaid
graph TD
    Request[Incoming Request]
    Token[authenticateToken\nRead JWT from cookie]
    Verify{Token valid?}
    Deleted{User deleted?}
    Role[authorizeRoles\nCheck req.user.role]
    Owner[requireSelfOrRole\nCheck ownership]
    Handler[Route Handler]

    Reject401[401 Unauthorized]
    Reject403[403 Forbidden]

    Request --> Token
    Token --> Verify
    Verify -- No --> Reject401
    Verify -- Yes --> Deleted
    Deleted -- Yes --> Reject403
    Deleted -- No --> Role
    Role -- Role not allowed --> Reject403
    Role -- Role allowed --> Owner
    Owner -- Not owner or admin --> Reject403
    Owner -- OK --> Handler
```

**Middleware in use:**

| Middleware                  | Purpose                                               |
| --------------------------- | ----------------------------------------------------- |
| `authenticateToken`         | Reads and verifies the JWT cookie, sets `req.user`    |
| `requireAuth`               | Combines token check + soft-delete check              |
| `authorizeRoles(...roles)`  | Rejects if `req.user.role` is not in the allowed list |
| `requireSelfOrRole`         | Allows only the resource owner or a specified role    |
| `requireProductOwnerOrRole` | Allows only the product's seller or an admin          |
| `requireOrderOwnerOrRole`   | Allows only the order's user or an admin              |
| `resolveCartOwner`          | Resolves cart for both logged-in users and guests     |
| `resolveAddressOwner`       | Resolves address for both logged-in users and guests  |

---

## Data Model Relationships

```mermaid
erDiagram
    User {
        ObjectId _id
        string name
        string email
        string username
        string passwordHash
        string role
        string storeName
        ObjectIdArray wishlist
        Date deletedAt
    }
    Product {
        ObjectId _id
        string name
        number price
        string category
        string description
        string ProductImage
        ObjectId seller
        Date deletedAt
    }
    ProductVariant {
        ObjectId _id
        ObjectId product
        string size
        boolean inStock
        string sku
    }
    Cart {
        ObjectId _id
        ObjectId user
        string sessionId
    }
    CartItem {
        ObjectId _id
        ObjectId cart
        ObjectId productVariant
        number quantity
        number unitPrice
    }
    Order {
        ObjectId _id
        ObjectId user
        string sessionId
        number totalPrice
        string status
        string paymentStatus
        Date deletedAt
    }
    OrderItem {
        ObjectId _id
        ObjectId order
        ObjectId productVariant
        number quantity
        number priceAtPurchase
    }
    Address {
        ObjectId _id
        ObjectId user
        string sessionId
        string fullName
        string street
        string city
        string postalCode
        string country
        string type
    }
    Payment {
        ObjectId _id
        ObjectId order
        string paymentMethod
        number amount
        string status
        string transactionId
    }
    Review {
        ObjectId _id
        ObjectId product
        ObjectId user
        number rating
        string comment
    }

    User ||--o{ Product : "sells"
    User ||--o{ Order : "places"
    User ||--o{ Review : "writes"
    User ||--o{ Address : "has"
    User ||--o{ Cart : "owns"
    Product ||--o{ ProductVariant : "has"
    Product ||--o{ Review : "receives"
    Cart ||--o{ CartItem : "contains"
    CartItem }o--|| ProductVariant : "references"
    Order ||--o{ OrderItem : "contains"
    OrderItem }o--|| ProductVariant : "references"
    Order ||--o{ Payment : "paid with"
```
