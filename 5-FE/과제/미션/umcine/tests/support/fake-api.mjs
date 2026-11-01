// TMDB와 백엔드 응답을 가로채서 토큰, 서버 없이 테스트한다
import { spawn } from "node:child_process";

export const TMDB = "https://api.themoviedb.org/3";
export const API = "http://localhost:8080";

export const movies = [
  { id: 550, title: "파이트 클럽", original_title: "Fight Club", poster_path: "/fight.jpg", backdrop_path: "/fight-bg.jpg", release_date: "1999-10-15", overview: "불면증에 시달리는 남자가 비누 판매상을 만난다." },
  { id: 155, title: "다크 나이트", original_title: "The Dark Knight", poster_path: "/dark.jpg", backdrop_path: null, release_date: "2008-07-16", overview: "배트맨이 조커와 맞선다." },
  { id: 27205, title: "인셉션", original_title: "Inception", poster_path: null, backdrop_path: "/inception-bg.jpg", release_date: "2010-07-15", overview: "꿈속에 생각을 심는다." },
  { id: 157336, title: "인터스텔라", original_title: "Interstellar", poster_path: "/inter.jpg", backdrop_path: "/inter-bg.jpg", release_date: "2014-11-05", overview: "우주로 떠난 탐험." },
  { id: 680, title: "펄프 픽션", original_title: "Pulp Fiction", poster_path: "/pulp.jpg", backdrop_path: "/pulp-bg.jpg", release_date: "1994-09-10", overview: "여러 이야기가 얽힌다." },
  { id: 13, title: "포레스트 검프", original_title: "Forrest Gump", poster_path: "/gump.jpg", backdrop_path: "/gump-bg.jpg", release_date: "1994-06-23", overview: "달리는 남자의 인생." },
  { id: 278, title: "쇼생크 탈출", original_title: "The Shawshank Redemption", poster_path: "/shaw.jpg", backdrop_path: "/shaw-bg.jpg", release_date: "1994-09-23", overview: "희망을 잃지 않은 탈출." },
].map((movie) => ({ ...movie, vote_average: 8, vote_count: 100, genre_ids: [18] }));

const details = {
  550: { genres: [{ id: 18, name: "드라마" }, { id: 53, name: "스릴러" }], runtime: 139, tagline: "규칙 첫 번째" },
  155: { genres: [{ id: 28, name: "액션" }], runtime: 152, tagline: "" },
  27205: { genres: [{ id: 878, name: "SF" }], runtime: null, tagline: "꿈은 현실이 된다" },
};

const ratings = {
  1: [
    { ratingId: 2, movieId: 155, score: 4, comment: "다시 봐도 명작", createdAt: "2026-10-26T14:00:00", updatedAt: "2026-10-26T14:00:00" },
    { ratingId: 1, movieId: 550, score: 5, comment: "최고의 영화!", createdAt: "2026-10-26T13:00:00", updatedAt: "2026-10-26T13:00:00" },
  ],
  3: [],
};

const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
const cors = { "access-control-allow-origin": "*", "access-control-allow-headers": "*" };

function json(route, status, body) {
  return route.fulfill({ status, headers: cors, contentType: "application/json", body: JSON.stringify(body) });
}

// overrides: { popular, search, detail }
export async function mockApis(target, overrides = {}) {
  const requests = [];
  await target.route("https://image.tmdb.org/**", (route) =>
    route.fulfill({ status: 200, contentType: "image/png", body: PNG }));
  await target.route(`${TMDB}/**`, async (route) => {
    const request = route.request();
    if (request.method() === "OPTIONS") return route.fulfill({ status: 204, headers: cors });
    const url = new URL(request.url());
    requests.push({ url, authorization: request.headers().authorization });
    const path = url.pathname.replace("/3/", "");
    if (path === "movie/popular") {
      if (overrides.popular) return overrides.popular(route, url);
      return json(route, 200, { page: 1, results: movies, total_pages: 1, total_results: movies.length });
    }
    if (path === "search/movie") {
      if (overrides.search) return overrides.search(route, url);
      const query = url.searchParams.get("query").toLowerCase();
      const results = movies.filter((movie) =>
        movie.title.toLowerCase().includes(query) || movie.original_title.toLowerCase().includes(query));
      return json(route, 200, { page: 1, results, total_pages: 1, total_results: results.length });
    }
    const id = Number(path.replace("movie/", ""));
    if (overrides.detail) return overrides.detail(route, url, id);
    const movie = movies.find((item) => item.id === id);
    if (!movie || !details[id]) return json(route, 404, { success: false, status_code: 34, status_message: "The resource you requested could not be found." });
    const { genre_ids, ...rest } = movie;
    return json(route, 200, { ...rest, ...details[id] });
  });
  await target.route(`${API}/**`, async (route) => {
    const url = new URL(route.request().url());
    requests.push({ url });
    const nickname = url.pathname.match(/^\/members\/nickname\/(.+)$/);
    if (nickname) return json(route, 200, { available: decodeURIComponent(nickname[1]) !== "수현" });
    const email = url.pathname.match(/^\/members\/email\/(.+)$/);
    if (email) return json(route, 200, { available: decodeURIComponent(email[1]) !== "noco@umc.com" });
    const member = url.pathname.match(/^\/members\/(\d+)\/ratings$/);
    if (member && ratings[member[1]]) return json(route, 200, ratings[member[1]]);
    return json(route, 404, { status: 404, error: "Not Found", message: "존재하지 않는 유저입니다." });
  });
  return requests;
}

export async function startVite(port) {
  const server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
    stdio: "pipe",
    env: { ...process.env, VITE_TMDB_API_BASE_URL: TMDB, VITE_TMDB_ACCESS_TOKEN: "test-token", VITE_API_BASE_URL: API },
  });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(base)).ok) break; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return { server, base };
}
