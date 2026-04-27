const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

export async function getProducts() {
    const res = await fetch(`${API_URL}/products`);

    if(!res.ok) {
        throw new Error("Could not fetch products");
    }
    return res.json()
}

export async function getProduct(id:string) {
    const res = await fetch(`${API_URL}/products/${id}`);

    if(!res.ok) {
        throw new Error("Could not fetch product");
    }
    return res.json();
}