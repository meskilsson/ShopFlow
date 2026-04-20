import { Request, Response, NextFunction} from "express"
import * as productService from "../services/productService";

type ProductIdParams = {
  id: string;
};

// ===== CREATE ===== //
export async function createProduct(
    req: Request, 
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
}

// ===== CREATE PRODUCT VARIANT ===== //
export async function createProductVariant(
    req: Request<{id: string}>,
    res: Response, 
    next: NextFunction,
): Promise<void> {
    try {
        const variant = await productService.createProductVariant(
            req.params.id,
            req.body,
        );
        res.status(201).json(variant);
    } catch (error) {
        next(error);
    }
}

// ===== GET ALL ===== //
export async function getAllProducts(
    _req: Request, 
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
}

// ===== GET ID ===== //
export async function getProductById(
    req: Request<ProductIdParams>, 
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}

// ===== GET VARIANTID ===== //
export async function getVariantById(
    req: Request<{ variantId: string }>,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const variant = await productService.getVariantById(req.params.variantId);
        res.status(200).json(variant);
    } catch (error) {
        next(error);
    }
}

// ===== UPDATE ===== //
export async function updateProduct(
    req: Request<ProductIdParams>, 
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const updatedProduct = await productService.updateProduct(
            req.params.id,
            req.body,
        );
        res.status(200).json(updatedProduct);
    } catch (error) {
        next(error);
    }
}

// ===== DELETE ===== //
export async function deleteProduct(
    req: Request<ProductIdParams>, 
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        await productService.deleteProduct(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

// ===== DELETE VARIANT ===== //
export async function deleteVariant(
    req: Request<ProductIdParams>, 
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        await productService.deleteVariant(req.params.variantId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

