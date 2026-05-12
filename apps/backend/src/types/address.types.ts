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
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  type: AddressType;
}

export interface CreateAddressData {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  type: AddressType;
}

export interface UpdateAddressData {
  fullName?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
};
