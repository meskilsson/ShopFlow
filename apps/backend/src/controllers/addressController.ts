import { Request, Response, NextFunction } from "express";
import * as addressService from "../services/addressService";
import { getAddressOwner } from "../utils/getAddressOwner";
import type {
  AddressIdParam,
  CreateAddressData,
  UpdateAddressData,
} from "../schemas/adressValidation";

export async function createAddress(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = req.validatedBody as CreateAddressData;

    const address = await addressService.createAddress(
      getAddressOwner(res),
      body,
    );

    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
}
export async function getAddresses(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const addresses = await addressService.getAddressesByOwner(
      getAddressOwner(res),
    );
    res.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
}
export async function updateAddress(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = req.validatedParams as AddressIdParam;
    const updateData = req.validatedBody as UpdateAddressData;

    const address = await addressService.updateAddresses(
      getAddressOwner(res),
      params.id,
      updateData,
    );

    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
}
export async function deleteAddress(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = req.validatedParams as AddressIdParam;
    const address = await addressService.deleteAddress(
      getAddressOwner(res),
      params.id,
    );

    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
}
