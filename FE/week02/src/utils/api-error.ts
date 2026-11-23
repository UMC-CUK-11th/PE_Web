import { HTTPError } from "ky";

interface ErrorResponse {
  message?: string;
}

export async function getApiErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof HTTPError)) return fallback;

  try {
    const response = await error.response.clone().json<ErrorResponse>();
    return response.message || fallback;
  } catch {
    return fallback;
  }
}
