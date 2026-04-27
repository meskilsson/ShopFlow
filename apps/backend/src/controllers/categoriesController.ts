import { Request, Response, NextFunction } from "express";
import * as categoryService from "../services/categoryService";

type CategoryIdParams = {
    id: string;
};

// ===== CREATE ===== //
export async function createCategory(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
}

// ===== GET ALL ===== //
export async function getAllCategories(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
}

// ===== GET BY ID ===== //
export async function getCategoryById(
    req: Request<CategoryIdParams>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
}

// ===== UPDATE ===== //
export async function updateCategory(
    req: Request<CategoryIdParams>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const updatedCategory = await categoryService.updateCategory(
            req.params.id,
            req.body
        );
        res.status(200).json(updatedCategory);
    } catch (error) {
        next(error);
    }
}

// ===== DELETE ===== //
export async function deleteCategory(
    req: Request<CategoryIdParams>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await categoryService.deleteCategory(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}