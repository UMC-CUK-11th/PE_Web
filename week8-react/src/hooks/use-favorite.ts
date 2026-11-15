import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavorite,
  deleteFavorite,
  getFavoriteStatus,
} from "../api/favorites";
import { useAuthStore } from "../stores/auth-store";

export function useFavorite(movieId: number) {
  const queryClient = useQueryClient();

  const accessToken = useAuthStore((state) => state.accessToken);

  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  // 현재 영화의 즐겨찾기 여부 조회
  const favoriteQuery = useQuery({
    queryKey: ["favorites", "status", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken) && isValidMovieId,
    staleTime: 30 * 1000,
    retry: false,
  });

  // 즐겨찾기 추가
  const addMutation = useMutation({
    mutationFn: () => addFavorite(movieId),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["favorites", "status", movieId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["favorites", "list"],
        }),
      ]);
    },
  });

  // 즐겨찾기 삭제
  const deleteMutation = useMutation({
    mutationFn: () => deleteFavorite(movieId),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["favorites", "status", movieId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["favorites", "list"],
        }),
      ]);
    },
  });

  const isBookmarked = favoriteQuery.data ?? false;

  const isPending = addMutation.isPending || deleteMutation.isPending;

  const toggleFavorite = () => {
    if (
      !accessToken ||
      !isValidMovieId ||
      isPending ||
      !favoriteQuery.isSuccess
    ) {
      return;
    }

    if (isBookmarked) {
      deleteMutation.mutate();
    } else {
      addMutation.mutate();
    }
  };

  return {
    isBookmarked,
    isPending,
    isLoading: favoriteQuery.isPending && Boolean(accessToken),
    isError:
      favoriteQuery.isError || addMutation.isError || deleteMutation.isError,
    toggleFavorite,
  };
}
