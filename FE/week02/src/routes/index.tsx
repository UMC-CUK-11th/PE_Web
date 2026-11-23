/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../pages/movie-list-page";

function parsePage(value: unknown): number | undefined {
  const page = Number(value);
  return Number.isInteger(page) && page > 1 ? page : undefined;
}

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { page?: number } => ({ page: parsePage(search.page) }),
  component: MovieListRoute,
});

function MovieListRoute() {
  const { page } = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <MovieListPage
      currentPage={page ?? 1}
      onPageChange={(nextPage) => {
        void navigate({ search: nextPage === 1 ? {} : { page: nextPage } });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    />
  );
}
