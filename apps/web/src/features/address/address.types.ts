export type AddressType = "shipping" | "billing";

export type Address = {
  _id: string;
  user: string;
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  type: AddressType;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateAddressData = {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  type: AddressType;
};

export type UpdateAddressData = Partial<
  Pick<
    CreateAddressData,
    "fullName" | "street" | "city" | "postalCode" | "country"
  >
>;
