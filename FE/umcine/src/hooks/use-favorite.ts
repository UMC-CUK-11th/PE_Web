import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFavorite } from "../api/favorites/create-favorite";
import { deleteFavorite } from "../api/favorites/delete-favorite";
import { getFavorites } from "../api/favorites/get-favorites";
import { getFavoriteStatus } from "../api/favorites/get-favorite-status";
import type { Favorite, FavoriteStatus } from "../api/favorites/models";
import { useAuthStore } from "../stores/auth-store";

export function useFavorite(movieId: number, variant: "detail" | "grid") {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const listKey = ["favorites", "list"] as const;
  const statusKey = ["favorites", "status", movieId] as const;
  const listQuery = useQuery({
    queryKey: listKey,
    queryFn: getFavorites,
    enabled: Boolean(accessToken) && variant === "grid",
    retry: false,
  });
  const statusQuery = useQuery({
    queryKey: statusKey,
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken) && variant === "detail",
    retry: false,
  });
  const query = variant === "detail" ? statusQuery : listQuery;
  const isFavorite = Boolean(accessToken) && (variant === "detail"
    ? statusQuery.data?.isFavorite === true
    : listQuery.data?.some((favorite) => favorite.movieId === movieId) === true);

  const mutation = useMutation({
    mutationKey: ["favorites", movieId],
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: listKey }),
        queryClient.cancelQueries({ queryKey: statusKey }),
      ]);
    },
    mutationFn: async () => {
      if (isFavorite) {
        await deleteFavorite(movieId);
        return null;
      }
      const response = await createFavorite(movieId);
      return response.result;
    },
    onSuccess: (favorite) => {
      if (useAuthStore.getState().accessToken !== accessToken) return;
      queryClient.setQueryData<FavoriteStatus>(statusKey, { isFavorite: favorite !== null });
      queryClient.setQueryData<Favorite[]>(listKey, (previous) => previous && (favorite
        ? [favorite, ...previous.filter((item) => item.movieId !== movieId)]
        : previous.filter((item) => item.movieId !== movieId)));
    },
  });

  return { accessToken, isFavorite, query, mutation };
}
