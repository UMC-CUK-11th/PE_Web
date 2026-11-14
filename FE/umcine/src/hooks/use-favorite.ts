import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getFavorites, getFavoriteStatus, setFavorite } from "../api/favorites";
import { useAuthStore } from "../stores/auth-store";

const favoritesListKey = ["favorites", "list"] as const;

export function useFavorites() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: favoritesListKey,
    queryFn: ({ signal }) => getFavorites(signal),
    enabled: Boolean(accessToken),
    retry: false,
  });
}

export function useFavorite(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const client = useQueryClient();
  const statusKey = ["favorites", "status", movieId] as const;
  const mutationKey = ["favorites", "toggle", movieId] as const;
  const status = useQuery({
    queryKey: statusKey,
    queryFn: ({ signal }) => getFavoriteStatus(movieId, signal),
    enabled: Boolean(accessToken),
    retry: false,
  });
  const toggle = useMutation({
    mutationKey,
    mutationFn: (isFavorite: boolean) => setFavorite(movieId, isFavorite),
    onMutate: () => useAuthStore.getState().accessToken,
    onSuccess: async (_, isFavorite, token) => {
      if (!token || token !== useAuthStore.getState().accessToken) return;
      await client.cancelQueries({ queryKey: statusKey, exact: true });
      if (token !== useAuthStore.getState().accessToken) return;
      client.setQueryData(statusKey, { isFavorite });
      await client.invalidateQueries({ queryKey: favoritesListKey });
    },
  });

  return {
    status,
    toggle,
    isToggling: useIsMutating({ mutationKey, exact: true }) > 0,
  };
}
