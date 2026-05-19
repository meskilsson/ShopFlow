import Product, { IProduct } from "../models/Products";
import ProductVariant, { IProductVariant } from "../models/ProductVariant";
import type {
    CreateProductInput,
    CreateProductInputVariant,
    ProductQueryInput,
    UpdateProductInput,
    UpdateProductInputVariant,
} from "../schemas/productSchemas";

type ProductFilters = {
    category?: ProductQueryInput["category"];
    search?: ProductQueryInput["search"];
    inStock?: ProductQueryInput["inStock"];
    sort: ProductQueryInput["sort"];
    sortOrder: 1 | -1;
    page: number;
    limit: number;
}

const SIZE_ORDER = ["xs", "s", "m", "l", "xl"];

function createFlexibleSearchRegex(search: string) {
    const normalized = search.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (!normalized) {
        return null;
    }

    const escapedCharacters = normalized
        .split("")
        .map((character) => character.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

    return new RegExp(escapedCharacters.join("[^a-z0-9]*"), "i");
}

function createSearchQuery(search: string) {
    const searchRegexes = search
        .trim()
        .split(/\s+/)
        .map(createFlexibleSearchRegex)
        .filter((regex): regex is RegExp => regex !== null);

    if (searchRegexes.length === 0) {
        return undefined;
    }

    return {
        $and: searchRegexes.map((searchRegex) => ({
            $or: [
                { name: searchRegex },
                { category: searchRegex },
            ],
        })),
    };
}

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
export async function createProduct(productData: CreateProductInput) {
    const product = {
        name: productData.name,
        price: productData.price,
        category: productData.category,
        ...(productData.ProductImage !== undefined && {
            ProductImage: productData.ProductImage,
        }),
    };

    return await Product.create(product);
}

// ===== CREATE PRODUCT VARIANT ===== //
export async function createProductVariant(productId: string, variantData: CreateProductInputVariant) {
    const product = await Product.findById(productId);
    handlerNotFound(product, "Product not found");

    const variant = {
        product: productId,
        size: variantData.size,
        ...(variantData.inStock !== undefined && {
            inStock: variantData.inStock,
        }),
        ...(variantData.sku !== undefined && {
            sku: variantData.sku,
        }),
    };

    return await ProductVariant.create(variant);
}


// ===== GET ALL  ===== //
export async function getAllProducts(filters: ProductFilters) {
    const query: Record<string, unknown> = {};

    if (filters.category) {
        query.category = filters.category;
    }

    if (filters.search) {
        const searchQuery = createSearchQuery(filters.search);

        if (searchQuery) {
            query.$and = searchQuery.$and;
        }
    }

    if (filters.inStock !== undefined) {
        query.inStock = filters.inStock === "true";
    }

    const sortField = typeof filters.sort === "string" ? filters.sort : "createdAt";

    const products = await Product.find(query)
        .sort({ [sortField]: filters.sortOrder })
        .skip((filters.page - 1) * filters.limit)
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
export async function updateProduct(id: string, updateData: UpdateProductInput) {
    const productUpdate: Partial<IProduct> = {};

    if (updateData.name !== undefined) productUpdate.name = updateData.name;
    if (updateData.price !== undefined) productUpdate.price = updateData.price;
    if (updateData.category !== undefined) productUpdate.category = updateData.category;
    if (updateData.ProductImage !== undefined) productUpdate.ProductImage = updateData.ProductImage;

    const product = await Product.findByIdAndUpdate(id, productUpdate, {
        new: true,
        runValidators: true,
    });
    return handlerNotFound(product, "Product not found")
}

// ===== UPDATE VARIANT ===== //
export async function updateVariant(variantId: string, updateData: UpdateProductInputVariant) {
    const variantUpdate: Partial<IProductVariant> = {};

    if (updateData.size !== undefined) variantUpdate.size = updateData.size;
    if (updateData.inStock !== undefined) variantUpdate.inStock = updateData.inStock;
    if (updateData.sku !== undefined) variantUpdate.sku = updateData.sku;

    const variant = await ProductVariant.findByIdAndUpdate(variantId, variantUpdate, {
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
