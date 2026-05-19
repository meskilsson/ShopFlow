import { Request, Response, NextFunction } from "express"
import * as productService from "../services/productService";
import { uploadProductImage } from "../services/imageService";
import type {
    ProductIdParams,
    VariantIdParams,
    ProductQueryInput,
    CreateProductInput,
    UpdateProductInput,
    CreateProductInputVariant,
    UpdateProductInputVariant
} from "../schemas/productSchemas";

// ===== CREATE ===== //
export async function createProduct(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const body = req.validatedBody as CreateProductInput;
        const product = await productService.createProduct(body);

        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
}

// ===== CREATE PRODUCT VARIANT ===== //
export async function createProductVariant(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const params = req.validatedParams as ProductIdParams;
        const body = req.validatedBody as CreateProductInputVariant;

        const variant = await productService.createProductVariant(
            params.id,
            body
        )
        res.status(201).json(variant);
    } catch (error) {
        next(error);
    }
}

// ===== GET ALL ===== //
export async function getAllProducts(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const query = req.validatedQuery as ProductQueryInput;
        const sortOrder = query.order === "desc" ? -1 : 1;

        const result = await productService.getAllProducts({
            category: query.category,
            inStock: query.inStock,
            sort: query.sort,
            sortOrder,
            page: query.page,
            limit: query.limit,
        });

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

// ===== GET ID ===== //
export async function getProductById(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const params = req.validatedParams as ProductIdParams;
        const product = await productService.getProductById(params.id);

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}

// ===== GET PRODUCT VARIANTS ===== //
export async function getProductVariants(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const params = req.validatedParams as ProductIdParams;
        const variants = await productService.getProductVariants(params.id);

        res.status(200).json(variants);
    } catch (error) {
        next(error);
    }
}

// ===== GET VARIANTID ===== //
export async function getVariantById(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const params = req.validatedParams as VariantIdParams;
        const variant = await productService.getVariantById(params.variantId);

        res.status(200).json(variant);
    } catch (error) {
        next(error);
    }
}

// ===== UPDATE ===== //
export async function updateProduct(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const params = req.validatedParams as ProductIdParams;
        const body = req.validatedBody as UpdateProductInput;

        const updatedProduct = await productService.updateProduct(
            params.id,
            body
        );

        res.status(200).json(updatedProduct);
    } catch (error) {
        next(error);
    }
}

// ===== UPDATE VARIANT ===== //
export async function updateVariant(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const params = req.validatedParams as VariantIdParams;
        const body = req.validatedBody as UpdateProductInputVariant;

        const updatedVariant = await productService.updateVariant(
            params.variantId,
            body
        )
        res.status(200).json(updatedVariant);
    } catch (error) {
        next(error);
    }
}

// ===== DELETE ===== //
export async function deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const params = req.validatedParams as ProductIdParams;
        await productService.deleteProduct(params.id);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

// ===== DELETE VARIANT ===== //
export async function deleteVariant(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const params = req.validatedParams as VariantIdParams;
        await productService.deleteVariant(params.variantId);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

// ===== UPLOAD PRODUCT IMAGE ===== //
export async function uploadProductImageController(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No image file provided" });
            return;
        }

        const url = await uploadProductImage(req.file);
        res.status(200).json({ url });
    } catch (error) {
        next(error);
    }
}

