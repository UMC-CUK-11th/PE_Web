import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import fs from "node:fs/promises";

const api = "http://localhost:8080";
const movie = { id: 550, title: "파이트 클럽", original_title: "Fight Club", overview: "영화와 함께 취향을 나눠요.", poster_path: null, backdrop_path: null, release_date: "1999-10-15", vote_average: 8.4, vote_count: 100, genres: [{ id: 18, name: "드라마" }], genre_ids: [18], runtime: 139, tagline: "나만의 영화 기록" };
const envelope = (result: unknown, message = "요청에 성공했습니다.") => ({ isSuccess: true, code: "COMMON200", message, result });
const fail = (message: string, code = "COMMON4001") => ({ isSuccess: false, code, message, result: null });
const createdAt = "2026-11-18T12:00:00";

async function shot(page: Page, project: string, name: string) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `test-results/week08-evidence/${project}-${name}.png`, fullPage: true, animations: "disabled" });
}
async function evidence(project: string, name: string, value: unknown) {
  await fs.mkdir("test-results/week08-evidence", { recursive: true });
  await fs.writeFile(`test-results/week08-evidence/${project}-${name}.json`, JSON.stringify(value, null, 2));
}
async function mockSession(page: Page, authenticated = true) {
  const state = {
    token: "mock-account-a",
    profile: { memberId: 1, email: "member@example.com", nickname: "영화팬", createdAt },
    favorites: [] as { favoriteId: number; movieId: number; createdAt: string }[],
    ratings: [] as { ratingId: number; movieId: number; score: number; comment: string; createdAt: string; updatedAt: string }[],
    meGets: 0, favoriteGets: 0, ratingGets: 0,
    writes: [] as { path: string; body: Record<string, unknown>; authenticated: boolean }[],
  };
  if (authenticated) await page.addInitScript(() => {
    if (!localStorage.getItem("umcine-auth-store")) localStorage.setItem("umcine-auth-store", JSON.stringify({ state: { accessToken: "mock-account-a" }, version: 0 }));
  });
  await page.route(`${api}/**`, async (route) => {
    const request = route.request(), path = new URL(request.url()).pathname, method = request.method();
    const authenticated = request.headers().authorization === `Bearer ${state.token}`;
    const body = request.postDataJSON() ?? {};
    if (method !== "GET") state.writes.push({ path, body, authenticated });
    if (path === "/auth/login") return route.fulfill({ json: envelope({ accessToken: state.token, nickname: state.profile.nickname }) });
    if (!authenticated) return route.fulfill({ status: 401, json: fail("로그인이 필요한 요청입니다.", "AUTH401_2") });
    if (path === "/members/me") {
      if (method === "PATCH") state.profile = { ...state.profile, nickname: body.nickname };
      else state.meGets++;
      return route.fulfill({ json: envelope(state.profile) });
    }
    if (path === "/favorites") {
      if (method === "GET") { state.favoriteGets++; return route.fulfill({ json: envelope(state.favorites) }); }
      state.favorites.push({ favoriteId: 1, movieId: body.movieId, createdAt });
      return route.fulfill({ status: 201, json: envelope(state.favorites.at(-1)) });
    }
    if (path.startsWith("/favorites/")) {
      const id = Number(path.split("/").at(-1));
      if (method === "DELETE") state.favorites = state.favorites.filter((item) => item.movieId !== id);
      return route.fulfill({ json: envelope({ movieId: id, isFavorite: state.favorites.some((item) => item.movieId === id) }) });
    }
    if (/^\/members\/\d+\/ratings$/.test(path)) { state.ratingGets++; return route.fulfill({ json: state.ratings }); }
    if (path === "/ratings") {
      const rating = { ratingId: 1, movieId: body.movieId, score: body.score, comment: body.comment, createdAt, updatedAt: createdAt };
      state.ratings.push(rating);
      return route.fulfill({ status: 201, json: envelope(rating) });
    }
    if (path.startsWith("/ratings/")) {
      if (method === "DELETE") state.ratings = [];
      else state.ratings = state.ratings.map((item) => ({ ...item, score: body.score, comment: body.comment }));
      return route.fulfill({ json: envelope(state.ratings[0] ?? null) });
    }
    return route.fulfill({ status: 404, json: fail("찾을 수 없는 요청입니다.") });
  });
  return state;
}

test.beforeEach(async ({ page }) => {
  // 회원 API는 live 테스트에서 실제 서버에 연결합니다. TMDB 데이터만 고정합니다.
  await page.route("https://api.themoviedb.org/**", (route) => route.fulfill({ json: route.request().url().includes("/movie/550") ? movie : { page: 1, results: [movie], total_pages: 1, total_results: 1 } }));
});

test("로그인하지 않은 사용자의 인증 그룹 직접 접근 제한", async ({ page }, info) => {
  const state = await mockSession(page, false);
  for (const path of ["/mypage", "/mypage/edit", "/my"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "로그인", exact: true })).toBeVisible();
  }
  expect(state.meGets).toBe(0);
  await shot(page, info.project.name, "01-login-required");
});

test("로그인 실패 재시도·진행 잠금·토큰 저장·홈 이동·새로고침 복원", async ({ page }, info) => {
  const state = await mockSession(page, false);
  let attempts = 0;
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route(`${api}/auth/login`, async (route) => {
    attempts++;
    if (attempts === 1) return route.fulfill({ status: 401, json: fail("이메일 또는 비밀번호가 올바르지 않습니다.", "AUTH401_1") });
    await gate;
    return route.fallback();
  });
  await page.goto("/login");
  await page.getByLabel("이메일", { exact: true }).fill("member@example.com");
  await page.getByLabel("비밀번호", { exact: true }).fill("Umc!1234");
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("이메일 또는 비밀번호가 올바르지 않습니다.");
  await expect(page.getByLabel("비밀번호", { exact: true })).toHaveValue("Umc!1234");
  await shot(page, info.project.name, "02-login-error-mocked");
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page.getByRole("button", { name: "로그인 중…" })).toBeDisabled();
  await page.locator("form").dispatchEvent("submit");
  await shot(page, info.project.name, "03-login-pending-mocked");
  release();
  await expect(page).toHaveURL((url) => url.pathname === "/");
  await expect.poll(() => state.meGets).toBeGreaterThan(0);
  expect(attempts).toBe(2);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("umcine-auth-store")!).state.accessToken)).toBe(state.token);
  await page.goto("/login");
  await expect(page).toHaveURL((url) => url.pathname === "/");
  await page.reload();
  await expect(page.getByRole("button", { name: "로그아웃" })).toBeVisible();
});

test("401 인증 만료 시 토큰 제거·로그인 이동·자동 재시도 차단", async ({ page }, info) => {
  await mockSession(page);
  let attempts = 0;
  await page.route(`${api}/members/me`, (route) => { attempts++; return route.fulfill({ status: 401, json: fail("토큰이 만료되었습니다.", "AUTH401_4") }); });
  await page.goto("/mypage");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("main").getByRole("alert")).toContainText("인증이 만료되었어요.");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("umcine-auth-store") ?? "null")?.state?.accessToken ?? null)).toBeNull();
  // StrictMode에서 취소된 첫 요청이 재실행될 수 있습니다. backoff 재시도는 하지 않습니다.
  expect(attempts).toBeLessThanOrEqual(2);
  await shot(page, info.project.name, "04-expired-session-mocked");
});

test("내 정보 setQueryData 갱신은 추가 GET 없이 조회·헤더에 반영", async ({ page }, info) => {
  const state = await mockSession(page);
  await page.goto("/mypage/edit");
  await expect(page.getByLabel("닉네임", { exact: true })).toHaveValue("영화팬");
  await expect(page.getByLabel("이메일", { exact: true })).toHaveAttribute("readonly", "");
  const before = state.meGets;
  await page.getByLabel("닉네임", { exact: true }).fill("수정팬");
  await page.getByRole("button", { name: "변경 내용 저장" }).click();
  await expect(page.getByRole("status").filter({ hasText: "내 정보를 수정했어요." })).toBeVisible();
  await shot(page, info.project.name, "05-profile-updated-mocked");
  await page.getByRole("link", { name: "변경된 내 정보 보기" }).click();
  await expect(page.getByRole("heading", { name: "수정팬", exact: true })).toBeVisible();
  expect(state.meGets).toBe(before);
  expect(state.writes.find((item) => item.path === "/members/me")?.body).toEqual({ nickname: "수정팬" });
  await evidence(info.project.name, "cache-setQueryData-mocked", { strategy: "setQueryData", additionalMeGET: state.meGets - before, updatedNickname: state.profile.nickname });
});

test("즐겨찾기 등록·목록·해제 및 invalidateQueries의 활성 목록 재조회", async ({ page }, info) => {
  const state = await mockSession(page);
  await page.goto("/movies/550");
  const add = page.getByRole("button", { name: "파이트 클럽 북마크 추가" });
  await expect(add).toBeEnabled();
  await add.click();
  await expect(page.getByRole("button", { name: "파이트 클럽 북마크 해제" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("link", { name: /내 정보/ }).click();
  await expect(page.getByRole("link", { name: "파이트 클럽", exact: true })).toBeVisible();
  await shot(page, info.project.name, "06-favorites-mocked");
  const before = state.favoriteGets;
  await page.getByRole("button", { name: "파이트 클럽 북마크 해제" }).click();
  await expect(page.getByText("아직 즐겨찾기한 영화가 없어요.")).toBeVisible();
  expect(state.favoriteGets).toBe(before + 1);
  await evidence(info.project.name, "cache-invalidateQueries-mocked", { strategy: "invalidateQueries", additionalFavoritesGET: state.favoriteGets - before, favorites: state.favorites });
});

test("평점 검증·등록·수정·삭제와 서버 목록 재조회", async ({ page }, info) => {
  const state = await mockSession(page);
  await page.goto("/movies/550");
  const create = page.getByRole("button", { name: "평점 등록", exact: true });
  await expect(create).toBeDisabled();
  const before = state.ratingGets;
  await page.getByRole("button", { name: "4점", exact: true }).click();
  await page.getByLabel("후기", { exact: true }).fill("x".repeat(501));
  await expect(create).toBeDisabled();
  await page.getByLabel("후기", { exact: true }).fill("재미있게 봤어요.");
  await create.click();
  await expect(page.getByRole("button", { name: "평점 수정", exact: true })).toBeEnabled();
  await shot(page, info.project.name, "07-rating-created-mocked");
  await page.getByRole("button", { name: "5점", exact: true }).click();
  await page.getByLabel("후기", { exact: true }).fill("수정한 후기예요.");
  await page.getByRole("button", { name: "평점 수정", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "평점을 수정했어요." })).toBeVisible();
  await expect.poll(() => state.ratings[0]?.score).toBe(5);
  await page.getByRole("button", { name: "평점 삭제", exact: true }).click();
  await expect(page.getByRole("button", { name: "평점 등록", exact: true })).toBeDisabled();
  expect(state.ratings).toEqual([]);
  expect(state.ratingGets - before).toBe(3);
  expect(state.writes.find((item) => item.path === "/ratings")?.body).toEqual({ movieId: 550, score: 4, comment: "재미있게 봤어요." });
});

test("즐겨찾기 저장 실패는 상태 유지, 수동 재시도 가능", async ({ page }) => {
  await mockSession(page);
  let attempts = 0;
  await page.route(`${api}/favorites`, (route) => {
    if (route.request().method() === "POST" && ++attempts === 1) return route.fulfill({ status: 503, json: fail("즐겨찾기를 저장하지 못했습니다.", "COMMON503") });
    return route.fallback();
  });
  await page.goto("/movies/550");
  const add = page.getByRole("button", { name: "파이트 클럽 북마크 추가" });
  await expect(add).toBeEnabled(); await add.click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("즐겨찾기를 저장하지 못했습니다.");
  await expect(add).toHaveAttribute("aria-pressed", "false");
  await expect(add).toBeEnabled(); await add.click();
  await expect(page.getByRole("button", { name: "파이트 클럽 북마크 해제" })).toHaveAttribute("aria-pressed", "true");
});

test("로그아웃과 계정 교체 시 이전 개인 캐시가 남지 않음", async ({ page }) => {
  const state = await mockSession(page);
  state.favorites = [{ favoriteId: 1, movieId: 550, createdAt }];
  await page.goto("/mypage");
  await expect(page.getByRole("heading", { name: "영화팬", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "파이트 클럽", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "로그아웃" }).click();
  await expect(page).toHaveURL(/\/login$/);
  state.token = "mock-account-b";
  state.profile = { ...state.profile, memberId: 2, nickname: "다른회원", email: "other@example.com" };
  state.favorites = [];
  await page.getByLabel("이메일", { exact: true }).fill("other@example.com");
  await page.getByLabel("비밀번호", { exact: true }).fill("Umc!1234");
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/");
  await page.goto("/mypage");
  await expect(page.getByRole("heading", { name: "다른회원", exact: true })).toBeVisible();
  await expect(page.getByText("아직 즐겨찾기한 영화가 없어요.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "영화팬", exact: true })).toHaveCount(0);
});

test("다른 탭에서 인증 저장소를 지우면 현재 화면도 로그아웃", async ({ page }) => {
  await mockSession(page);
  await page.goto("/mypage");
  await expect(page.getByRole("heading", { name: "내 정보", exact: true })).toBeVisible();
  await page.evaluate(() => {
    localStorage.removeItem("umcine-auth-store");
    window.dispatchEvent(new StorageEvent("storage", { key: "umcine-auth-store", newValue: null }));
  });
  await expect(page).toHaveURL(/\/login$/);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("umcine-auth-store") ?? "null")?.state?.accessToken ?? null)).toBeNull();
});

test("인증 그룹 주소·모바일 넘침·런타임 오류 확인", async ({ page }) => {
  await mockSession(page);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of ["/mypage", "/mypage/edit", "/movies/550"]) {
    await page.goto(path); await expect(page.locator("h1")).toBeVisible();
    await expect(page).toHaveURL(`http://localhost:5173${path}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("실제 Spring Boot/H2 로그인·프로필·즐겨찾기·평점 전체 연동", async ({ page, request }, info) => {
  test.skip(process.env.E2E_LIVE_API !== "1", "실제 H2 백엔드 실행 후 E2E_LIVE_API=1로 실행");
  const suffix = `${Date.now().toString().slice(-8)}${info.project.name[0]}`;
  const email = `week08-${suffix}@example.com`, nickname = `u${suffix}`, changed = `v${suffix}`;
  const signup = await request.post(`${api}/members`, { data: { email, nickname, password: "Umc!1234" } });
  expect(signup.status()).toBe(201);
  const { memberId } = (await signup.json()).result;
  const calls: { method: string; path: string; status: number; authenticated: boolean }[] = [];
  page.on("response", (response) => {
    if (response.url().startsWith(api)) calls.push({ method: response.request().method(), path: new URL(response.url()).pathname, status: response.status(), authenticated: !!response.request().headers().authorization });
  });
  await page.goto("/login");
  await page.getByLabel("이메일", { exact: true }).fill(email);
  await page.getByLabel("비밀번호", { exact: true }).fill("Umc!1234");
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/");
  await expect(page.getByRole("button", { name: "로그아웃" })).toBeVisible();
  await shot(page, info.project.name, "08-login-success-live-h2");
  await page.goto("/mypage/edit");
  await expect(page.getByLabel("닉네임", { exact: true })).toHaveValue(nickname);
  const before = calls.filter((item) => item.path === "/members/me" && item.method === "GET").length;
  await page.getByLabel("닉네임", { exact: true }).fill(changed);
  await page.getByRole("button", { name: "변경 내용 저장" }).click();
  await expect(page.getByRole("status").filter({ hasText: "내 정보를 수정했어요." })).toBeVisible();
  const after = calls.filter((item) => item.path === "/members/me" && item.method === "GET").length;
  expect(after).toBe(before);
  await shot(page, info.project.name, "09-profile-updated-live-h2");
  await page.goto("/movies/550");
  await expect(page.getByRole("button", { name: "파이트 클럽 북마크 추가" })).toBeEnabled();
  await page.getByRole("button", { name: "파이트 클럽 북마크 추가" }).click();
  await expect(page.getByRole("button", { name: "파이트 클럽 북마크 해제" })).toBeEnabled();
  await page.getByRole("button", { name: "4점", exact: true }).click();
  await page.getByLabel("후기", { exact: true }).fill("실제 서버에 남긴 후기입니다.");
  await page.getByRole("button", { name: "평점 등록", exact: true }).click();
  await expect(page.getByRole("button", { name: "평점 수정", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "5점", exact: true }).click();
  await page.getByLabel("후기", { exact: true }).fill("실제 수정된 후기입니다.");
  await page.getByRole("button", { name: "평점 수정", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "평점을 수정했어요." })).toBeVisible();
  await shot(page, info.project.name, "10-rating-updated-live-h2");
  await page.goto("/mypage");
  await expect(page.getByRole("heading", { name: changed, exact: true })).toBeVisible();
  await expect(page.getByText("실제 수정된 후기입니다.")).toBeVisible();
  await expect(page.getByRole("link", { name: "파이트 클럽", exact: true })).toBeVisible();
  await shot(page, info.project.name, "11-mypage-live-h2");
  await page.reload();
  await expect(page.getByRole("heading", { name: changed, exact: true })).toBeVisible();
  await page.goto("/movies/550");
  await expect(page.getByRole("button", { name: "평점 삭제", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "평점 삭제", exact: true }).click();
  await expect(page.getByRole("button", { name: "평점 등록", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "파이트 클럽 북마크 해제" }).click();
  await expect(page.getByRole("button", { name: "파이트 클럽 북마크 추가" })).toBeEnabled();
  const token = await page.evaluate(() => JSON.parse(localStorage.getItem("umcine-auth-store")!).state.accessToken as string);
  const headers = { Authorization: `Bearer ${token}` };
  expect((await (await request.get(`${api}/favorites`, { headers })).json()).result).toEqual([]);
  expect(await (await request.get(`${api}/members/${memberId}/ratings`, { headers })).json()).toEqual([]);
  await evidence(info.project.name, "live-network-sanitized", { database: "H2 in-memory", tmdb: "mocked fixture", tokenPersisted: !!token, profileUpdateAdditionalGET: after - before, deletionPersisted: true, calls });
  await page.getByRole("button", { name: "로그아웃" }).click();
  await page.goto("/mypage");
  await expect(page).toHaveURL(/\/login$/);
});
