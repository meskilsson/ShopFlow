import Router from 'express';
import { authorizeRoles } from '../middleware/authorizeRoles';
import { validateRequest } from '../middleware/validate';
import { requireAuth } from '../middleware/requireAuth';
import { getAdminUsers } from '../controllers/adminController';


const adminRouter = Router();

adminRouter.get("/", (req, res) => {
    res.json({ message: "Logged in as admin " });
});

adminRouter.get("/users", getAdminUsers);

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