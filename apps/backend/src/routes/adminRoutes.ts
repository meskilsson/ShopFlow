import { Router } from 'express';
import { validateRequest } from '../middleware/validate';
import { getAdminUsers, getAdminUserById, deleteAdminUserById, restoreAdminUserById, getAdminProducts, getAdminProductById, deleteAdminProductById, restoreAdminProductById } from '../controllers/adminController';

import { userIdParamsSchema } from '../schemas/userSchemas';
import { softDeleteUserBodySchema } from '../schemas/admin.schemas';

const adminRouter = Router();


adminRouter.get("/users", getAdminUsers);
adminRouter.get("/users/:id", validateRequest({ params: userIdParamsSchema }), getAdminUserById);
adminRouter.get("/products", getAdminProducts);

// FIXA VALIDATEREQUEST NÄR SCHEMAT ÄR GJORT!

adminRouter.get("/products/:id", getAdminProductById);


adminRouter.delete("/users/:id", validateRequest({ params: userIdParamsSchema, body: softDeleteUserBodySchema }), deleteAdminUserById);

// FIXA VALIDATEREQUEST NÄR SCHEMAT ÄR GJORT!

adminRouter.delete("/products/:id", deleteAdminProductById);


adminRouter.patch("/users/:id/restore", validateRequest({ params: userIdParamsSchema }), restoreAdminUserById);

// FIXA VALIDATEREQUEST NÄR SCHEMAT ÄR GJORT!

adminRouter.patch("/products/:id/restore", restoreAdminProductById);


/* 

/api/v1/admin/users
/api/v1/admin/products
/api/v1/admin/orders
/api/v1/admin/reviews
/api/v1/admin/dashboard


*/


export default adminRouter;