import Cart, { ICartItem } from "../models/Cart";

export type CartOwner =
  | {
      userId: string;
      sessionId?: never;
    }
  | {
      userId?: never;
      sessionId: string;
    };

function createHttpError(message: string, statusCode: number): Error & {
  statusCode?: number;
} {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

function getCartQuery(owner: CartOwner) {
  return owner.userId ? { user: owner.userId } : { sessionId: owner.sessionId };
}

function getCartPayload(owner: CartOwner, items: ICartItem[] = []) {
  return owner.userId
    ? { user: owner.userId, items }
    : { sessionId: owner.sessionId, items };
}

export async function getCartByOwner(owner: CartOwner) {
  const cart = await Cart.findOne(getCartQuery(owner));

  if (!cart) {
    throw createHttpError("Cart not found", 404);
  }

  return cart;
}

export async function createCart(owner: CartOwner, items: ICartItem[] = []) {
  const existingCart = await Cart.findOne(getCartQuery(owner));

  if (existingCart) {
    throw createHttpError("Cart already exists for this owner", 409);
  }

  return await Cart.create(getCartPayload(owner, items));
}

export async function addItemToCart(owner: CartOwner, item: ICartItem) {
  let cart = await Cart.findOne(getCartQuery(owner));

  if (!cart) {
    cart = await Cart.create(getCartPayload(owner, [item]));

    return cart;
  }

  const existingItem = cart.items.find(
    (cartItem) => cartItem.productId === item.productId,
  );

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.items.push(item);
  }

  await cart.save();

  return cart;
}

export async function updateCartItemQuantity(
  owner: CartOwner,
  productId: string,
  quantity: number,
) {
  const cart = await Cart.findOne(getCartQuery(owner));

  if (!cart) {
    throw createHttpError("Cart not found", 404);
  }

  const existingItem = cart.items.find((item) => item.productId === productId);

  if (!existingItem) {
    throw createHttpError("Cart item not found", 404);
  }

  existingItem.quantity = quantity;
  await cart.save();

  return cart;
}

export async function removeCartItem(owner: CartOwner, productId: string) {
  const cart = await Cart.findOne(getCartQuery(owner));

  if (!cart) {
    throw createHttpError("Cart not found", 404);
  }

  const nextItems = cart.items.filter((item) => item.productId !== productId);

  if (nextItems.length === cart.items.length) {
    throw createHttpError("Cart item not found", 404);
  }

  cart.items = nextItems;
  await cart.save();

  return cart;
}

export async function clearCart(owner: CartOwner) {
  const cart = await Cart.findOne(getCartQuery(owner));

  if (!cart) {
    throw createHttpError("Cart not found", 404);
  }

  cart.items = [];
  await cart.save();

  return cart;
}
