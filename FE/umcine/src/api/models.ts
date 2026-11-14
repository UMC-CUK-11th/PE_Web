export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export function requireApiSuccess<T>(
  response: ApiResponse<T>,
  fallback: string,
) {
  if (!response.isSuccess) throw new Error(response.message || fallback);
  return response;
}
