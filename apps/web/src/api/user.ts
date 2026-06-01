import type { CreateUserData, UpdateUserData } from "@/types/userTypes";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

function getJsonHeaders(): HeadersInit {
    return {
        "Content-Type": "application/json",
    };
}

export async function createUserRequest(userData: CreateUserData) {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: getJsonHeaders(),
        credentials: "include",
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to create user");
    }

    return data;
}

export async function getAllUsersRequest() {
    const response = await fetch(`${API_URL}/users`, {
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to get users");
    }

    return data;
}

export async function getUserByIdRequest(id: string) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to get user");
    }

    return data;
}

export async function deleteUserRequest(id: string) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to delete user");
    }

    return data;
}

export async function updateUserRequest(
    id: string,
    userData: UpdateUserData
) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PATCH",
        headers: getJsonHeaders(),
        credentials: "include",
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to update user");
    }

    return data;
}

export async function changePasswordRequest(
    id: string,
    passwordData: {
        currentPassword: string;
        newPassword: string;
    }
) {
    const response = await fetch(`${API_URL}/users/${id}/password`, {
        method: "PATCH",
        headers: getJsonHeaders(),
        credentials: "include",
        body: JSON.stringify(passwordData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to update password");
    }

    return data;
}

export async function getOrderWithItemRequest(id: string) {
    const response = await fetch(`${API_URL}/orders/user/${id}/with-items`, {
        method: "GET",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to update password");
    }

    return data;
}