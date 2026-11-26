import { test, expect } from "@playwright/test";

const movie = { id: 550, title: "파이트 클럽", original_title: "Fight Club",
  overview: "마이그레이션 검증에 사용한 영화 데이터입니다.", poster_path: null,
  backdrop_path: null, release_date: "1999-10-15", vote_average: 8.4, vote_count: 100,
  genres: [{ id: 18, name: "드라마" }], genre_ids: [18], runtime: 139, tagline: "" };

test.beforeEach(async ({ page }) => {
  await page.route("https://api.themoviedb.org/**", async (route) => {
    const url = new URL(route.request().url());
    const pageNumber = Number(url.searchParams.get("page") || 1);
    await route.fulfill({ json: url.pathname.endsWith("/550") ? movie : {
      page: pageNumber, results: [movie], total_pages: 3, total_results: 3,
    } });
  });
});

test("App Router 이동, 검색어와 페이지 보존, 뒤로 가기, 동적 상세", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle("UMCine");
  await page.getByRole("button", { name: "2페이지" }).click();
  await expect(page).toHaveURL(/page=2$/);
  await expect(page.getByRole("button", { name: "2페이지" })).toHaveAttribute("aria-current", "page");
  await Promise.all([
    page.waitForResponse(response => response.url().includes("/movie/popular") && new URL(response.url()).searchParams.get("page") === "2"),
    page.reload(),
  ]);
  await expect(page.getByRole("button", { name: "2페이지" })).toHaveAttribute("aria-current", "page");
  await page.screenshot({ path: `test-results/week09-evidence/${info.project.name}-01-list.png`, fullPage: true });
  await page.getByRole("link", { name: "영화 검색" }).click();
  await page.getByRole("textbox", { name: "검색어" }).fill("파이트 & 클럽");
  await page.getByRole("button", { name: "검색", exact: true }).click();
  await expect(page).toHaveURL(url => url.searchParams.get("query") === "파이트 & 클럽");
  await expect(page).toHaveTitle("영화 검색 | UMCine");
  await page.getByRole("button", { name: "2페이지" }).click();
  await expect(page).toHaveURL(url => url.searchParams.get("query") === "파이트 & 클럽" && url.searchParams.get("page") === "2");
  await expect(page.getByRole("button", { name: "2페이지" })).toHaveAttribute("aria-current", "page");
  await page.screenshot({ path: `test-results/week09-evidence/${info.project.name}-02-search.png`, fullPage: true });
  await page.getByRole("link", { name: "파이트 클럽", exact: true }).click();
  await expect(page.getByRole("heading", { name: "파이트 클럽", exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/movies\/550$/);
  await expect(page).toHaveTitle("영화 상세 | UMCine");
  await page.screenshot({ path: `test-results/week09-evidence/${info.project.name}-03-detail.png`, fullPage: true });
  await page.goBack();
  await expect(page.getByRole("textbox", { name: "검색어" })).toHaveValue("파이트 & 클럽");
  await expect(page.getByRole("button", { name: "2페이지" })).toHaveAttribute("aria-current", "page");
  expect(errors).toEqual([]);
});

test("표시 설정 복원과 잘못된 상세 경로", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "작게" }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "작게" })).toHaveAttribute("aria-pressed", "true");
  await page.goto("/movies/invalid");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("올바르지 않은 영화 번호");
});
