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

// 서명은 검사하지 않으니 payload의 sub만 맞춘 가짜 토큰
const base64url = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
export const TOKEN = `${base64url({ alg: "HS256" })}.${base64url({ sub: "1", email: "noco@umc.com" })}.signature`;
export const EXPIRED_TOKEN = `${base64url({ alg: "HS256" })}.${base64url({ sub: "1" })}.expired`;
export const AUTH_KEY = "umcine-auth-store";
export const authState = (accessToken) => JSON.stringify({ state: { accessToken }, version: 0 });

const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
// Authorization은 와일드카드에 포함되지 않아 따로 적는다
const cors = { "access-control-allow-origin": "*", "access-control-allow-headers": "*, authorization", "access-control-allow-methods": "*" };

function json(route, status, body) {
  return route.fulfill({ status, headers: cors, contentType: "application/json", body: JSON.stringify(body) });
}

// overrides: { popular, search, detail, signup, favorites }
export async function mockApis(target, overrides = {}) {
  const requests = [];
  // 페이지마다 따로 가지는 서버 상태
  const db = {
    me: { email: "noco@umc.com", nickname: "수현", createdAt: "2026-10-26T13:00:00" },
    favorites: (overrides.favorites ?? []).map((movieId, index) => ({ favoriteId: index + 1, movieId, createdAt: "2026-11-19T10:00:00" })),
    ratings: structuredClone(ratings),
    nextId: 100,
  };
  const ok = (route, status, message, result) => json(route, status, { isSuccess: true, code: status === 201 ? "COMMON201" : "COMMON200", message, result });
  const fail = (route, status, code, message) => json(route, status, { isSuccess: false, code, message, result: null });
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
      const page = Number(url.searchParams.get("page"));
      const results = page === 1 ? movies : [...movies].reverse();
      return json(route, 200, { page, results, total_pages: 5, total_results: movies.length * 5 });
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
    const request = route.request();
    if (request.method() === "OPTIONS") return route.fulfill({ status: 204, headers: cors });
    const url = new URL(request.url());
    const method = request.method();
    const authorization = request.headers().authorization;
    requests.push({ url, method, authorization, body: request.postDataJSON?.() ?? null });
    const path = url.pathname;
    if (method === "POST" && path === "/auth/login") {
      const body = request.postDataJSON();
      if (body.email === "noco@umc.com" && body.password === "Umc!1234") return ok(route, 200, "로그인에 성공했습니다.", { nickname: db.me.nickname, accessToken: TOKEN });
      return fail(route, 401, "AUTH401_1", "이메일 또는 비밀번호가 올바르지 않습니다.");
    }
    const needsAuth = path === "/members/me" || path.startsWith("/favorites") || (path.startsWith("/ratings") && method !== "GET");
    if (needsAuth) {
      if (!authorization) return fail(route, 401, "AUTH401_2", "로그인이 필요한 요청입니다.");
      if (authorization === `Bearer ${EXPIRED_TOKEN}`) return fail(route, 401, "AUTH401_4", "토큰이 만료되었습니다. 다시 로그인해주세요.");
      if (authorization !== `Bearer ${TOKEN}`) return fail(route, 401, "AUTH401_3", "유효하지 않은 토큰입니다.");
    }
    if (path === "/members/me") {
      if (method === "GET") return ok(route, 200, "회원 정보를 조회했습니다.", db.me);
      const { nickname } = request.postDataJSON();
      if (nickname === "민서") return fail(route, 409, "MEMBER409_1", "이미 사용 중인 닉네임입니다.");
      db.me = { ...db.me, nickname };
      return ok(route, 200, "회원 정보를 수정했습니다.", db.me);
    }
    if (path === "/favorites") {
      if (method === "GET") return ok(route, 200, "내 즐겨찾기 목록을 조회했습니다.", [...db.favorites].sort((a, b) => b.favoriteId - a.favoriteId));
      const { movieId } = request.postDataJSON();
      if (db.favorites.some((item) => item.movieId === movieId)) return fail(route, 409, "FAVORITE409_1", "이미 이 영화를 즐겨찾기하셨습니다.");
      const favorite = { favoriteId: db.nextId++, movieId, createdAt: "2026-11-19T10:00:00" };
      db.favorites.push(favorite);
      return ok(route, 201, "즐겨찾기를 등록했습니다.", favorite);
    }
    const favorite = path.match(/^\/favorites\/(\d+)$/);
    if (favorite) {
      const movieId = Number(favorite[1]);
      const exists = db.favorites.some((item) => item.movieId === movieId);
      if (method === "GET") return ok(route, 200, "즐겨찾기 여부를 조회했습니다.", { isFavorite: exists });
      if (!exists) return fail(route, 404, "FAVORITE404_1", "즐겨찾기한 영화를 찾을 수 없습니다.");
      db.favorites = db.favorites.filter((item) => item.movieId !== movieId);
      return ok(route, 200, "즐겨찾기를 해제했습니다.", null);
    }
    if (method === "POST" && path === "/ratings") {
      const body = request.postDataJSON();
      if (db.ratings[1].some((item) => item.movieId === body.movieId)) return fail(route, 409, "RATING409_1", "이미 이 영화에 평점을 남기셨습니다.");
      const rating = { ratingId: db.nextId++, movieId: body.movieId, score: body.score, comment: body.comment || null, createdAt: "2026-11-19T10:00:00", updatedAt: "2026-11-19T10:00:00" };
      db.ratings[1].unshift(rating);
      return ok(route, 201, "평점을 등록했습니다.", rating);
    }
    const rating = path.match(/^\/ratings\/(\d+)$/);
    if (rating) {
      const ratingId = Number(rating[1]);
      const found = db.ratings[1].find((item) => item.ratingId === ratingId);
      if (!found) return fail(route, 404, "RATING404_1", "해당 평점을 찾을 수 없습니다.");
      if (method === "DELETE") {
        db.ratings[1] = db.ratings[1].filter((item) => item.ratingId !== ratingId);
        return ok(route, 200, "평점을 삭제했습니다.", null);
      }
      const body = request.postDataJSON();
      Object.assign(found, { score: body.score, comment: body.comment || null, updatedAt: "2026-11-19T11:00:00" });
      return ok(route, 200, "평점을 수정했습니다.", found);
    }
    if (request.method() === "POST" && url.pathname === "/members") {
      if (overrides.signup) return overrides.signup(route, request.postDataJSON());
      const body = request.postDataJSON();
      if (body.email === "noco@umc.com") return json(route, 409, { isSuccess: false, code: "COMMON4092", message: "이미 사용 중인 이메일입니다.", result: null });
      return json(route, 201, { isSuccess: true, code: "COMMON201", message: "회원가입에 성공했습니다.", result: { memberId: 4, email: body.email, nickname: body.nickname } });
    }
    const nickname = url.pathname.match(/^\/members\/nickname\/(.+)$/);
    if (nickname) return json(route, 200, { available: decodeURIComponent(nickname[1]) !== "수현" });
    const email = url.pathname.match(/^\/members\/email\/(.+)$/);
    if (email) return json(route, 200, { available: decodeURIComponent(email[1]) !== "noco@umc.com" });
    const member = url.pathname.match(/^\/members\/(\d+)\/ratings$/);
    if (member && db.ratings[member[1]]) return json(route, 200, db.ratings[member[1]]);
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
