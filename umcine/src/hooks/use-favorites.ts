import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useAuthStore } from "../stores/auth-store";
import { createFavorite, deleteFavorite, getFavorites, getFavoriteStatus } from "../api/favorites/favorites";

export const favoriteKeys = {
  list: (token: string | null) => ["favorites", "list", token] as const,
  status: (token: string | null, movieId: number) => ["favorites", "status", token, movieId] as const,
};

export function useFavorites() {
  const token = useAuthStore((state) => state.accessToken);
  return useQuery({ queryKey: favoriteKeys.list(token), queryFn: getFavorites,
    enabled: Boolean(token), staleTime: 60000, retry: false });
}

export function useFavorite(movieId: number) {
  const token = useAuthStore((state) => state.accessToken);
  const client = useQueryClient();
  const statusKey = favoriteKeys.status(token, movieId);
  const status = useQuery({ queryKey: statusKey, queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(token), staleTime: 60000, retry: false });
  const mutation = useMutation({
    mutationFn: async (isFavorite: boolean) => {
      if (isFavorite) await deleteFavorite(movieId);
      else await createFavorite(movieId);
      return !isFavorite;
    },
    onSuccess: (isFavorite) => {
      client.cancelQueries({ queryKey: statusKey });
      client.setQueryData(statusKey, { isFavorite });
      client.invalidateQueries({ queryKey: favoriteKeys.list(token) });
    },
    onError: (error) => {
      if (error instanceof HTTPError && [404, 409].includes(error.response.status)) {
        client.invalidateQueries({ queryKey: statusKey });
        client.invalidateQueries({ queryKey: favoriteKeys.list(token) });
      }
      alert("즐겨찾기 변경에 실패했어요. 로그인 상태를 확인하고 다시 시도해 주세요.");
    },
  });
  return { token, status, mutation };
}
