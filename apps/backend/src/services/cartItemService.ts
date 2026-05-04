import CartItem from "../models/CartItem";
import ProductVariant from "../models/ProductVariant";
import type { CartOwner } from "../types/cart.types";
import { createHttpError } from "../middleware/HttpError";
import {
  findCartByOwner,
  formatCartResponse,
  getCartPayload,
} from "./cartService";
import Cart from "../models/Cart";

export type CreateCartItemInput = {
  productVariantId: string;
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
  const productVariant = await ProductVariant.findById(
    item.productVariantId,
  ).populate("product");

  if (!productVariant) {
    throw createHttpError("Product variant not found", 404);
  }

  if (productVariant.inStock === false) {
    throw createHttpError("Product variant is out of stock", 400);
  }

  const product = productVariant.product as unknown as { price: number };

  const existingItem = await CartItem.findOne({
    cart: cart._id,
    productVariant: item.productVariantId,
  });

  if (existingItem) {
    existingItem.quantity += item.quantity;
    await existingItem.save();
  } else {
    await CartItem.create({
      cart: cart._id,
      productVariant: item.productVariantId,
      quantity: item.quantity,
      unitPrice: product.price,
    });
  }

  return formatCartResponse(String(cart._id));
}

export async function updateCartItemQuantity(
  owner: CartOwner,
  productVariantId: string,
  quantity: number,
) {
  const cart = await findCartByOwner(owner);

  if (!cart) {
    throw createHttpError("Cart not found", 404);
  }

  const existingItem = await CartItem.findOne({
    cart: cart._id,
    productVariant: productVariantId,
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

export async function removeCartItem(
  owner: CartOwner,
  productVariantId: string,
) {
  const cart = await findCartByOwner(owner);

  if (!cart) {
    throw createHttpError("Cart not found", 404);
  }

  const deletedItem = await CartItem.findOneAndDelete({
    cart: cart._id,
    productVariant: productVariantId,
  });

  if (!deletedItem) {
    throw createHttpError("Cart item not found", 404);
  }

  return formatCartResponse(String(cart._id));
}
