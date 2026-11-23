import { isHTTPError } from "ky";

// 서버가 공통 응답의 message로 알려 준 실패 이유를 꺼낸다
export function getApiErrorMessage(error: unknown, fallback: string) {
  if (isHTTPError(error) && typeof error.data === "object" && error.data && "message" in error.data) {
    return String(error.data.message);
  }
  return fallback;
}
