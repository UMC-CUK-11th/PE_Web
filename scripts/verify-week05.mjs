// Browser verification uses fixture TMDB responses and test-only repositories.
// Run Vite on :5173 first. Set PLAYWRIGHT_MODULE to an installed Playwright module.
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createTestApp } from "../BE/movie/test/test-app.mjs";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const { expect } = await import(
  process.env.PLAYWRIGHT_TEST_MODULE || "playwright/test"
);
const browser = await chromium.launch({ channel: "chrome", headless: true });
let app = await createTestApp({ port: 3000 });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const reports = [];
const origin = "http://localhost:5173";
const movie = (id, title = `테스트 영화 ${id}`) => ({
  id,
  title,
  original_title: `Movie ${id}`,
  overview: "테스트 줄거리",
  poster_path: null,
  backdrop_path: null,
  release_date: "2026-10-24",
  vote_average: 8.5,
  vote_count: 10,
  genre_ids: [18],
});
const list = (pageNumber, results) => ({
  page: pageNumber,
  results,
  total_pages: 8,
  total_results: 160,
});
const requests = [];
let failPopular = false;
try {
  // Make the configuration-error test independent of the user's real .env.
  await page.route("**/src/config/env.ts*", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: 'export const env = { get tmdbApiBaseUrl() { throw new Error("TMDB 환경 변수가 필요해요."); }, get tmdbAccessToken() { throw new Error("TMDB 환경 변수가 필요해요."); } };',
    }),
  );
  await page.goto(origin);
  await expect(page.getByText("TMDB 환경 변수가 필요해요.")).toBeVisible();
  reports.push("missing configuration renders recoverable error");

  // Override only the served module in this browser; no token is written to disk.
  await page.unroute("**/src/config/env.ts*");
  await page.route("**/src/config/env.ts*", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: 'export const env = { tmdbApiBaseUrl: "https://api.themoviedb.org/3", tmdbAccessToken: "test-only-token" };',
    }),
  );
  await page.route("https://api.themoviedb.org/3/**", async (route) => {
    const url = new URL(route.request().url());
    requests.push(url);
    assert.equal(
      route.request().headers().authorization,
      "Bearer test-only-token",
    );
    assert.equal(url.searchParams.get("language"), "ko-KR");
    if (url.pathname.endsWith("/popular")) {
      if (failPopular)
        return route.fulfill({
          status: 401,
          json: { status_message: "Unauthorized" },
        });
      const number = Number(url.searchParams.get("page"));
      return route.fulfill({
        json: list(number, [movie(number === 1 ? 550 : 155)]),
      });
    }
    if (url.pathname.endsWith("/search/movie")) {
      assert.equal(url.searchParams.get("include_adult"), "false");
      const query = url.searchParams.get("query");
      if (query === "느린검색")
        await new Promise((resolve) => setTimeout(resolve, 800));
      return route.fulfill({
        json: list(1, query === "빈검색" ? [] : [movie(550, query)]),
      });
    }
    if (url.pathname.endsWith("/999999999"))
      return route.fulfill({
        status: 404,
        json: { status_message: "Not found" },
      });
    return route.fulfill({
      json: {
        ...movie(550),
        genres: [{ id: 18, name: "드라마" }],
        runtime: 135,
        tagline: "테스트 태그라인",
      },
    });
  });
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "테스트 영화 550" }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: "테스트 영화 550 포스터: 이미지 없음" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "작게", exact: true }).click();
  await page.getByRole("button", { name: "북마크 추가" }).click();
  await page.getByRole("button", { name: "2", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "테스트 영화 155" }),
  ).toBeVisible();
  assert.ok(
    requests.some(
      (url) =>
        url.pathname.endsWith("/popular") &&
        url.searchParams.get("page") === "2",
    ),
  );
  reports.push(
    "popular list, null image, real page query, card preferences, bookmarking",
  );

  await page.goto(`${origin}/search?query=스파이더맨`);
  await expect(
    page.getByRole("heading", { name: "스파이더맨", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "북마크 해제" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "스파이더맨", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "상세 정보 보기" }).click();
  await expect(page).toHaveURL(`${origin}/movies/550`);
  await expect(page.getByRole("button", { name: "북마크 해제" })).toBeVisible();
  await expect(page.getByText("2시간 15분").first()).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "테스트 영화 550", exact: true }),
  ).toBeVisible();
  reports.push(
    "search direct URL/reload, detail link/direct reload, shared bookmark, runtime",
  );

  for (const id of ["abc", "-1", "0"]) {
    const count = requests.length;
    await page.goto(`${origin}/movies/${id}`);
    await expect(page.getByText("올바르지 않은 영화 번호예요.")).toBeVisible();
    assert.equal(requests.length, count);
  }
  await page.goto(`${origin}/movies/999999999`);
  await expect(page.getByText("영화를 찾을 수 없어요.")).toBeVisible();
  reports.push("invalid IDs make no request; 404 has dedicated message");

  await page.goto(`${origin}/search`);
  const count = requests.length;
  await expect(page.getByText("찾고 싶은 영화를 검색해보세요")).toBeVisible();
  assert.equal(requests.length, count);
  await page.getByRole("searchbox").fill("빈검색");
  await page.getByRole("button", { name: "검색", exact: true }).click();
  await expect(page.getByText("검색 결과가 없어요")).toBeVisible();
  await page.getByRole("searchbox").fill("느린검색");
  await page.getByRole("button", { name: "검색", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("불러오는 중");
  await page.getByRole("searchbox").fill("빠른검색");
  await page.getByRole("button", { name: "검색", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "빠른검색", exact: true }),
  ).toBeVisible();
  await page.waitForTimeout(1000);
  await expect(
    page.getByRole("heading", { name: "빠른검색", exact: true }),
  ).toBeVisible();
  reports.push(
    "empty query/result, loading, late search response cannot overwrite current results",
  );

  failPopular = true;
  await page.goto(origin);
  await expect(page.getByText("영화 목록을 불러오지 못했어요.")).toBeVisible();
  failPopular = false;
  await page.getByRole("button", { name: "다시 시도" }).click();
  await expect(
    page.getByRole("heading", { name: "테스트 영화 550" }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: "북마크 해제" })).toBeVisible();
  assert.equal(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("umcine-ui-preferences")).state
          .cardSize,
    ),
    "compact",
  );
  reports.push("retry and localStorage bookmark/preferences survive reload");

  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await mkdir(new URL("../.verification/", import.meta.url), {
    recursive: true,
  });
  await page.screenshot({
    path: fileURLToPath(new URL("../.verification/movies.png", import.meta.url)),
    fullPage: true,
  });

  await page.goto(`${origin}/api-test`);
  await page.locator("form").nth(0).getByRole("button").click();
  await expect(page.locator("form").nth(0).getByRole("status")).toHaveText(
    "중복",
  );
  await page.getByLabel("닉네임 중복 확인").fill("꿀범");
  await page.locator("form").nth(0).getByRole("button").click();
  await expect(page.locator("form").nth(0).getByRole("status")).toHaveText(
    "사용 가능",
  );
  await page.locator("form").nth(1).getByRole("button").click();
  await expect(page.locator("form").nth(1).getByRole("status")).toHaveText(
    "중복",
  );
  await page.getByRole("button", { name: "평점 조회" }).click();
  await expect(page.getByText("다시 봐도 명작")).toBeVisible();
  await page.getByLabel("Member ID 평점 조회").fill("999");
  await page.getByRole("button", { name: "평점 조회" }).click();
  await expect(page.getByText("존재하지 않는 유저입니다.")).toBeVisible();
  reports.push(
    "actual browser cross-origin requests reach all three Nest controllers using test repositories",
  );
  assert.deepEqual(errors, []);

  await app.close();
  app = await createTestApp({ port: 3000, corsEnabled: false });
  await page.reload();
  await page.locator("form").nth(0).getByRole("button").click();
  await expect(
    page.getByText(
      "서버에 연결하지 못했어요. 서버 실행 상태와 CORS 설정을 확인해주세요.",
    ),
  ).toBeVisible();
  reports.push(
    "browser blocks response when CORS is disabled (expected experiment)",
  );
  console.log(
    JSON.stringify(
      {
        passed: reports,
        pageErrors: errors,
        liveTmdb: false,
        liveMySql: false,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
  await app.close();
}
