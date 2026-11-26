import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "../../views/movies/search-page";

export const metadata: Metadata = { title: "영화 검색" };

// SearchPage가 useSearchParams로 검색어를 읽어서 Suspense로 감싼다
export default function Page() {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
}
