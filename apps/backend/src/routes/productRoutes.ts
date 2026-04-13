import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productsController.ts"

const router = Router();

router.get("/", getAllProducts),
router.get("/:id", getProductById),
router.post("/:id", createProduct),
router.put("/:id", updateProduct),
router.delete("/:id", deleteProduct)

export default router;