import { queryOptions } from "@tanstack/react-query";
import { getMovies } from "./get-movies";
import { searchMovies } from "./search-movies";
import { getMovieDetail } from "./get-movie-detail";

export function movieListOptions(page: number) {
  return queryOptions({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });
}

export function movieSearchOptions(query: string, page: number) {
  const normalizedQuery = query.trim();
  return queryOptions({
    queryKey: ["movies", "search", { query: normalizedQuery, page }],
    queryFn: () => searchMovies({ query: normalizedQuery, page }),
    enabled: normalizedQuery.length > 0,
  });
}

export function movieDetailOptions(movieId: number) {
  return queryOptions({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: Number.isInteger(movieId) && movieId > 0,
    staleTime: 30 * 1000,
  });
}
