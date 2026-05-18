# ShopFlow

**A modern, full-featured e-commerce system built as a production-like project.**

**Boiler Room – Backend Development in Node.js, Databases and Security**  
**Group:** Malmö 1 (Team Kattarp)  
**Members:** Mattias Eskilsson, Olivia Mach, Pontus Ingenius, Marcus William Johansson, Tomac Jansson

**Repository:** [github.com/meskilsson/ShopFlow](https://github.com/meskilsson/ShopFlow/)

## Project Description

ShopFlow is a standalone e-commerce platform where users can:

- Register and log in
- Browse products
- Add products to their shopping cart
- Complete orders
- Leave reviews

Sellers can manage their own products and view statistics, while **admins** have full system oversight, including soft-delete functionality.

The backend runs in the cloud, the frontend consumes the REST API, and all data is securely stored in MongoDB Atlas.

## Technical Stack

**Backend**

- Node.js + Express + **TypeScript**
- Mongoose (MongoDB Atlas)
- Zod for schema validation
- bcrypt + JWT for authentication & authorization
- Winston for structured logging
- RBAC (Role-Based Access Control)

**Frontend**

- React Single Page Application (SPA)

**Database**

- MongoDB Atlas with models: `User`, `Product`, `Category`, `Order`, `OrderItem`, `Review`

**Other Tools**

- Git + GitHub (monorepo)
- Swagger / OpenAPI for API documentation
- Jest + Supertest for testing
- Deployment: Render / Railway

## Team Roles – Team Kattarp

| Role                                        | Responsible              | Main Responsibilities                                     |
| ------------------------------------------- | ------------------------ | --------------------------------------------------------- |
| Project Manager                             | Tomac Jansson            | Overall planning, meetings, GitHub Project Board          |
| Git Master & Backend Lead – Auth & Security | Mattias Eskilsson        | Git workflow, authentication, security, RBAC              |
| Backend Lead – Core Features & Data Models  | Olivia Mach              | Mongoose models, CRUD operations, order flow, soft delete |
| Frontend Developer & API Integration        | Marcus William Johansson | React SPA, API communication, UI components               |
| Test, Documentation & DevOps Lead           | Pontus Ingenius          | Testing, logging, Swagger, deployment                     |

## MVP (Minimum Viable Product)

- User registration & authentication (Buyer, Seller, Admin roles)
- Product management (CRUD with soft delete)
- Shopping cart & order processing
- Product reviews & ratings
- Role-Based Access Control (RBAC)
- GDPR compliance (soft delete, data minimization)

## Stretch Goals

- Advanced search & filtering (full-text search)
- Simulated payment gateway
- Email notifications
- Enhanced dashboards and analytics
- Image upload (Cloudinary/AWS S3)
- CI/CD with GitHub Actions
- Recommendation system

## Getting Started

_(Coming soon – will be filled in as development progresses)_

```bash
npm install
npm run dev
```
