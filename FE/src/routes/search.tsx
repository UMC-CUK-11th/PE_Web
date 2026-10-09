// 이 파일은 /search 주소와 URL 검색어의 형식을 정하는 라우트 설정이다.
// 입력과 결과 화면은 pages/movies/search-page.tsx가 담당한다.
import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "../pages/movies/search-page";

export const Route = createFileRoute("/search")({
  // URL의 query가 문자열일 때만 검색어로 전달한다.
  validateSearch: (search): { query?: string } => ({
    query: typeof search.query === "string" ? search.query : undefined,
  }),
  component: SearchPage,
});
