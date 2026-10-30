export function parsePage(value: unknown) {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 && page <= 500 ? page : 1;
}
