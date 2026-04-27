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
