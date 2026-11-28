import { MovieDetailPage } from "../../../screens/movies/movie-detail-page";

export default async function Page({ params }: PageProps<"/movies/[movieId]">) {
  const { movieId } = await params;
  return <MovieDetailPage movieId={movieId} />;
}
