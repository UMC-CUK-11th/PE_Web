const BOOKMARK_STORAGE_KEY = "umcine-bookmarks";

export function readBookmarkIds(): number[] {
  try {
    // getItem 자체도 보안 설정이나 브라우저 정책에 따라 예외를 던질 수 있습니다.
    const storedValue = localStorage.getItem(BOOKMARK_STORAGE_KEY);
    if (!storedValue) return [];

    const parsedValue: unknown = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) return [];

    return parsedValue.filter(
      (movieId): movieId is number =>
        typeof movieId === "number" && Number.isInteger(movieId) && movieId > 0,
    );
  } catch {
    return [];
  }
}

export function saveBookmarkIds(movieIds: number[]): boolean {
  try {
    localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(movieIds));
    return true;
  } catch {
    // 호출자가 false를 보고 영구 저장 실패를 안내하거나 메모리 상태만 유지할 수 있습니다.
    return false;
  }
}
