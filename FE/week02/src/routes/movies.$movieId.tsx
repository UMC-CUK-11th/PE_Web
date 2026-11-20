/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router";
import { MovieDetailPage } from "../pages/movie-detail-page";

export const Route = createFileRoute("/movies/$movieId")({
  component: MovieDetailRoute,
});

function MovieDetailRoute() {
  const { movieId } = Route.useParams();
  return <MovieDetailPage movieId={movieId} />;
}
