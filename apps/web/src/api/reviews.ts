const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

export async function getProductReviews(productId: string, page = 1, limit = 3) {
    const res = await fetch(`${API_URL}/products/${productId}/reviews?page=${page}&limit=${limit}`);

    if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const error = new Error("Could not create review") as Error & {
            status: number;
            data: unknown;
        }

        error.status = res.status;
        error.data = data;
        throw error;
    }

    return res.json();
}

export async function createProductReview(
    productId: string,
    data: { rating: number; comment: string },
) {
    const res = await fetch(`${API_URL}/products/${productId}/reviews`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const error = new Error("Could not create review") as Error & {
            status: number;
            data: unknown;
        }

        error.status = res.status;
        error.data = data;
        throw error;
    }

    return res.json();
}
