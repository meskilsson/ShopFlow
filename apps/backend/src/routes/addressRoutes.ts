import { Router } from "express";
import resolveAddressOwner from "../middleware/resolveAddressOwner";
import {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController";
import {
  addressDataSchema,
  updateAddressDataSchema,
  idParamSchema,
} from "../schemas/adressValidation";
import { validateRequest } from "../middleware/validate";

const addressRouter = Router();

addressRouter.use(resolveAddressOwner);

addressRouter.post(
  "/",
  validateRequest({ body: addressDataSchema }),
  createAddress,
);
addressRouter.get("/", getAddresses);
addressRouter.put(
  "/:id",
  validateRequest({ body: updateAddressDataSchema, params: idParamSchema }),
  updateAddress,
);
addressRouter.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  deleteAddress,
);

export default addressRouter;
