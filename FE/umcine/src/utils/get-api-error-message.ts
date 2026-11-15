import { isHTTPError } from "ky";

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isHTTPError(error)) {
    const data: unknown = error.data;
    if (data && typeof data === "object" && "message" in data) {
      if (typeof data.message === "string") return data.message;
      if (Array.isArray(data.message) && typeof data.message[0] === "string") return data.message[0];
    }
    if (error.response.status === 401) return "로그인 후 이용해 주세요.";
    if (error.response.status === 403) return "본인이 작성한 평점만 수정하거나 삭제할 수 있어요.";
    if (error.response.status === 404) return "해당 평점을 찾을 수 없어요.";
    if (error.response.status === 409) return "이미 이 영화에 평점을 남겼어요. 기존 평점을 확인해 주세요.";
  }
  return fallback;
}
