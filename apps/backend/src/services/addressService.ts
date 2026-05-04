import { createHttpError } from "../middleware/HttpError";
import Address from "../models/Address";
import type {
  AddressOwner,
  CreateAddressData,
  UpdateAddressData,
} from "../types/address.types";

function getAddressQuery(owner: AddressOwner) {
  return "userId" in owner
    ? { user: owner.userId }
    : { sessionId: owner.sessionId };
}

export async function createAddress(
  owner: AddressOwner,
  addressData: CreateAddressData,
) {
  const existingAddress = await Address.findOne({
    ...getAddressQuery(owner),
    type: addressData.type,
  });

  if (existingAddress) {
    throw createHttpError("Address already exists", 409);
  }

  const address = await Address.create({
    ...addressData,
    ...getAddressQuery(owner),
  });

  return address;
}

export async function getAddressesByOwner(owner: AddressOwner) {
  const userAddresses = await Address.find(getAddressQuery(owner));

  return userAddresses;
}

export async function updateAddresses(
  owner: AddressOwner,
  addressId: string | undefined,
  updateData: UpdateAddressData,
) {
  if (!addressId) {
    throw createHttpError("Address id is required", 400);
  }

  const result = await Address.findOneAndUpdate(
    { ...getAddressQuery(owner), _id: addressId },
    { $set: updateData },
    { new: true },
  );

  if (!result) {
    throw createHttpError("Address not found", 404);
  }

  return result;
}

export async function deleteAddress(
  owner: AddressOwner,
  addressId: string | undefined,
) {
  if (!addressId) {
    throw createHttpError("Address id is required", 400);
  }

  const deletedAddress = await Address.findOneAndDelete({
    _id: addressId,
    ...getAddressQuery(owner),
  });

  if (!deletedAddress) {
    throw createHttpError("Address not found", 404);
  }

  return deletedAddress;
}
