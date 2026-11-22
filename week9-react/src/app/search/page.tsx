import { Suspense } from "react";
import { SearchPage } from "@/page-components/movies/search-page";

export default function Page() {
  return (
    <Suspense fallback={<div>검색 결과를 불러오는 중...</div>}>
      <SearchPage />
    </Suspense>
  );
}