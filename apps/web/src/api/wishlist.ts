const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

export async function getWishlist() {
  const res = await fetch(`${API_URL}/users/wishlist`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Could not fetch wishlist");
  }
  return res.json();
}

export async function toggleWishlist(productId: string) {
  const res = await fetch(`${API_URL}/users/wishlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ productId }),
  });

  if (!res.ok) {
    throw new Error("Could not toggle wishlist");
  }
  return res.json();
}
