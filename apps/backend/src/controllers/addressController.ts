import { Request, Response, NextFunction } from "express";
import * as addressService from "../services/addressService";
import { UpdateAddressData, CreateAddressData } from "../types/address.types";
import { getAddressOwner } from "../utils/getAddressOwner";

export async function createAddress(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const addressData: CreateAddressData = req.body;

    const address = await addressService.createAddress(
      getAddressOwner(res),
      addressData,
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
    const addressId =
      typeof req.params.id === "string" ? req.params.id : undefined;
    const updateData: UpdateAddressData = req.body;

    const address = await addressService.updateAddresses(
      getAddressOwner(res),
      addressId,
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
    const addressId =
      typeof req.params.id === "string" ? req.params.id : undefined;
    const address = await addressService.deleteAddress(
      getAddressOwner(res),
      addressId,
    );

    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
}
