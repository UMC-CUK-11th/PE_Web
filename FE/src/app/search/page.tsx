import { Suspense } from "react";
import { SearchPage } from "../../screens/movies/search-page";

// SearchPage는 useSearchParams로 주소의 ?query=를 읽음
// 이 값은 빌드할 때는 모르고 브라우저 요청이 와야 알 수 있어서, Suspense로 감싸 그 부분만 나중에 그리게 함
export default function Page() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-6xl px-6 py-10" role="status">검색 화면을 불러오는 중이에요.</main>}>
      <SearchPage />
    </Suspense>
  );
}
