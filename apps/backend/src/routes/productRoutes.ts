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
    updateVariant,
    uploadProductImageController,
} from "../controllers/productsController.ts"
import { validateRequest } from "../middleware/validate.ts";
import { requireAuth } from "../middleware/requireAuth.ts";
import { authorizeRoles } from "../middleware/authorizeRoles.ts";
import { upload } from "../middleware/upload.ts";
import {
    productIdParamsSchema,
    variantIdParamsSchema,
    productQuerySchema,
    createProductSchema,
    updateProductSchema,
    createProductVariantSchema,
    updateProductVariantSchema,
} from "../schemas/productSchemas.ts"

const productRouter = Router();

// Must be before /:id to avoid route collision
productRouter.post(
    "/upload-image",
    requireAuth,
    authorizeRoles("seller", "admin"),
    upload.single("image"),
    uploadProductImageController,
);

productRouter.get(
    "/",
    validateRequest({ query: productQuerySchema }),
    getAllProducts),
    productRouter.get(
        "/:id",
        validateRequest({ params: productIdParamsSchema }),
        getProductById),

    productRouter.post(
        "/",
        validateRequest({ body: createProductSchema }),
        createProduct),

    productRouter.patch(
        "/:id",
        validateRequest({
            params: productIdParamsSchema,
            body: updateProductSchema,
        }),
        updateProduct),

    productRouter.delete(
        "/:id",
        validateRequest({ params: productIdParamsSchema }),
        deleteProduct)

// ===== VARIANT ===== //
productRouter.get(
    "/:id/variants",
    validateRequest({ params: productIdParamsSchema }),
    getProductVariants),

    productRouter.get(
        "/variants/:variantId",
        validateRequest({ params: variantIdParamsSchema }),
        getVariantById),

    productRouter.post(
        "/:id/variants",
        validateRequest({
            params: productIdParamsSchema,
            body: createProductVariantSchema
        }),
        createProductVariant),

    productRouter.patch(
        "/variants/:variantId",
        validateRequest({
            params: variantIdParamsSchema,
            body: updateProductVariantSchema
        }),
        updateVariant),

    productRouter.delete(
        "/variants/:variantId",
        validateRequest({ params: variantIdParamsSchema }),
        deleteVariant)


export default productRouter;
