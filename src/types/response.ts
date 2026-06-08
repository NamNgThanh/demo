export type ResultResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: unknown };

export const createSuccessResponse = <T>(data: T): ResultResponse<T> => {
  return { success: true, data };
};

export const createErrorResponse = <T>(error: string, details?: unknown): ResultResponse<T> => {
  return { success: false, error, details };
}