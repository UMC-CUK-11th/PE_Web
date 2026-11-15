import { env } from "../config/env";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    // 쓰기 요청은 자동 재시도하지 않습니다. 중복 가입은 서버에서도 다시 검사합니다.
    response = await fetch(`${env.apiBaseUrl}/${path.replace(/^\/+/, "")}`, {
      ...options,
      signal: options.signal ?? AbortSignal.timeout(10_000),
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.");
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new ApiError(response.status, "INVALID_RESPONSE", "서버 응답을 확인하지 못했어요. 잠시 후 다시 시도해 주세요.");
  }
  const errorBody = typeof body === "object" && body !== null
    ? body as { isSuccess?: boolean; message?: unknown; code?: unknown }
    : null;
  if (!response.ok || errorBody?.isSuccess === false) {
    throw new ApiError(
      response.status,
      typeof errorBody?.code === "string" ? errorBody.code : `HTTP${response.status}`,
      typeof errorBody?.message === "string" ? errorBody.message : "요청을 처리하지 못했어요. 다시 시도해 주세요.",
    );
  }
  return body as T;
}

export function memberErrorMessage(error: unknown) {
  return error instanceof ApiError ? error.message : "요청을 처리하지 못했어요. 다시 시도해 주세요.";
}
