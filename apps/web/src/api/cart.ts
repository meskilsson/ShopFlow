import { apiFetch } from "./client";

export function getCart() {
  return apiFetch("/cart");
}

export function addToCart(productVariantId: string, quantity = 1) {
  return apiFetch("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productVariantId, quantity }),
  });
}

export function updateCartItemQuantity(
  productVariantId: string,
  quantity: number,
) {
  return apiFetch(`/cart/items/${productVariantId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(productVariantId: string) {
  return apiFetch(`/cart/items/${productVariantId}`, {
    method: "DELETE",
  });
}
