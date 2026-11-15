import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFavorites, addFavorite, deleteFavorite } from "../api/favorites";
import { useAuthStore } from "../stores/auth-store";

export function useFavorites() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  // 내 즐겨찾기 목록 조회
  const favoritesQuery = useQuery({
    queryKey: ["favorites", "list"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    retry: false,
  });

  // 즐겨찾기 등록 및 삭제
  const favoriteMutation = useMutation({
    mutationFn: ({
      movieId,
      isBookmarked,
    }: {
      movieId: number;
      isBookmarked: boolean;
    }) => (isBookmarked ? deleteFavorite(movieId) : addFavorite(movieId)),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["favorites", "list"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["favorites", "status", variables.movieId],
        }),
      ]);
    },
  });

  const favoriteIds =
    favoritesQuery.data?.map((favorite) => favorite.movieId) ?? [];

  const toggleFavorite = (movieId: number) => {
    if (
      !accessToken ||
      !favoritesQuery.isSuccess ||
      favoriteMutation.isPending
    ) {
      return;
    }

    const isBookmarked = favoriteIds.includes(movieId);

    favoriteMutation.mutate({
      movieId,
      isBookmarked,
    });
  };

  return {
    favoriteIds,
    toggleFavorite,
    isLoading: favoritesQuery.isPending,
    isError: favoritesQuery.isError || favoriteMutation.isError,
    isPending: favoriteMutation.isPending,
  };
}
