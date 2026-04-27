import { apiFetch } from "./client";

export function getCart() {
  return apiFetch("/cart");
}

export function addToCart(productId: string) {
  return apiFetch("/cart", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}
