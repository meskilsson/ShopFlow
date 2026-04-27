import { createHttpError } from "../middleware/HttpError";
import Address from "../models/Address";
import { CreateAddressData, UpdateAddressData } from "../types/address.types";

export async function createAddress(
  userId: string | undefined,
  addressData: CreateAddressData,
) {
  if (!userId) {
    throw createHttpError("User must be logged in", 401);
  }

  const existingAddress = await Address.findOne({
    user: userId,
    type: addressData.type,
  });

  if (existingAddress) {
    throw createHttpError("Address already exists", 409);
  }

  const address = await Address.create({
    ...addressData,
    user: userId,
  });

  return address;
}

export async function getAddressesByUser(userId: string | undefined) {
  if (!userId) {
    throw createHttpError("User must be logged in", 401);
  }

  const userAddresses = await Address.find({ user: userId });

  return userAddresses;
}

export async function updateAddresses(
  userId: string | undefined,
  addressId: string | undefined,
  updateData: UpdateAddressData,
) {
  if (!userId) {
    throw createHttpError("User must be logged in", 401);
  }

  if (!addressId) {
    throw createHttpError("Address id is required", 400);
  }

  const result = await Address.findOneAndUpdate(
    { user: userId, _id: addressId },
    { $set: updateData },
    { new: true },
  );

  if (!result) {
    throw createHttpError("Address not found", 404);
  }

  return result;
}

export async function deleteAddress(
  userId: string | undefined,
  addressId: string | undefined,
) {
  if (!userId) {
    throw createHttpError("User must be logged in", 401);
  }

  if (!addressId) {
    throw createHttpError("Address id is required", 400);
  }

  const deletedAddress = await Address.findOneAndDelete({
    _id: addressId,
    user: userId,
  });

  if (!deletedAddress) {
    throw createHttpError("Address not found", 404);
  }

  return deletedAddress;
}
