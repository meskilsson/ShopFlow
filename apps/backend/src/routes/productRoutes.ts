import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    getMyProducts,
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

import { requireProductOwnerOrRole } from "../middleware/requireProductOwnerOrRole.ts";

const productRouter = Router();

// Must be before /:id to avoid route collision
productRouter.get(
    "/mine",
    requireAuth,
    authorizeRoles("seller", "admin"),
    getMyProducts,
);

productRouter.post(
    "/upload-image",
    requireAuth,
    authorizeRoles("seller", "admin"),
    upload.single("image"),
    uploadProductImageController,
);

// ===== PUBLIC PRODUCT ROUTES ===== //

productRouter.get(
    "/",
    validateRequest({ query: productQuerySchema }),
    getAllProducts);


productRouter.get(
    "/:id",
    validateRequest({ params: productIdParamsSchema }),
    getProductById);

// ===== PROTECTED PRODUCT ROUTES ===== //

productRouter.post(
    "/",
    requireAuth,
    authorizeRoles("admin", "seller"),
    validateRequest({ body: createProductSchema }),
    createProduct);

productRouter.patch(
    "/:id",
    requireAuth,
    validateRequest({
        params: productIdParamsSchema,
        body: updateProductSchema,
    }),
    requireProductOwnerOrRole("admin"),
    updateProduct);

productRouter.delete(
    "/:id",
    requireAuth,
    validateRequest({ params: productIdParamsSchema }),
    requireProductOwnerOrRole("admin"),
    deleteProduct);

// ===== VARIANT ===== //
productRouter.get(
    "/:id/variants",
    validateRequest({ params: productIdParamsSchema }),
    getProductVariants);

productRouter.get(
    "/variants/:variantId",
    validateRequest({ params: variantIdParamsSchema }),
    getVariantById);

// ===== PROTECTED VARIANT ROUTES ===== //

productRouter.post(
    "/:id/variants",
    requireAuth,
    validateRequest({
        params: productIdParamsSchema,
        body: createProductVariantSchema
    }),
    requireProductOwnerOrRole("admin"),
    createProductVariant);

productRouter.patch(
    "/variants/:variantId",
    requireAuth,
    authorizeRoles("admin"),
    validateRequest({
        params: variantIdParamsSchema,
        body: updateProductVariantSchema
    }),
    updateVariant);

productRouter.delete(
    "/variants/:variantId",
    requireAuth,
    authorizeRoles("seller", "admin"),
    validateRequest({ params: variantIdParamsSchema }),
    deleteVariant);


export default productRouter;
