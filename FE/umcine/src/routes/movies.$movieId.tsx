import { createFileRoute } from "@tanstack/react-router";
import { MovieDetailPage } from "../pages/movies/movie-detail-page";

// $movieId는 /movies/1의 1처럼 URL에서 달라지는 path param이다.
export const Route = createFileRoute("/movies/$movieId")({
  component: MovieDetailPage,
});
