// Decode the member ID for the ratings URL. The backend verifies authorization.
export function getMemberIdFromToken(token: string): number | null {
  const parts = token.split(".");
  if (parts.length !== 3 || !parts[1]) return null;

  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded: unknown = JSON.parse(atob(payload));
    if (typeof decoded !== "object" || !decoded || !("sub" in decoded))
      return null;
    const { sub } = decoded;
    if (
      typeof sub !== "number" &&
      (typeof sub !== "string" || !/^\d+$/.test(sub))
    ) {
      return null;
    }
    const id = Number(sub);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}
