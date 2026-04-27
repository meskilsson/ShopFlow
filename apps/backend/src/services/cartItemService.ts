import CartItem from "../models/CartItem";
import Product from "../models/Products";
import type { CartOwner } from "../types/cart.types";
import { createHttpError } from "../middleware/HttpError";
import {
  findCartByOwner,
  formatCartResponse,
  getCartPayload,
} from "./cartService";
import Cart from "../models/Cart";

export type CreateCartItemInput = {
  productId: string;
  quantity: number;
};

async function getOrCreateCart(owner: CartOwner) {
  const existingCart = await findCartByOwner(owner);

  if (existingCart) {
    return existingCart;
  }

  return Cart.create(getCartPayload(owner));
}

export async function addItemToCart(
  owner: CartOwner,
  item: CreateCartItemInput,
) {
  if (item.quantity < 1) {
    throw createHttpError("Quantity must be at least 1", 400);
  }
  const cart = await getOrCreateCart(owner);
  const product = await Product.findById(item.productId);

  if (!product) {
    throw createHttpError("Product not found", 404);
  }

  const existingItem = await CartItem.findOne({
    cart: cart._id,
    productId: item.productId,
  });

  if (existingItem) {
    existingItem.quantity += item.quantity;
    await existingItem.save();
  } else {
    await CartItem.create({
      cart: cart._id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: product.price,
    });
  }

  return formatCartResponse(String(cart._id));
}

export async function updateCartItemQuantity(
  owner: CartOwner,
  productId: string,
  quantity: number,
) {
  const cart = await findCartByOwner(owner);

  if (!cart) {
    throw createHttpError("Cart not found", 404);
  }

  const existingItem = await CartItem.findOne({
    cart: cart._id,
    productId,
  });

  if (!existingItem) {
    throw createHttpError("Cart item not found", 404);
  }

  if (quantity <= 0) {
    await existingItem.deleteOne();
    return formatCartResponse(String(cart._id));
  }

  existingItem.quantity = quantity;
  await existingItem.save();

  return formatCartResponse(String(cart._id));
}

export async function removeCartItem(owner: CartOwner, productId: string) {
  const cart = await findCartByOwner(owner);

  if (!cart) {
    throw createHttpError("Cart not found", 404);
  }

  const deletedItem = await CartItem.findOneAndDelete({
    cart: cart._id,
    productId,
  });

  if (!deletedItem) {
    throw createHttpError("Cart item not found", 404);
  }

  return formatCartResponse(String(cart._id));
}
