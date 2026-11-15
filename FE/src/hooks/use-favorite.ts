import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, getFavorites, getFavoriteStatus, removeFavorite } from "../api/favorites";
import { useAuthStore } from "../stores/auth-store";

// query key 규칙
// - 영화 하나의 찜 여부: ["favorites", "status", movieId]
// - 내 찜 목록(마이페이지): ["favorites", "list"]
export function useFavoriteStatusQuery(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["favorites", "status", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken),
    retry: false,
  });
}

export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["favorites", "list"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    retry: false,
  });
}

export function useToggleFavoriteMutation(movieId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    // 지금 찜한 상태면 해제, 아니면 등록
    mutationFn: (isFavorite: boolean) => (isFavorite ? removeFavorite(movieId) : addFavorite(movieId)),
    onSuccess: (_response, isFavorite) => {
      // 찜 여부는 요청이 성공한 순간 결과를 확실히 알 수 있음 → 캐시를 직접 바꿈
      queryClient.setQueryData(["favorites", "status", movieId], !isFavorite);
      // 찜 목록은 응답만으로 새 목록을 알 수 없음 → 다시 조회하도록 무효화
      queryClient.invalidateQueries({ queryKey: ["favorites", "list"] });
    },
    onError: () => {
      alert("찜 변경에 실패했어요. 다시 시도해 주세요.");
      // 서버 상태와 화면이 달라졌을 수 있으니 찜 여부를 다시 확인함
      queryClient.invalidateQueries({ queryKey: ["favorites", "status", movieId] });
    },
  });
}
