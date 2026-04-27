import { Router } from "express";
import {
    getAllBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand
} from "../controllers/brandsController";

const brandRouter = Router();

brandRouter.get("/", getAllBrands);
brandRouter.get("/:id", getBrandById);
brandRouter.post("/", createBrand);
brandRouter.put("/:id", updateBrand);
brandRouter.delete("/:id", deleteBrand);

export default brandRouter;