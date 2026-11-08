import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { MovieCard } from "../../components/movies/movie-card.tsx";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });

  const movie = movieDetailQuery.data;

  return (
    <main>
      {!isValidMovieId ? (
        <p>올바르지 않은 영화 번호예요.</p>
      ) : movieDetailQuery.isPending ? (
        <p>영화 상세 정보를 불러오는 중이에요.</p> // 기존 로딩 UI가 있다면 재사용해요.
      ) : movieDetailQuery.isError ? (
        <p>{getMovieDetailErrorMessage(movieDetailQuery.error)}</p> // 기존 오류 UI가 있다면 재사용해요.
      ) : movie ? (
        <MovieCard movie={movie} />
      ) : null}
    </main>
  );
}
