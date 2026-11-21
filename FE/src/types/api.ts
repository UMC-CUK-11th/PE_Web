// 서버의 공통 응답 형식: { isSuccess, code, message, result }
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}
