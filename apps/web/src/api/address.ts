import { apiFetch } from "./client";
import type {
  Address,
  CreateAddressData,
  UpdateAddressData,
} from "@/features/address/address.types";

export function getAddresses(): Promise<Address[]> {
  return apiFetch("/address");
}

export function createAddress(address: CreateAddressData): Promise<Address> {
  return apiFetch("/address", {
    method: "POST",
    body: JSON.stringify(address),
  });
}

export function updateAddress(
  addressId: string,
  address: UpdateAddressData,
): Promise<Address> {
  return apiFetch(`/address/${addressId}`, {
    method: "PUT",
    body: JSON.stringify(address),
  });
}

export function deleteAddress(addressId: string): Promise<Address> {
  return apiFetch(`/address/${addressId}`, {
    method: "DELETE",
  });
}
