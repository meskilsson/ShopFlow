import type { LoginRequestInput } from "@/types/authTypes";


const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

export async function loginRequest(userData: LoginRequestInput) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to login user");
    }

    return data;
}