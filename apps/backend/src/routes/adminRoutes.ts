import { Router } from 'express';
import { validateRequest } from '../middleware/validate';
import { getAdminUsers, getAdminUserById, deleteAdminUserById } from '../controllers/adminController';

import { userIdParamsSchema } from '../schemas/userSchemas';
import { softDeleteUserBodySchema } from '../schemas/admin.schemas';

const adminRouter = Router();


adminRouter.get("/users", getAdminUsers);
adminRouter.get("/users/:id", validateRequest({ params: userIdParamsSchema }), getAdminUserById);


adminRouter.delete("/users/:id", validateRequest({ params: userIdParamsSchema, body: softDeleteUserBodySchema }), deleteAdminUserById);


/* 

/api/v1/admin/users
/api/v1/admin/products
/api/v1/admin/orders
/api/v1/admin/reviews
/api/v1/admin/dashboard

GET /api/v1/admin/users
GET /api/v1/admin/users/:id
DELETE /api/v1/admin/users/:id
PATCH /api/v1/admin/users/:id/restore

*/


export default adminRouter;