import CartItem from "../models/CartItem";
import ProductVariant from "../models/ProductVariant";
import type { CartOwner } from "../types/cart.types";
import {
  findCartByOwner,
  formatCartResponse,
  getCartPayload,
} from "./cartService";
import Cart from "../models/Cart";
import { NotFoundError, ValidationError } from "../errors/AppError";

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
  if (!Types.ObjectId.isValid(item.productVariantId)) {
    throw createHttpError("Product variant id is invalid", 400);
  }

  if (!Number.isInteger(item.quantity) || item.quantity < 1) {
    throw createHttpError("Quantity must be at least 1", 400);
  }

  const cart = await getOrCreateCart(owner);
  const productVariant = await ProductVariant.findById(
    item.productVariantId,
  ).populate("product", "price");

  if (!productVariant) {
    throw new NotFoundError("Product variant not found");
  }

  if (productVariant.inStock === false) {
    throw new ValidationError("Product variant is out of stock");
  }

  const product = productVariant.product as unknown as { price?: unknown } | null;

  if (!product || typeof product.price !== "number") {
    throw new NotFoundError("Product for variant not found");
  }

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
    throw new NotFoundError("Cart not found");
  }

  const existingItem = await CartItem.findOne({
    cart: cart._id,
    productVariant: productVariantId,
  });

  if (!existingItem) {
    throw new NotFoundError("Cart item not found");
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
    throw new NotFoundError("Cart not found");
  }

  const deletedItem = await CartItem.findOneAndDelete({
    cart: cart._id,
    productVariant: productVariantId,
  });

  if (!deletedItem) {
    throw new NotFoundError("Cart item not found");
  }

  return formatCartResponse(String(cart._id));
}
