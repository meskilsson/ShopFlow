const API_BASE_URL = "http://localhost:5000/api/v1";

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = new Error("API request failed");
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }

  return response.json();
}