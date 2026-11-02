import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = new URL("../", import.meta.url);
const feRoot = fileURLToPath(new URL("FE/umcine/", root));
const require = createRequire(new URL("FE/umcine/package.json", root));
const { createServer } = await import(pathToFileURL(require.resolve("vite")).href);
const corsDisabled = process.argv.includes("--cors-disabled");
const evidence = { recordedAt: new Date().toISOString(), runtime: "Node + Vite SSR (not browser)", checks: [] };
const nativeFetch = globalThis.fetch;
const backend = "http://127.0.0.1:8080";
let server;

async function api(path, { origin, method = "GET", headers = {} } = {}) {
  const response = await nativeFetch(backend + path, {
    method, headers: { ...headers, ...(origin ? { Origin: origin } : {}) }, signal: AbortSignal.timeout(15000),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  const record = { method, url: backend + path, status: response.status,
    ...(origin ? { origin, allowedOrigin: response.headers.get("access-control-allow-origin") } : {}), response: data };
  evidence.checks.push(record);
  return { response, data };
}

try {
  const nickname = await api("/members/nickname/" + encodeURIComponent("수현"));
  assert.equal(nickname.response.status, 200);
  assert.equal(nickname.data.available, false);
  assert.equal((await api("/members/nickname/umc_unused_" + Date.now())).data.available, true);
  assert.equal((await api("/members/email/noco%40umc.com")).data.available, false);
  assert.equal((await api("/members/email/unused_" + Date.now() + "%40example.com")).data.available, true);
  const ratings = await api("/members/1/ratings");
  assert.equal(ratings.response.status, 200);
  assert.ok(Array.isArray(ratings.data) && ratings.data.length >= 2);
  for (let index = 1; index < ratings.data.length; index++) {
    assert.ok(ratings.data[index - 1].createdAt >= ratings.data[index].createdAt);
  }
  assert.equal((await api("/members/999999999/ratings")).response.status, 404);
  for (const origin of ["http://localhost:5173", "http://127.0.0.1:5173"]) {
    const { response } = await api("/members/nickname/umc-check", { origin });
    assert.equal(response.headers.get("access-control-allow-origin"), corsDisabled ? null : origin);
  }
  if (!corsDisabled) {
    const { response } = await api("/members", { method: "OPTIONS", origin: "http://localhost:5173",
      headers: { "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type" } });
    assert.equal(response.status, 200);
    assert.ok(response.headers.get("access-control-allow-methods").includes("POST"));
    const denied = await nativeFetch(backend + "/members/nickname/check", { headers: { Origin: "https://untrusted.example" } });
    assert.equal(denied.status, 403);
    assert.equal(denied.headers.get("access-control-allow-origin"), null);
    evidence.checks.push({ check: "unapproved-origin", status: denied.status, allowedOrigin: null });
  }

  server = await createServer({ root: feRoot, logLevel: "silent", server: { middlewareMode: true, hmr: false } });
  const { getMovies } = await server.ssrLoadModule("/src/api/movies/get-movies.ts");
  const { searchMovies } = await server.ssrLoadModule("/src/api/movies/search-movies.ts");
  const { getMovieDetail } = await server.ssrLoadModule("/src/api/movies/get-movie-detail.ts");
  const { getMovieDetailErrorMessage } = await server.ssrLoadModule("/src/utils/movies/get-movie-detail-error-message.ts");
  const movies = await getMovies();
  assert.equal(movies.page, 1);
  assert.ok(movies.results.length > 0);
  evidence.checks.push({ check: "tmdb-popular", page: movies.page, count: movies.results.length });
  const search = await searchMovies({ query: "스파이더맨" });
  assert.ok(search.results.length > 0);
  evidence.checks.push({ check: "tmdb-search", query: "스파이더맨", count: search.results.length });
  const empty = await searchMovies({ query: "umc_no_such_movie_" + Date.now() });
  assert.equal(empty.results.length, 0);
  evidence.checks.push({ check: "tmdb-empty-search", count: empty.results.length });
  const movie = await getMovieDetail(155);
  assert.equal(movie.id, 155);
  evidence.checks.push({ check: "tmdb-detail", id: movie.id, title: movie.title });
  let missingHandled = false;
  try { await getMovieDetail(999999999999); }
  catch (error) { missingHandled = getMovieDetailErrorMessage(error) === "영화를 찾을 수 없어요."; }
  assert.ok(missingHandled);
  evidence.checks.push({ check: "tmdb-detail-404", handled: true });

  const target = new URL("docs/evidence/week05/", root);
  await mkdir(target, { recursive: true });
  await writeFile(new URL(corsDisabled ? "cors-before-api.json" : "api-responses.json", target), JSON.stringify(evidence, null, 2) + "\n");
  console.log(JSON.stringify({ ok: true, corsEnabled: !corsDisabled, checks: evidence.checks.length }));
} catch (error) {
  // URL/headers/token은 오류에 함께 출력하지 않는다.
  console.error(JSON.stringify({ ok: false, errorType: error.name, message: error instanceof assert.AssertionError ? error.message : "API verification failed", networkCode: error.cause?.code }));
  process.exitCode = 1;
} finally {
  await server?.close();
}
