import { getMovieDetailFromTmdb, tmdbErrorResponse } from "@/api/movies/tmdb-movies";

export async function GET(_request: Request, { params }: { params: Promise<{ movieId: string }> }) {
  const movieId = Number((await params).movieId);
  if (!Number.isSafeInteger(movieId) || movieId < 1) {
    return Response.json({ message: "올바르지 않은 영화 번호예요." }, { status: 400 });
  }

  try {
    return Response.json(await getMovieDetailFromTmdb(movieId));
  } catch (error) {
    return tmdbErrorResponse(error);
  }
}
