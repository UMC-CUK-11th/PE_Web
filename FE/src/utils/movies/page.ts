export function parsePage(value: unknown): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? Math.min(page, 500) : 1;
}
