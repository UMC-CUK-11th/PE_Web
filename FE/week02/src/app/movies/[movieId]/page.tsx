import { MovieDetailPage } from "../../../features/movie-detail-page";

interface MoviePageProps {
  params: Promise<{ movieId: string }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { movieId } = await params;
  return <MovieDetailPage movieId={movieId} />;
}
