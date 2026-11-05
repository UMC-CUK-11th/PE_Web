import { isHTTPError } from "ky";

export function getRequestErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (isHTTPError(error)) {
    const body: unknown = error.data;
    if (
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
    ) {
      return body.message;
    }
    return fallback;
  }
  return error instanceof Error && error.name === "Error"
    ? error.message
    : fallback;
}
