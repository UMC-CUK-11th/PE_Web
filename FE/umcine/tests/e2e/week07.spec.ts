import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const api = "http://localhost:8080/members";

async function fillForm(page: Page) {
  await page.getByLabel("이메일", { exact: true }).fill("new@example.com");
  await page.getByLabel("닉네임", { exact: true }).fill("moviefan");
  await page.getByLabel("비밀번호", { exact: true }).fill("Umc!1234");
  await page.getByLabel("비밀번호 확인", { exact: true }).fill("Umc!1234");
}

async function checkBoth(page: Page) {
  await page.getByRole("button", { name: "이메일 중복 확인" }).click();
  await expect(page.getByText("사용할 수 있는 이메일이에요.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "닉네임 중복 확인" }).click();
  await expect(page.getByText("사용할 수 있는 닉네임이에요.", { exact: true })).toBeVisible();
}

async function screenshot(page: Page, name: string, project: string) {
  // 버튼 클릭으로 스크롤된 상태의 sticky 헤더가 전체 페이지 중간에 찍히지 않게 합니다.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `test-results/evidence/${project}-${name}.png`, fullPage: true, animations: "disabled" });
}

test.beforeEach(async ({ page }) => {
  // 외부 영화 서버의 유무가 회원가입 테스트에 영향을 주지 않도록 회원 경로만 모의 처리합니다.
  await page.route(`${api}/**`, (route) => route.fulfill({ json: { available: true } }));
});

test("입력 검증과 두 중복 확인, 입력 변경 시 확인 초기화", async ({ page }, info) => {
  await page.goto("/signup");
  const submit = page.getByRole("button", { name: "가입하기", exact: true });
  await expect(submit).toBeDisabled();
  await page.getByLabel("이메일", { exact: true }).fill("invalid");
  await page.getByLabel("닉네임", { exact: true }).fill("x");
  await page.getByLabel("비밀번호", { exact: true }).fill("weak");
  await page.getByLabel("비밀번호 확인", { exact: true }).fill("different");
  await expect(page.getByText("올바른 이메일 형식으로 입력해 주세요.")).toBeVisible();
  await expect(page.getByText("비밀번호가 일치하지 않아요.")).toBeVisible();
  await expect(page.getByRole("button", { name: "이메일 중복 확인" })).toBeDisabled();
  await screenshot(page, "signup-validation", info.project.name);
  await fillForm(page);
  await expect(submit).toBeDisabled();
  await checkBoth(page);
  await expect(submit).toBeEnabled();
  await page.getByLabel("이메일", { exact: true }).fill("changed@example.com");
  await expect(submit).toBeDisabled();
  await expect(page.getByText("사용할 수 있는 이메일이에요.")).toHaveCount(0);
  await expect(page.getByText("사용할 수 있는 닉네임이에요.")).toBeVisible();
});

test("중복 확인 중 입력과 버튼 잠금 및 확인 실패 재시도", async ({ page }) => {
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route(`${api}/email/**`, async (route) => { await gate; await route.fulfill({ json: { available: false } }); });
  await page.goto("/signup");
  await fillForm(page);
  await page.getByRole("button", { name: "이메일 중복 확인" }).click();
  await expect(page.getByLabel("이메일", { exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "이메일 중복 확인" })).toBeDisabled();
  release();
  await expect(page.getByText("이미 사용 중인 이메일이에요.")).toBeVisible();
  await page.route(`${api}/email/**`, (route) => route.abort("failed"));
  await page.getByRole("button", { name: "이메일 중복 확인" }).click();
  await expect(page.getByText("서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.")).toBeVisible();
  await expect(page.getByRole("button", { name: "이메일 중복 확인" })).toBeEnabled();
});

test("회원가입 요청 본문과 진행 상태, 연속 제출 방지, 성공 안내", async ({ page }, info) => {
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const bodies: unknown[] = [];
  await page.route(api, async (route) => {
    bodies.push(route.request().postDataJSON());
    await gate;
    await route.fulfill({ status: 201, json: { isSuccess: true, code: "COMMON201", message: "회원가입에 성공했습니다.", result: { memberId: 1, email: "new@example.com", nickname: "moviefan" } } });
  });
  await page.goto("/signup");
  await fillForm(page);
  await checkBoth(page);
  await page.getByRole("button", { name: "가입하기", exact: true }).click();
  await expect(page.getByRole("button", { name: "가입 중…" })).toBeDisabled();
  await expect(page.getByLabel("이메일", { exact: true })).toBeDisabled();
  // form submit 이벤트가 추가로 발생해도 ref 잠금으로 두 번째 POST를 막습니다.
  await page.locator("form").dispatchEvent("submit");
  await screenshot(page, "signup-pending-mocked", info.project.name);
  release();
  await expect(page.getByRole("status").filter({ hasText: "회원가입에 성공했습니다." })).toBeVisible();
  expect(bodies).toEqual([{ email: "new@example.com", nickname: "moviefan", password: "Umc!1234" }]);
  await expect(page.getByLabel("비밀번호", { exact: true })).toHaveValue("");
  await expect(page.getByRole("button", { name: "가입하기", exact: true })).toBeDisabled();
});

test("서버 중복 응답 표시, 입력 유지, 해당 중복 확인 무효화", async ({ page }) => {
  await page.route(api, (route) => route.fulfill({ status: 409, json: { isSuccess: false, code: "MEMBER4091", message: "이미 사용 중인 이메일입니다.", result: null } }));
  await page.goto("/signup");
  await fillForm(page);
  await checkBoth(page);
  await page.getByRole("button", { name: "가입하기", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveText("이미 사용 중인 이메일입니다.");
  await expect(page.getByLabel("이메일", { exact: true })).toHaveValue("new@example.com");
  await expect(page.getByLabel("비밀번호", { exact: true })).toHaveValue("Umc!1234");
  await expect(page.getByRole("button", { name: "가입하기", exact: true })).toBeDisabled();
});

test("회원가입 연결 실패 후 입력 유지와 수동 재시도", async ({ page }) => {
  let calls = 0;
  await page.route(api, (route) => { calls++; return route.abort("failed"); });
  await page.goto("/signup");
  await fillForm(page);
  await checkBoth(page);
  const submit = page.getByRole("button", { name: "가입하기", exact: true });
  await submit.click();
  await expect(page.getByRole("alert")).toContainText("서버에 연결하지 못했어요.");
  await expect(submit).toBeEnabled();
  await expect(page.getByLabel("닉네임", { exact: true })).toHaveValue("moviefan");
  expect(calls).toBe(1);
  await submit.click();
  await expect.poll(() => calls).toBe(2);
});

test("로그인 화면 입력 반영 및 API 요청 없는 퍼블리싱", async ({ page }, info) => {
  const writes: string[] = [];
  page.on("request", (request) => { if (request.method() !== "GET") writes.push(request.url()); });
  await page.goto("/login");
  await page.getByLabel("이메일", { exact: true }).fill("moviefan@example.com");
  await page.getByLabel("비밀번호", { exact: true }).fill("Umc!1234");
  await screenshot(page, "login", info.project.name);
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "로그인 기능은 준비 중이에요." })).toBeVisible();
  expect(writes).toEqual([]);
  await page.getByRole("link", { name: "회원가입", exact: true }).click();
  await expect(page).toHaveURL(/\/signup$/);
});

test("내 정보 조회·수정 입력 반영과 취소, 새로고침 초기화", async ({ page }, info) => {
  await page.goto("/mypage");
  await expect(page.getByRole("heading", { name: "내 정보", exact: true })).toBeVisible();
  await screenshot(page, "profile", info.project.name);
  await page.getByRole("link", { name: "내 정보 수정", exact: true }).click();
  await expect(page).toHaveURL(/\/mypage\/edit$/);
  await expect(page.getByLabel("이메일", { exact: true })).toHaveAttribute("readonly", "");
  await page.getByLabel("닉네임", { exact: true }).fill("x");
  await expect(page.getByRole("button", { name: "변경 내용 저장" })).toBeDisabled();
  await page.getByLabel("닉네임", { exact: true }).fill("시네마팬");
  await screenshot(page, "profile-edit", info.project.name);
  await page.getByRole("link", { name: "취소", exact: true }).click();
  await expect(page.getByText("시네마팬", { exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: "내 정보 수정", exact: true }).click();
  await page.getByLabel("닉네임", { exact: true }).fill("시네마팬");
  await page.getByRole("button", { name: "변경 내용 저장" }).click();
  await expect(page.getByRole("status").filter({ hasText: "미리보기 프로필을 수정했어요." })).toBeVisible();
  await page.getByRole("link", { name: "변경된 내 정보 보기" }).click();
  await expect(page.getByText("시네마팬", { exact: true }).first()).toBeVisible();
  await screenshot(page, "profile-updated", info.project.name);
  await page.reload();
  await expect(page.getByText("moviefan", { exact: true }).first()).toBeVisible();
});

test("모든 신규 화면 직접 접속 및 수평 넘침·런타임 오류 확인", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of ["/signup", "/login", "/mypage", "/mypage/edit"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("비밀번호 조합·길이와 닉네임 경계값 검증", async ({ page }) => {
  await page.goto("/signup");
  await fillForm(page);
  await checkBoth(page);
  const password = page.getByLabel("비밀번호", { exact: true });
  const confirm = page.getByLabel("비밀번호 확인", { exact: true });
  const submit = page.getByRole("button", { name: "가입하기", exact: true });
  for (const value of ["umc!1234", "UMC!1234", "Umc!abcd", "Umc12345", "Umc!123", "Umc?1234", "Umc!1234" + "a".repeat(65)]) {
    await password.fill(value);
    await confirm.fill(value);
    await expect(password).toHaveAttribute("aria-invalid", "true");
    await expect(submit).toBeDisabled();
  }
  for (const value of ["Umc!1234", "Umc!1234" + "a".repeat(64)]) {
    await password.fill(value);
    await confirm.fill(value);
    await expect(password).toHaveAttribute("aria-invalid", "false");
    await expect(submit).toBeEnabled();
  }
  const nickname = page.getByLabel("닉네임", { exact: true });
  for (const value of ["x", "1234567890123", "   "]) {
    await nickname.fill(value);
    await expect(nickname).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByRole("button", { name: "닉네임 중복 확인" })).toBeDisabled();
  }
  for (const value of ["ab", "123456789012"]) {
    await nickname.fill(value);
    await expect(nickname).toHaveAttribute("aria-invalid", "false");
    await expect(page.getByRole("button", { name: "닉네임 중복 확인" })).toBeEnabled();
  }
});

test("성공 상태라도 계약과 다른 응답이면 입력 유지 및 오류 안내", async ({ page }) => {
  await page.route(api, (route) => route.fulfill({ status: 201, json: { unexpected: true } }));
  await page.goto("/signup");
  await fillForm(page);
  await checkBoth(page);
  await page.getByRole("button", { name: "가입하기", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("서버 응답을 확인하지 못했어요.");
  await expect(page.getByLabel("이메일", { exact: true })).toHaveValue("new@example.com");
  await expect(page.getByRole("button", { name: "가입하기", exact: true })).toBeEnabled();
});

test("실제 Spring Boot 회원가입·중복 응답 연동", async ({ page }, info) => {
  test.skip(process.env.E2E_LIVE_API !== "1", "실제 백엔드를 실행하고 E2E_LIVE_API=1로 수행");
  await page.unrouteAll();
  const key = `${Date.now().toString().slice(-8)}${info.project.name === "mobile" ? "m" : "d"}`;
  const email = `week07-${key}@example.com`;
  const nickname = `u${key}`;
  await page.goto("/signup");
  await page.getByLabel("이메일", { exact: true }).fill(email);
  await page.getByLabel("닉네임", { exact: true }).fill(nickname);
  await page.getByLabel("비밀번호", { exact: true }).fill("Umc!1234");
  await page.getByLabel("비밀번호 확인", { exact: true }).fill("Umc!1234");
  await checkBoth(page);
  await screenshot(page, "signup-available-live-h2", info.project.name);
  const responsePromise = page.waitForResponse((response) => response.url() === api && response.request().method() === "POST");
  await page.getByRole("button", { name: "가입하기", exact: true }).click();
  const response = await responsePromise;
  expect(response.status()).toBe(201);
  expect((await response.json()).result).not.toHaveProperty("password");
  await expect(page.getByRole("status").filter({ hasText: "회원가입에 성공했습니다." })).toBeVisible();
  await screenshot(page, "signup-success-live-h2", info.project.name);
  await page.getByLabel("이메일", { exact: true }).fill(email);
  await page.getByRole("button", { name: "이메일 중복 확인" }).click();
  await expect(page.getByText("이미 사용 중인 이메일이에요.")).toBeVisible();
  await page.getByLabel("닉네임", { exact: true }).fill(nickname);
  await page.getByRole("button", { name: "닉네임 중복 확인" }).click();
  await expect(page.getByText("이미 사용 중인 닉네임이에요.")).toBeVisible();
  await screenshot(page, "signup-duplicates-live-h2", info.project.name);
});
