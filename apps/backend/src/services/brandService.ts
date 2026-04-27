import Brand, { IBrand } from "../models/Brands";

// ===== CREATE ===== //
export async function createBrand(brandData: IBrand) {
    return await Brand.create(brandData);
}

// ===== GET ALL ===== //
export async function getAllBrands() {
    return await Brand.find().sort({ createdAt: -1 });
}

// ===== GET BY ID ===== //
export async function getBrandById(id: string) {
    const brand = await Brand.findById(id);
    return handlerNotFound(brand, "Brand not found");
}

// ===== UPDATE ===== //
export async function updateBrand(id: string, updateData: Partial<IBrand>) {
    const brand = await Brand.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
    return handlerNotFound(brand, "Brand not found");
}

// ===== DELETE ===== //
export async function deleteBrand(id: string) {
    const brand = await Brand.findByIdAndDelete(id);
    return handlerNotFound(brand, "Brand not found");
}

// ===== ERROR HANDLER ===== //
function handlerNotFound<T>(item: T | null, message = "Not found"): T {
    if (!item) {
        const error = new Error(message) as Error & { statusCode?: number };
        error.statusCode = 404;
        throw error;
    }
    return item;
}