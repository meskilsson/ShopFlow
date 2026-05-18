import Product, { IProduct } from "../models/Products";
import ProductVariant, { IProductVariant } from "../models/ProductVariant";

type ProductFilters = {
    category?: unknown;
    inStock?: unknown;
    sort?: unknown;
    sortOrder: 1 | -1;
    page: number;
    limit: number;
}

const SIZE_ORDER = ["xs", "s", "m", "l", "xl"];

function sortBySizeOrder(variants: IProductVariant[]) {
    return variants.sort((a, b) => {
        const aIndex = SIZE_ORDER.indexOf(a.size.toLowerCase());
        const bIndex = SIZE_ORDER.indexOf(b.size.toLowerCase());

        const safeAIndex = aIndex === -1 ? SIZE_ORDER.length : aIndex;
        const safeBIndex = bIndex === -1 ? SIZE_ORDER.length : bIndex;

        return safeAIndex - safeBIndex;
    });
}

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
export async function getAllProducts(filters: ProductFilters) {
    const query: Record<string, unknown> = {};

    if (filters.category) {
        query.category = filters.category;
    }

    if (filters.inStock !== undefined) {
        query.inStock = filters.inStock === "true";
    }

    const sortField = typeof filters.sort === "string" ? filters.sort : "createdAt";

    const products = await Product.find(query)
        .sort({ [sortField]: filters.sortOrder })
        .skip((filters.page -1) * filters.limit)
        .limit(filters.limit);

    const productsWithVariants = await Promise.all(
        products.map(async (product) => {
            const variants = await ProductVariant.countDocuments({ product: product._id });

            return {
                ...product.toObject(),
                variants,
            };
        }),
    );

    const total = await Product.countDocuments(query);

    return {
        data: productsWithVariants,
        meta: {
            page: filters.page,
            limit: filters.limit,
            total,
            totalPages: Math.ceil(total / filters.limit),
        },
    };
}

// ===== GET ID ===== //
export async function getProductById(id: string) {
    const product = await Product.findById(id);
    const foundProduct = handlerNotFound(product, "Product not found")

    const variants = await ProductVariant.find({ product: id });
    return {
        product: foundProduct,
        variants: sortBySizeOrder(variants),
    };
}

// ===== GET PRODUCT VARIANTS ===== //
export async function getProductVariants(productId: string) {
    const product = await Product.findById(productId);
    handlerNotFound(product, "Product not found");

    const variants = await ProductVariant.find({ product: productId });
    return sortBySizeOrder(variants);
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

// ===== UPDATE VARIANT ===== //
export async function updateVariant(variantId: string, updateData: Partial<IProductVariant>) {
    const variant = await ProductVariant.findByIdAndUpdate(variantId, updateData, {
        new: true,
        runValidators: true,
    });
    return handlerNotFound(variant, "Variant not found")
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
