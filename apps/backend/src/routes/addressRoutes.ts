import { Router } from "express";
import authenticateToken from "../middleware/authenticateToken";
import {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController";

const addressRouter = Router();

addressRouter.use(authenticateToken);

addressRouter.post("/", createAddress);
addressRouter.get("/", getAddresses);
addressRouter.put("/:id", updateAddress);
addressRouter.delete("/:id", deleteAddress);

export default addressRouter;