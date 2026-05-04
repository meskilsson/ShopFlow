export type CartProduct = {
  _id: string;
  name: string;
  price: number;
  category: string;
  ProductImage?: string;
};

export type CartProductVariant = {
  _id: string;
  color: string;
  size: string;
  inStock?: boolean;
  sku?: string;
};

export type CartItem = {
  _id: string;
  product: CartProduct;
  productVariant: CartProductVariant;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type CartResponse = {
  items: CartItem[];
  total: number;
};
