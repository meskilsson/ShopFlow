export interface AddCartItemInput {
  productVariantId: string;
  name: string;
  price: number;
  quantity: number;
}

export type CartOwner =
  | {
      userId: string;
      sessionId?: never;
    }
  | {
      userId?: never;
      sessionId: string;
    };
