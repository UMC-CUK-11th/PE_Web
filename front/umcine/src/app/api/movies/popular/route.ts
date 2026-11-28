import { getPopularMoviesFromTmdb, tmdbErrorResponse } from "@/api/movies/tmdb-movies";

export async function GET(request: Request) {
  const page = Number(new URL(request.url).searchParams.get("page") ?? 1);
  if (!Number.isSafeInteger(page) || page < 1) {
    return Response.json({ message: "올바르지 않은 페이지 번호예요." }, { status: 400 });
  }

  try {
    return Response.json(await getPopularMoviesFromTmdb(page));
  } catch (error) {
    return tmdbErrorResponse(error);
  }
}
