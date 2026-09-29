import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "../pages/movies/search-page";

export const Route = createFileRoute("/search")({
  // 주소에 적힌 검색어가 문자열인지 확인해요.
  validateSearch: (search): { query?: string } => ({
    query: typeof search.query === "string" ? search.query : undefined,
  }),
  component: SearchPage,
});
