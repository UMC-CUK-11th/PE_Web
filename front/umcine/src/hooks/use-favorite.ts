import { useIsMutating, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavorite, favoriteStatusKey, favoritesKey, getFavorites, getFavoriteStatus, removeFavorite,
} from "../api/favorites/favorites";
import { useAuthStore } from "../stores/auth-store";
import { useBookmarkStore } from "../stores/bookmark-store";
import { getMemberId } from "../utils/get-member-id";
import { useStorageReady } from "../components/layout/app-providers";

export function useFavorites() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberId(accessToken);

  return useQuery({
    queryKey: favoritesKey(memberId),
    queryFn: ({ signal }) => getFavorites(signal),
    enabled: Boolean(accessToken),
    retry: false,
  });
}

export function useFavorite(movieId: number, checkStatus = false) {
  const storageReady = useStorageReady();
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberId(accessToken);
  const queryClient = useQueryClient();
  const favorites = useFavorites();
  const localBookmark = useBookmarkStore((state) => state.bookmarkedMovieIds.includes(movieId));
  const toggleLocalBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const status = useQuery({
    queryKey: favoriteStatusKey(memberId, movieId),
    queryFn: ({ signal }) => getFavoriteStatus(movieId, signal),
    enabled: Boolean(accessToken) && checkStatus,
    retry: false,
  });
  const mutationKey = ["toggle-favorite", memberId, movieId];
  const pendingMutations = useIsMutating({ mutationKey });
  const mutation = useMutation({
    mutationKey,
    mutationFn: async (nextFavorite: boolean) => {
      if (nextFavorite) await addFavorite(movieId);
      else await removeFavorite(movieId);
    },
    onMutate: async () => {
      const token = useAuthStore.getState().accessToken;
      await Promise.all([
        queryClient.cancelQueries({ queryKey: favoriteStatusKey(memberId, movieId) }),
        queryClient.cancelQueries({ queryKey: favoritesKey(memberId) }),
      ]);
      return token;
    },
    onSuccess: async (_response, nextFavorite, token) => {
      if (!token || useAuthStore.getState().accessToken !== token) return;
      queryClient.setQueryData(favoriteStatusKey(memberId, movieId), { isFavorite: nextFavorite });
      await queryClient.invalidateQueries({ queryKey: favoritesKey(memberId) });
    },
    onError: (_error, _variables, token) => {
      if (!token || useAuthStore.getState().accessToken !== token) return;
      void queryClient.invalidateQueries({ queryKey: favoritesKey(memberId) });
      void queryClient.invalidateQueries({ queryKey: favoriteStatusKey(memberId, movieId) });
    },
  });

  const favoriteInList = favorites.data?.some((item) => item.movieId === movieId) ?? false;
  const serverFavorite = checkStatus ? status.data?.isFavorite ?? favoriteInList : favoriteInList;
  const isFavorite = accessToken ? serverFavorite : localBookmark;
  const isLoading = !storageReady || (Boolean(accessToken) && (checkStatus ? status.isPending : favorites.isPending));
  const queryError = checkStatus ? status.error : favorites.error;

  function toggle() {
    if (!storageReady) return;
    if (!accessToken) {
      toggleLocalBookmark(movieId);
    } else if (!isLoading && !queryError && pendingMutations === 0) {
      mutation.mutate(!isFavorite);
    }
  }

  return {
    isFavorite,
    isLoading,
    isPending: pendingMutations > 0,
    error: mutation.error ?? queryError,
    toggle,
    retry: () => {
      if (!accessToken) return;
      mutation.reset();
      void favorites.refetch();
      if (checkStatus) void status.refetch();
    },
  };
}
