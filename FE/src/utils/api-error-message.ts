import { HTTPError } from "ky";

export function apiErrorMessage(error: unknown) {
  if (error instanceof HTTPError) {
    const body = error.data;
    if (body && typeof body === "object" && "message" in body && typeof body.message === "string") return body.message;
    return `요청에 실패했어요. (HTTP ${error.response.status})`;
  }
  return "서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.";
}
