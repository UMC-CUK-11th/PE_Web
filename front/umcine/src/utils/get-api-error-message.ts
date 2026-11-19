import { isHTTPError } from "ky";

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isHTTPError(error)) {
    const data = error.data;
    if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
      return data.message;
    }
  }

  return fallback;
}
