export type AddressType = "shipping" | "billing";

export type Address = {
  _id: string;
  user: string;
  full_name: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  type: AddressType;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateAddressData = {
  full_name: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  type: AddressType;
};

export type UpdateAddressData = Partial<
  Pick<
    CreateAddressData,
    "full_name" | "street" | "city" | "postal_code" | "country"
  >
>;
