import type { ApiError } from "@/types/Error.types";

function isApiError(err: unknown): err is ApiError {
  return err instanceof Error;
}

export function getErrorMessage(err: unknown): string {
  if (!isApiError(err)) return "Something went wrong";

  const firstValidationMessage = err.data?.errors?.[0]?.message;
  if (firstValidationMessage) return firstValidationMessage;

  if (err.data?.message) return err.data.message;
  if (err.message) return err.message;

  return "Something went wrong";
}
