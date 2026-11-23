import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { addFavorite, deleteFavorite, getFavorites, getFavoriteStatus } from "./favorite-api";

export const favoriteQueryKeys = {
  all: ["favorites"] as const,
  list: () => [...favoriteQueryKeys.all, "list"] as const,
  status: (movieId: number) => [...favoriteQueryKeys.all, "status", movieId] as const,
};

export function favoritesQueryOptions(enabled = true) {
  return queryOptions({
    queryKey: favoriteQueryKeys.list(),
    queryFn: getFavorites,
    enabled,
  });
}

export function favoriteStatusQueryOptions(movieId: number, enabled = true) {
  return queryOptions({
    queryKey: favoriteQueryKeys.status(movieId),
    queryFn: () => getFavoriteStatus(movieId),
    enabled,
  });
}

export function addFavoriteMutationOptions() {
  return mutationOptions({
    mutationKey: [...favoriteQueryKeys.all, "add"],
    mutationFn: addFavorite,
  });
}

export function deleteFavoriteMutationOptions() {
  return mutationOptions({
    mutationKey: [...favoriteQueryKeys.all, "delete"],
    mutationFn: deleteFavorite,
  });
}
