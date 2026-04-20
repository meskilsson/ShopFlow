import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productsController.ts"

const productRouter = Router();

productRouter.get("/", getAllProducts),
productRouter.get("/:id", getProductById),
productRouter.post("/", createProduct),
productRouter.put("/:id", updateProduct),
productRouter.delete("/:id", deleteProduct)

export default productRouter;