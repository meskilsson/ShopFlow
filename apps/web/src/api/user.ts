import type { CreateUserData, UpdateUserData } from "@/types/userTypes";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

function getAuthHeaders(token: string): HeadersInit {
    return {
        Authorization: `Bearer ${token}`,
    };
}

function getJsonAuthHeaders(token: string): HeadersInit {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

export async function createUserRequest(userData: CreateUserData) {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to create user");
    }

    return data;
}

export async function getAllUsersRequest(token: string) {
    const response = await fetch(`${API_URL}/users`, {
        headers: getAuthHeaders(token),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to get users");
    }

    return data;
}

export async function getUserByIdRequest(id: string, token: string) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        headers: getAuthHeaders(token),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to get user");
    }

    return data;
}

export async function deleteUserRequest(id: string, token: string) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to delete user");
    }

    return data;
}

export async function updateUserRequest(
    id: string,
    userData: UpdateUserData,
    token: string
) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PATCH",
        headers: getJsonAuthHeaders(token),
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
    },
    token: string
) {
    const response = await fetch(`${API_URL}/users/${id}/password`, {
        method: "PATCH",
        headers: getJsonAuthHeaders(token),
        body: JSON.stringify(passwordData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to update password");
    }

    return data;
}