import { Types } from "mongoose";

export type AddressType = "shipping" | "billing";

export type AddressOwner =
  | {
      userId: string;
      sessionId?: never;
    }
  | {
      userId?: never;
      sessionId: string;
    };

export interface IAddress {
  user?: Types.ObjectId;
  sessionId?: string;
  full_name: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  type: AddressType;
}

export interface CreateAddressData {
  full_name: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  type: AddressType;
}

export interface UpdateAddressData {
  full_name?: string;
  street?: string;
  city?: string;
  postal_code?: string;
  country?: string;
};
