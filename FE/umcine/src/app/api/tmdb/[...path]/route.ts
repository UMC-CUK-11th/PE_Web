import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const endpoint = path.join("/");
  const isList = endpoint === "movie/popular";
  const isSearch = endpoint === "search/movie";
  const isDetail = /^movie\/[1-9]\d*$/.test(endpoint);
  if (!isList && !isSearch && !isDetail) {
    return Response.json(
      { message: "지원하지 않는 영화 요청이에요." },
      { status: 404 },
    );
  }

  const upstreamUrl = new URL(`https://api.themoviedb.org/3/${endpoint}`);
  const configuredBase = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;
  if (
    configuredBase &&
    configuredBase.replace(/\/+$/, "") !== "https://api.themoviedb.org/3"
  ) {
    return Response.json(
      { message: "TMDB API 주소 설정을 확인해주세요." },
      { status: 503 },
    );
  }

  upstreamUrl.searchParams.set("language", "ko-KR");
  if (isList || isSearch) {
    const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
    if (!Number.isInteger(page) || page < 1 || page > 500) {
      return Response.json(
        { message: "페이지는 1~500 사이여야 해요." },
        { status: 400 },
      );
    }
    upstreamUrl.searchParams.set("page", String(page));
  }
  if (isSearch) {
    const query = request.nextUrl.searchParams.get("query")?.trim();
    if (!query) {
      return Response.json(
        { message: "검색어를 입력해주세요." },
        { status: 400 },
      );
    }
    upstreamUrl.searchParams.set("query", query);
    upstreamUrl.searchParams.set("include_adult", "false");
  }

  const token = process.env.TMDB_ACCESS_TOKEN?.trim();
  if (!token) {
    return Response.json(
      { message: "TMDB 환경 변수가 필요해요." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(upstreamUrl, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(10_000)]),
    });
    return Response.json(await response.json(), {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      { message: "영화 서버에 연결하지 못했어요." },
      { status: 502 },
    );
  }
}
