/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "../pages/search-page";

interface MovieSearchParams {
  query?: string;
  page?: number;
}

function parsePage(value: unknown): number | undefined {
  const page = Number(value);
  return Number.isInteger(page) && page > 1 ? page : undefined;
}

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): MovieSearchParams => ({
    query: typeof search.query === "string" && search.query.trim() ? search.query.trim() : undefined,
    page: parsePage(search.page),
  }),
  component: SearchRoute,
});

function SearchRoute() {
  const { query, page } = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <SearchPage
      query={query ?? ""}
      currentPage={page ?? 1}
      onSearch={(nextQuery) => void navigate({ search: nextQuery ? { query: nextQuery } : {} })}
      onPageChange={(nextPage) => {
        void navigate({ search: { query, page: nextPage > 1 ? nextPage : undefined } });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    />
  );
}
