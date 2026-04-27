export type CartProduct = {
  _id: string;
  name: string;
  price: number;
  category: string;
};

export type CartItem = {
  _id: string;
  product: CartProduct;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type CartResponse = {
  items: CartItem[];
  total: number;
};
