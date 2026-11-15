import { useQueries } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { useFavoritesQuery } from "../../hooks/use-favorite";
import { tmdbImage } from "../../utils/movies/tmdb-image";

// 마이페이지의 내 찜 목록
// 서버는 movieId만 주므로, 제목과 포스터는 TMDB 영화 상세에서 영화마다 따로 가져옴
export function FavoriteList() {
  const favoritesQuery = useFavoritesQuery();
  const favorites = favoritesQuery.data ?? [];
  const movieQueries = useQueries({
    queries: favorites.map((favorite) => ({
      queryKey: ["movies", "detail", favorite.movieId], // 영화 상세 페이지와 같은 key라 캐시를 같이 씀
      queryFn: ({ signal }: { signal: AbortSignal }) => getMovieDetail(String(favorite.movieId), signal),
      staleTime: 30 * 1000,
    })),
  });

  if (favoritesQuery.isPending) return <p className="text-sm text-gray-500">찜 목록을 불러오는 중이에요.</p>;
  if (favoritesQuery.isError) return <p role="alert" className="text-sm text-red-600">찜 목록을 불러오지 못했어요.</p>;
  if (favorites.length === 0) return <p className="text-sm text-gray-500">아직 찜한 영화가 없어요.</p>;

  return (
    <ul className="grid grid-cols-3 gap-3">
      {favorites.map((favorite, index) => {
        const movie = movieQueries[index]?.data;
        const poster = tmdbImage(movie?.poster_path ?? null);
        return (
          <li key={favorite.favoriteId}>
            <Link to="/movies/$movieId" params={{ movieId: String(favorite.movieId) }} className="block text-sm text-black no-underline">
              {poster
                ? <img src={poster} alt="" className="aspect-[2/3] w-full rounded-md object-cover" />
                : <div className="aspect-[2/3] w-full animate-pulse rounded-md bg-gray-200" />}
              <p className="mt-1 truncate font-semibold">{movie?.title ?? `영화 #${favorite.movieId}`}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
