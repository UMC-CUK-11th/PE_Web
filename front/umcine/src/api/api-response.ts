export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T | null;
}

export function unwrapApiResult<T>(response: ApiResponse<T>): T {
  if (response?.isSuccess !== true || response.result == null) {
    throw new Error(response?.message || "서버 응답을 처리하지 못했어요.");
  }

  return response.result;
}
