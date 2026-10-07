const BOOKMARK_STORAGE_KEY = "umcine-bookmarks";

export function validBookmarkIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(
      value.filter(
        (id): id is number =>
          typeof id === "number" && Number.isInteger(id) && id > 0,
      ),
    ),
  ];
}

// 3.2
export function readBookmarkIds(): number[] {
  try {
    const storedValue = localStorage.getItem(BOOKMARK_STORAGE_KEY);
    return storedValue ? validBookmarkIds(JSON.parse(storedValue)) : [];
  } catch {
    return [];
  }
}

export function saveBookmarkIds(movieIds: number[]) {
  localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(movieIds));
}
