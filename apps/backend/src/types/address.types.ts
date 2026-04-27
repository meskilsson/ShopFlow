import { Types } from "mongoose";

export type AddressType = "shipping" | "billing";

export interface IAddress {
  user: Types.ObjectId;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  type: AddressType;
}

export interface CreateAddressData {
  street: string;
  city: string;
  postal_code: string;
  country: string;
  type: AddressType;
}

export interface UpdateAddressData {
  street?: string;
  city?: string;
  postal_code?: string;
  country?: string;
};