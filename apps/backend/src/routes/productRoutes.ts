import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductVariant,
    getVariantById,
    deleteVariant,
    updateVariant
} from "../controllers/productsController.ts"

const productRouter = Router();

productRouter.get("/", getAllProducts),
productRouter.get("/:id", getProductById),
productRouter.post("/", createProduct),
productRouter.put("/:id", updateProduct),
productRouter.delete("/:id", deleteProduct)

// ===== VARIANT ===== //
productRouter.get("/variants/:variantId", getVariantById),
productRouter.post("/:id/variants", createProductVariant)
productRouter.put("/variants/:variantId", updateVariant),
productRouter.delete("/variants/:variantId", deleteVariant)


export default productRouter;