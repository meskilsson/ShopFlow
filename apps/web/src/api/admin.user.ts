const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

type GetAdminUsersOptions = {
    includeDeleted?: boolean;
    page?: number;
    limit?: number;
}


export async function getAdminUsersRequest({ includeDeleted = false, page = 1, limit = 10 }: GetAdminUsersOptions = {}) {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("limit", String(limit));

    if (includeDeleted) {
        params.set("includeDeleted", "true");
    }

    const response = await fetch(`${API_URL}/admin/users?${params.toString()}`, {
        method: "GET",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Could not fetch users");
    }

    return data;
}

export async function deleteAdminUserRequest(id: string, deleteReason?: string) {
    const trimmedReason = deleteReason?.trim();

    const body =
        trimmedReason && trimmedReason.length > 0
            ? { deleteReason: trimmedReason }
            : {};

    const response = await fetch(`${API_URL}/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Could not delete user");
    }

    return data;
}

export async function restoreAdminUserRequest(id: string) {
    const response = await fetch(`${API_URL}/admin/users/${id}/restore`, {
        method: "PATCH",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Could not restore user");
    }

    return data;
}