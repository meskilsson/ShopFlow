import Product, { IProduct } from "../models/Products";



// ===== CREATE ===== //
export async function createProduct(productData: IProduct) {
    return await Product.create(productData);
}


// ===== GET ALL  ===== //
export async function getAllProducts() {
    return await Product.find().sort({ createdAt: -1 });
}


// ===== GET ID ===== //
export async function getProductById(id: string) {
    const product = await Product.findById(id);
    return handlerNotFound(product, "Product not found")
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