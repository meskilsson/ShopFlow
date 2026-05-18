
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

type GetAdminProductsOptions = {
    includeDeleted?: boolean;
    page?: number;
    limit?: number;
};

export async function getAdminProductsRequest({
    includeDeleted = false,
    page = 1,
    limit = 10,
}: GetAdminProductsOptions = {}) {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("limit", String(limit));

    if (includeDeleted) {
        params.set("includeDeleted", "true");
    }

    const response = await fetch(
        `${API_URL}/admin/products?${params.toString()}`,
        {
            method: "GET",
            credentials: "include",
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products");
    }

    return data;
}


export async function deleteAdminProductRequest(id: string, deleteRequest: string) {
    const trimmedReason = deleteRequest?.trim();

    const body =
        trimmedReason && trimmedReason.length > 0
            ? { deleteReason: trimmedReason }
            : {};

    const response = await fetch(`${API_URL}/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Could not delete product");
    }

    return data;
}

export async function restoreAdminProductRequest(id: string) {
    const response = await fetch(`${API_URL}/admin/products/${id}/restore`, {
        method: "PATCH",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error("Could not restore product");
    }

    return data;
}