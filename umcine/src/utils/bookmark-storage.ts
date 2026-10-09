const BOOKMARK_STORAGE_KEY = 'umcine-bookmarks';

export function readBookmarkIds(): number[] {
  const storedValue = localStorage.getItem(BOOKMARK_STORAGE_KEY);
  /* 브라우저에 존재하는 localStorage에서 북마크 ID들을 읽어옴 */
  /* getItem은 원래 locaStorage가 가지고 있는 메서드임 */
  /* BOOKMARK_STORAGE_KEY('umcine-bookmarks')라는 이름으로 저장된 값 가져오라는 뜻 */
  if (!storedValue) return [];

  try {
    const parsedValue: unknown = JSON.parse(storedValue);
    /* localStorage에서 가져온 문자열을 실제 JavaScript 값으로 변환하고, 그 결과를 parsedValue에 넣음 */
    if (!Array.isArray(parsedValue)) return [];
    /* parsedValue가 배열이 아니면 빈 배열을 반환 (값을 검사)*/

    return parsedValue.filter(
      (movieId): movieId is number =>
        typeof movieId === 'number' && Number.isInteger(movieId) && movieId > 0,
    );
  } catch {
    return [];
  }
}

export function saveBookmarkIds(movieIds: number[]) {
  /* 브라우저의 localStorage에 북마크 ID들을 저장함 */
  localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(movieIds));
}
