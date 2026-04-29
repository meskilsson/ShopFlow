const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

export async function getProducts(category?: string) {
    const params = new URLSearchParams();

    if(category) {
        params.set("category", category);
    }

    const queryString = params.toString();
    const url = queryString
    ? `${API_URL}/products?${queryString}`
    : `${API_URL}/products`;
    
    const res = await fetch(url);

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