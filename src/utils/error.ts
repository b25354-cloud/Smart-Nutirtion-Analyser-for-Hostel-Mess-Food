import type { ApiError } from '@/types';

export const toServiceError = (error: unknown, fallbackMessage: string): ApiError => {
  if (error instanceof Error) {
    return {
      code: 'UNEXPECTED_ERROR',
      message: error.message || fallbackMessage,
      details: error,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: fallbackMessage,
    details: error,
  };
};
