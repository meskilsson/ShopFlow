import Address from "../models/Address";
import type { AddressOwner } from "../types/address.types";
import { ValidationError, NotFoundError, ConflictError } from "../errors/AppError";

import type {
  CreateAddressData,
  UpdateAddressData,
} from "../schemas/adressValidation";

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
    throw new ConflictError("Address already exists");
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
    throw new ValidationError("Address id is required");
  }

  const result = await Address.findOneAndUpdate(
    { ...getAddressQuery(owner), _id: addressId },
    { $set: updateData },
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new NotFoundError("Address not found");
  }

  return result;
}

export async function deleteAddress(
  owner: AddressOwner,
  addressId: string | undefined,
) {
  if (!addressId) {
    throw new ValidationError("Address id is required");
  }

  const deletedAddress = await Address.findOneAndDelete({
    _id: addressId,
    ...getAddressQuery(owner),
  });

  if (!deletedAddress) {
    throw new NotFoundError("Address not found");
  }

  return deletedAddress;
}
