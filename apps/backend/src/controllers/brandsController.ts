import { Request, Response, NextFunction } from "express";
import * as brandService from "../services/brandService";

type BrandIdParams = {
    id: string;
};

// ===== CREATE ===== //
export async function createBrand(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const brand = await brandService.createBrand(req.body);
        res.status(201).json(brand);
    } catch (error) {
        next(error);
    }
}

// ===== GET ALL ===== //
export async function getAllBrands(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const brands = await brandService.getAllBrands();
        res.status(200).json(brands);
    } catch (error) {
        next(error);
    }
}

// ===== GET BY ID ===== //
export async function getBrandById(
    req: Request<BrandIdParams>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const brand = await brandService.getBrandById(req.params.id);
        res.status(200).json(brand);
    } catch (error) {
        next(error);
    }
}

// ===== UPDATE ===== //
export async function updateBrand(
    req: Request<BrandIdParams>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const updatedBrand = await brandService.updateBrand(
            req.params.id,
            req.body
        );
        res.status(200).json(updatedBrand);
    } catch (error) {
        next(error);
    }
}

// ===== DELETE ===== //
export async function deleteBrand(
    req: Request<BrandIdParams>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await brandService.deleteBrand(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}