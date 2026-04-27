export function createHttpError(message: string, statusCode: number): Error & {
  statusCode?: number;
} {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}