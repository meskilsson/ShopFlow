import Cart from "../models/Cart";
import CartItem from "../models/CartItem";
import type { CartOwner } from "../types/cart.types";
import { createHttpError } from "../middleware/HttpError";

export function getCartQuery(owner: CartOwner) {
  return "userId" in owner ? { user: owner.userId } : { sessionId: owner.sessionId };
}

export function getCartPayload(owner: CartOwner) {
  return "userId" in owner ? { user: owner.userId } : { sessionId: owner.sessionId };
}

export async function findCartByOwner(owner: CartOwner) {
  return Cart.findOne(getCartQuery(owner));
}

export async function mergeCartOwners(
  sourceOwner: CartOwner,
  targetOwner: CartOwner,
) {
  const sourceCart = await findCartByOwner(sourceOwner);

  if (!sourceCart) {
    return findCartByOwner(targetOwner);
  }

  const targetCart = await findCartByOwner(targetOwner);

  if (!targetCart) {
    sourceCart.set(getCartPayload(targetOwner));

    if ("userId" in targetOwner) {
      sourceCart.set("sessionId", undefined);
    }

    await sourceCart.save();
    return sourceCart;
  }

  if (String(sourceCart._id) === String(targetCart._id)) {
    return targetCart;
  }

  const sourceItems = await CartItem.find({ cart: sourceCart._id });

  for (const sourceItem of sourceItems) {
    const existingTargetItem = await CartItem.findOne({
      cart: targetCart._id,
      productVariant: sourceItem.productVariant,
    });

    if (existingTargetItem) {
      existingTargetItem.quantity += sourceItem.quantity;
      await existingTargetItem.save();
      await sourceItem.deleteOne();
      continue;
    }

    sourceItem.cart = targetCart._id;
    await sourceItem.save();
  }

  await sourceCart.deleteOne();

  return targetCart;
}

export async function formatCartResponse(cartId: string) {
  const cart = await Cart.findById(cartId).select("-__v").lean();

  if (!cart) {
    throw createHttpError("Cart not found", 404);
  }

  const items = await CartItem.find({ cart: cart._id })
    .select("-cart -__v")
    .populate({
      path: "productVariant",
      select: "product color size inStock sku",
      populate: {
        path: "product",
        select: "name price category ProductImage",
      },
    })
    .lean();

  const formattedItems = items.map((item) => {
    const productVariant = item.productVariant as unknown as {
      _id: unknown;
      color: string;
      size: string;
      inStock?: boolean;
      sku?: string;
      product: unknown;
    };

    return {
      _id: item._id,
      productVariant: {
        _id: productVariant._id,
        color: productVariant.color,
        size: productVariant.size,
        inStock: productVariant.inStock,
        sku: productVariant.sku,
      },
      product: productVariant.product,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.unitPrice * item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  });

  const total = formattedItems.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    ...cart,
    items: formattedItems,
    total,
  };
}

export async function getCartByOwner(owner: CartOwner) {
  const cart = await findCartByOwner(owner);

  if (!cart) {
    throw createHttpError("Cart not found", 404);
  }

  return formatCartResponse(String(cart._id));
}

export async function createCart(owner: CartOwner) {
  const existingCart = await findCartByOwner(owner);

  if (existingCart) {
    throw createHttpError("Cart already exists for this owner", 409);
  }

  const cart = await Cart.create(getCartPayload(owner));
  return formatCartResponse(String(cart._id));
}

export async function clearCart(owner: CartOwner) {
  const cart = await findCartByOwner(owner);

  if (!cart) {
    throw createHttpError("Cart not found", 404);
  }

  await CartItem.deleteMany({ cart: cart._id });

  return formatCartResponse(String(cart._id));
}
