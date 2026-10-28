import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { MovieCard } from "../../components/movies/movie-card.tsx";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMovieDetail() {
      setMovie(null);
      setErrorMessage(null);

      if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
        setErrorMessage("올바르지 않은 영화 번호예요.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await getMovieDetail(parsedMovieId);
        if (!ignore) setMovie(response);
      } catch (error) {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovieDetail();

    return () => {
      ignore = true;
    };
  }, [parsedMovieId]);

  return (
    <main>
      {!isValidMovieId ? (
        <p role="alert">올바르지 않은 영화 번호예요.</p>
      ) : isLoading ? (
        <p role="status">영화 정보를 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p role="alert">{errorMessage}</p>
      ) : movie ? (
        <MovieCard movie={movie} />
      ) : null}
    </main>
  );
}
