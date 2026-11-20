export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export function unwrapApiResponse<T>(response: ApiResponse<T> | T): T {
  if (typeof response === "object" && response !== null && "result" in response) {
    return (response as ApiResponse<T>).result;
  }

  return response as T;
}
