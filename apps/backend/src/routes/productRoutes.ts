import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductVariant,
    getProductVariants,
    getVariantById,
    deleteVariant,
    updateVariant
} from "../controllers/productsController.ts"

const productRouter = Router();

productRouter.get("/", getAllProducts),
productRouter.get("/:id", getProductById),
productRouter.post("/", createProduct),
productRouter.patch("/:id", updateProduct),
productRouter.delete("/:id", deleteProduct)

// ===== VARIANT ===== //
productRouter.get("/:id/variants", getProductVariants)
productRouter.get("/variants/:variantId", getVariantById),
productRouter.post("/:id/variants", createProductVariant)
productRouter.patch("/variants/:variantId", updateVariant),
productRouter.delete("/variants/:variantId", deleteVariant)


export default productRouter;
