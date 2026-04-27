import { apiFetch } from "./client";

export function getCart() {
  return apiFetch("/cart");
}

export function addToCart(productId: string, quantity = 1) {
  return apiFetch("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export function updateCartItemQuantity(productId: string, quantity: number) {
  return apiFetch(`/cart/items/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(productId: string) {
  return apiFetch(`/cart/items/${productId}`, {
    method: "DELETE",
  });
}
