export type ApiValidationError = {
  message: string;
  field?: string;
};

export type ApiError = Error & {
  status?: number;
  data?: {
    message?: string;
    errors?: ApiValidationError[];
  };
};
