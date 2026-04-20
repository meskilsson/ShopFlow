import Product, { IProduct } from "../models/Products";
import ProductVariant, { IProductVariant } from "../models/ProductVariant";



// ===== CREATE ===== //
export async function createProduct(productData: IProduct) {
    return await Product.create(productData);
}

// ===== CREATE PRODUCT VARIANT ===== //
export async function createProductVariant(productId: string, variantData: IProductVariant) {
    const product = await Product.findById(productId);
    handlerNotFound(product, "Product not found");

    return await ProductVariant.create({
        ...variantData,
        product: productId,
    });
}


// ===== GET ALL  ===== //
export async function getAllProducts() {
    return await Product.find().sort({ createdAt: -1 });
}

// ===== GET ID ===== //
export async function getProductById(id: string) {
    const product = await Product.findById(id);
    const foundProduct = handlerNotFound(product, "Product not found")

    const variants = await ProductVariant.find({ product: id });
    return {
        product: foundProduct, variants,
    };
}

// ===== GET VARIANTID ===== //
export async function getVariantById(variantId: string) {
    const variant = await ProductVariant.findById(variantId).populate("product");
    return handlerNotFound(variant, "Variant not found");
}

// ===== UPDATE ===== //
export async function updateProduct(id: string, updateData: Partial<IProduct>) {
    const product = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
    return handlerNotFound(product, "Product not found")
}


// ===== DELETE ===== //
export async function deleteProduct(id: string) {
    const product = await Product.findByIdAndDelete(id);
    return handlerNotFound(product, "Product not found")
}

// ===== DELETE VARIANT ===== //
export async function deleteVariant(variantId: string) {
    const variant = await ProductVariant.findByIdAndDelete(variantId);
    return handlerNotFound(variant, "Variant not found")
}


function handlerNotFound<T>(item: T | null, message = "Not found"): T {
    if (!item) {
         const error = new Error(message) as Error & {
            statusCode?: number;
        };
        error.statusCode = 404;
        throw error;
    }
    return item;
    }