import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, getFavorites, getFavoriteStatus, removeFavorite } from "../api/favorites/favorites";
import { useAuthStore } from "../stores/auth-store";

export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
  });
}

export function useFavoriteStatusQuery(movieId: number, enabled = true) {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: enabled && Boolean(accessToken),
  });
}

export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ movieId, isFavorite }: { movieId: number; isFavorite: boolean }) => {
      if (isFavorite) await removeFavorite(movieId);
      else await addFavorite(movieId);
    },
    // 목록(["favorites"])과 영화별 여부(["favorites", movieId])를 한 번에 무효화한다.
    // 실패해도 409, 404는 화면과 서버가 어긋났다는 뜻이라 다시 맞춘다
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });
}
