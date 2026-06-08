type ApiErrorData = {
    message?: string;
    error?: string;
    errors?: {
        location?: string;
        field?: string;
        message: string;
    }[];
};

export type ApiError = Error & {
    status?: number;
    data?: ApiErrorData;
};

export async function handleApiResponse<T>(
    response: Response,
    fallbackMessage: string
): Promise<T> {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error(
            data?.message || data?.error || fallbackMessage
        ) as ApiError;

        error.status = response.status;
        error.data = data ?? undefined;

        throw error;
    }

    return data;
}