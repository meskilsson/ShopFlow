import { Router } from "express";
import resolveAddressOwner from "../middleware/resolveAddressOwner";
import {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController";

const addressRouter = Router();

addressRouter.use(resolveAddressOwner);

addressRouter.post("/", createAddress);
addressRouter.get("/", getAddresses);
addressRouter.put("/:id", updateAddress);
addressRouter.delete("/:id", deleteAddress);

export default addressRouter;
