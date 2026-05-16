import { Router } from 'express';
import { validateRequest } from '../middleware/validate';
import {
    getAdminUsers,
    getAdminUserById,
    deleteAdminUserById,
    restoreAdminUserById,
    getAdminProducts,
    getAdminProductById,
    deleteAdminProductById,
    restoreAdminProductById,
    getAdminOrders,
    getAdminOrderById,
    deleteAdminOrderById,
    restoreAdminOrderById,
} from '../controllers/adminController';

import { userIdParamsSchema } from '../schemas/userSchemas';
import { softDeleteUserBodySchema } from '../schemas/admin.schemas';

const adminRouter = Router();


adminRouter.get("/users", getAdminUsers);
adminRouter.get("/users/:id", validateRequest({ params: userIdParamsSchema }), getAdminUserById);
adminRouter.get("/products", getAdminProducts);
adminRouter.get("/orders", getAdminOrders);


// FIXA VALIDATEREQUEST NÄR SCHEMAT ÄR GJORT!

adminRouter.get("/products/:id", getAdminProductById);
adminRouter.get("/orders/:id", getAdminOrderById);

adminRouter.delete("/users/:id", validateRequest({ params: userIdParamsSchema, body: softDeleteUserBodySchema }), deleteAdminUserById);

// FIXA VALIDATEREQUEST NÄR SCHEMAT ÄR GJORT!



adminRouter.delete("/products/:id", deleteAdminProductById);
adminRouter.delete("/orders/:id", deleteAdminOrderById);

adminRouter.patch("/users/:id/restore", validateRequest({ params: userIdParamsSchema }), restoreAdminUserById);

// FIXA VALIDATEREQUEST NÄR SCHEMAT ÄR GJORT!

adminRouter.patch("/products/:id/restore", restoreAdminProductById);
adminRouter.patch("/orders/:id/restore", restoreAdminOrderById);
/* 

/api/v1/admin/reviews
/api/v1/admin/dashboard

*/


export default adminRouter;