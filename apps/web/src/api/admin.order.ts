const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

type GetAdminOrdersOptions = {
    includeDeleted?: boolean;
    page?: number;
    limit?: number;
}

export async function getAdminOrderRequest({ includeDeleted = false, page = 1, limit = 10 }: GetAdminOrdersOptions = {}) {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("limit", String(limit));

    if (includeDeleted) {
        params.set("includeDeleted", "true");
    }

    const response = await fetch(`${API_URL}/admin/orders?${params.toString()}`, {
        method: "GET",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
    }

    return data;
}

export async function deleteAdminOrderRequest(id: string, deleteRequest: string) {
    const trimmedReason = deleteRequest?.trim();

    const body =
        trimmedReason && trimmedReason.length > 0
            ? { deleteReason: trimmedReason }
            : {};

    const response = await fetch(`${API_URL}/admin/orders/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Could not delete order");
    }

    return data;
}

export async function restoreAdminOrderRequest(id: string) {
    const response = await fetch(`${API_URL}/admin/orders/${id}/restore`, {
        method: "PATCH",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to restore order");
    }

    return data;
}