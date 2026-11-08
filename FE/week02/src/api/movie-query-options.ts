import { queryOptions } from "@tanstack/react-query";
import { getMovieDetails, getPopularMovies, searchMovies } from "./tmdb-service";

export const movieQueryKeys = {
  all: ["movies"] as const,
  popular: (page: number) => [...movieQueryKeys.all, "popular", { page }] as const,
  search: (query: string, page: number) => [...movieQueryKeys.all, "search", { query, page }] as const,
  detail: (movieId: number) => [...movieQueryKeys.all, "detail", movieId] as const,
};

const FIVE_MINUTES = 1000 * 60 * 5;

export function popularMoviesQueryOptions(page: number) {
  return queryOptions({
    queryKey: movieQueryKeys.popular(page),
    queryFn: ({ signal }) => getPopularMovies(page, signal),
    staleTime: FIVE_MINUTES,
  });
}

export function searchMoviesQueryOptions(query: string, page: number) {
  return queryOptions({
    queryKey: movieQueryKeys.search(query, page),
    queryFn: ({ signal }) => searchMovies(query, page, signal),
    enabled: Boolean(query),
    staleTime: FIVE_MINUTES,
  });
}

export function movieDetailsQueryOptions(movieId: number, enabled = true) {
  return queryOptions({
    queryKey: movieQueryKeys.detail(movieId),
    queryFn: ({ signal }) => getMovieDetails(movieId, signal),
    enabled,
    staleTime: FIVE_MINUTES,
  });
}
