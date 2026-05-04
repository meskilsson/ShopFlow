import type { CreateUserData, UpdateUserData } from "@/types/userTypes";


const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";


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
        throw new Error(data.message || "Failed to create user");
    }

    return data;
}

export async function getAllUsersRequest() {
    const response = await fetch(`${API_URL}/users`);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to get users");
    }

    return data;
}

export async function getUserByIdRequest(id: string) {
    const response = await fetch(`${API_URL}/users/${id}`);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to get user");
    }

    return data;
}

export async function deleteUserRequest(id: string) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to delete user");
    }

    return data;
}

export async function updateUserRequest(id: string, userData: UpdateUserData) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update user");
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
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
    }

    return data;
}