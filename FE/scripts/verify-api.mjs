import assert from "node:assert/strict";
import { createServer } from "vite";

// TMDB에 전송하지 않는 로컬 테스트용 값. 실제 인증 성공 검증과는 별도이다.
process.env.VITE_TMDB_ACCESS_TOKEN = "local-test-only";
process.env.VITE_TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
const originalFetch = globalThis.fetch;
const requests = [];
let status = 200;
const item = { id: 1, title: "테스트 영화", original_title: "Test", overview: "설명", poster_path: null, backdrop_path: null, release_date: "", vote_average: 8, vote_count: 1, genre_ids: [] };
let body = { page: 2, results: [item], total_pages: 3, total_results: 41 };
globalThis.fetch = async (input, init) => {
  const request = input instanceof Request ? input : new Request(input, init);
  requests.push(request);
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
};
try {
  const { getMoviesWithFetch } = await server.ssrLoadModule("/src/api/movies/get-movies-with-fetch.ts");
  const { getMovies } = await server.ssrLoadModule("/src/api/movies/get-movies.ts");
  const { searchMovies } = await server.ssrLoadModule("/src/api/movies/search-movies.ts");
  const { getMovieDetail } = await server.ssrLoadModule("/src/api/movies/get-movie-detail.ts");
  const { getMovieDetailErrorMessage } = await server.ssrLoadModule("/src/utils/movies/get-movie-detail-error-message.ts");
  const { toMovieCard, formatRuntime } = await server.ssrLoadModule("/src/utils/movies/movie-adapter.ts");
  const { parsePage } = await server.ssrLoadModule("/src/utils/movies/page.ts");

  assert.equal((await getMoviesWithFetch(2)).page, 2);
  assert.equal(new URL(requests.at(-1).url).searchParams.get("language"), "ko-KR");
  assert.equal(requests.at(-1).headers.get("Authorization"), "Bearer local-test-only");
  status = 401;
  await assert.rejects(getMoviesWithFetch(), /401/);
  status = 200;
  assert.equal((await getMovies({ page: 2 })).results[0].id, 1);
  assert.equal(new URL(requests.at(-1).url).pathname, "/3/movie/popular");
  assert.equal(new URL(requests.at(-1).url).searchParams.get("page"), "2");
  await searchMovies({ query: "스프링 & 영화", page: 3 });
  const search = new URL(requests.at(-1).url);
  assert.equal(search.pathname, "/3/search/movie");
  assert.equal(search.searchParams.get("query"), "스프링 & 영화");
  assert.equal(search.searchParams.get("include_adult"), "false");
  body = { ...item, genres: [{ id: 1, name: "드라마" }], runtime: null, tagline: "" };
  assert.equal((await getMovieDetail(1)).id, 1);
  assert.equal(new URL(requests.at(-1).url).pathname, "/3/movie/1");
  status = 404;
  await assert.rejects(getMovieDetail(99999), (error) => getMovieDetailErrorMessage(error) === "영화를 찾을 수 없어요.");
  const card = toMovieCard(item);
  assert.equal(card.posterPath, null);
  assert.equal(card.originalTitle, "Test");
  assert.equal("isBookmarked" in card, false);
  assert.equal(formatRuntime(null), "상영 시간 정보가 없어요.");
  assert.equal(formatRuntime(125), "2시간 5분");
  assert.equal(parsePage(-1), 1);
  assert.equal(parsePage("abc"), 1);
  assert.equal(parsePage("2"), 2);
  assert.equal(parsePage(501), 500);
  console.log("PASS: fetch/ky 요청 주소·인증·query·401/404 처리·adapter·상영 시간·페이지 검증 (모의 응답)");
} finally {
  globalThis.fetch = originalFetch;
  await server.close();
}
