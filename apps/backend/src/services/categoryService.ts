import Category, { ICategory } from "../models/Categories";

// ===== CREATE ===== //
export async function createCategory(categoryData: ICategory) {
    return await Category.create(categoryData);
}

// ===== GET ALL ===== //
export async function getAllCategories() {
    return await Category.find()
        .populate("parent")
        .sort({ createdAt: -1 });
}

// ===== GET BY ID ===== //
export async function getCategoryById(id: string) {
    const category = await Category.findById(id).populate("parent");
    return handlerNotFound(category, "Category not found");
}

// ===== UPDATE ===== //
export async function updateCategory(id: string, updateData: Partial<ICategory>) {
    const category = await Category.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    }).populate("parent");

    return handlerNotFound(category, "Category not found");
}

// ===== DELETE ===== //
export async function deleteCategory(id: string) {
    const category = await Category.findByIdAndDelete(id);
    return handlerNotFound(category, "Category not found");
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