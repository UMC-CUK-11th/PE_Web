import { searchMoviesOnTmdb, tmdbErrorResponse } from "@/api/movies/tmdb-movies";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = params.get("query")?.trim();
  const page = Number(params.get("page") ?? 1);
  if (!query || !Number.isSafeInteger(page) || page < 1) {
    return Response.json({ message: "검색어와 올바른 페이지 번호를 입력해 주세요." }, { status: 400 });
  }

  try {
    return Response.json(await searchMoviesOnTmdb(query, page));
  } catch (error) {
    return tmdbErrorResponse(error);
  }
}
