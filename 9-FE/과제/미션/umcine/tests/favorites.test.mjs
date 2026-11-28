import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { AUTH_KEY, authState, mockApis, startNext, TOKEN } from "./support/fake-api.mjs";

let server, base, browser;
before(async () => {
  ({ server, base } = await startNext(5186));
  browser = await chromium.launch({ channel: "chrome", headless: true });
});
after(async () => { await browser?.close(); server?.kill(); });

async function open({ loggedIn = true, ...overrides } = {}) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("dialog", dialog => { errors.push(`dialog: ${dialog.message()}`); dialog.dismiss(); });
  page.setDefaultTimeout(4000);
  const requests = await mockApis(page, overrides);
  if (loggedIn) await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [AUTH_KEY, authState(TOKEN)]);
  return { page, errors, requests };
}

async function until(check) {
  for (let i = 0; i < 40 && !check(); i++) await new Promise(r => setTimeout(r, 50));
  assert.ok(check());
}

const api = (requests, method, pathname) => requests.filter(r => r.method === method && r.url.pathname === pathname);

test("로그인 전에는 즐겨찾기를 누르면 로그인 화면으로 가고 서버에 요청하지 않는다", async () => {
  const { page, requests } = await open({ loggedIn: false });
  await page.goto(base);
  const button = page.getByRole("button", { name: "다크 나이트 즐겨찾기", exact: true });
  assert.equal(await button.getAttribute("aria-pressed"), "false");
  await button.click();
  await page.getByRole("heading", { name: "로그인", exact: true }).waitFor();
  assert.equal(requests.filter(r => r.url.pathname.startsWith("/favorites")).length, 0);
  await page.close();
});

test("목록에서 등록한 즐겨찾기를 상세에서 여부 API로 확인하고 해제하면 목록과 내 정보에 반영된다", async () => {
  const { page, errors, requests } = await open();
  await page.goto(base);
  const button = page.getByRole("button", { name: "다크 나이트 즐겨찾기", exact: true });
  await page.waitForFunction(() => document.querySelectorAll('button[aria-pressed]').length > 0);
  assert.equal(await button.getAttribute("aria-pressed"), "false");
  await button.click();
  await page.locator('button[aria-label="다크 나이트 즐겨찾기"][aria-pressed="true"]').waitFor();
  const post = api(requests, "POST", "/favorites")[0];
  assert.deepEqual(post.body, { movieId: 155 });
  assert.equal(post.authorization, `Bearer ${TOKEN}`);
  // invalidateQueries로 목록을 다시 받아 버튼 상태를 맞춘다
  assert.ok(api(requests, "GET", "/favorites").length >= 2);

  await page.getByRole("link", { name: "다크 나이트 상세 보기" }).click();
  await page.getByRole("heading", { name: "다크 나이트", exact: true }).waitFor();
  await page.locator('button[aria-label="다크 나이트 즐겨찾기"][aria-pressed="true"]').waitFor();
  // 목록 캐시로 먼저 그린 뒤 이 영화 하나의 여부를 서버에 묻는다
  await until(() => api(requests, "GET", "/favorites/155").length === 1);
  await page.getByRole("button", { name: "다크 나이트 즐겨찾기", exact: true }).click();
  await page.getByRole("button", { name: "다크 나이트 즐겨찾기", exact: true }).filter({ hasText: "즐겨찾기 추가" }).waitFor();
  assert.equal(api(requests, "DELETE", "/favorites/155").length, 1);

  await page.goto(`${base}/movies/550`);
  await page.getByRole("button", { name: "파이트 클럽 즐겨찾기", exact: true }).filter({ hasText: "즐겨찾기 추가" }).click();
  await page.getByRole("button", { name: "파이트 클럽 즐겨찾기", exact: true }).filter({ hasText: "즐겨찾기 해제" }).waitFor();
  await page.getByRole("link", { name: "마이페이지", exact: true }).click();
  const list = page.getByRole("region", { name: "즐겨찾기 목록" });
  await list.getByRole("link", { name: "파이트 클럽", exact: true }).waitFor();
  assert.equal(await list.getByRole("link", { name: "다크 나이트", exact: true }).count(), 0);
  assert.deepEqual(errors, []);
  await page.close();
});

test("내 즐겨찾기가 비어 있으면 안내하고 서버 목록 순서대로 영화를 보여 준다", async () => {
  const empty = await open();
  await empty.page.goto(`${base}/my`);
  await empty.page.getByText("아직 즐겨찾기한 영화가 없어요.", { exact: true }).waitFor();
  await empty.page.close();
  const { page } = await open({ favorites: [550, 155] });
  await page.goto(`${base}/my`);
  const list = page.getByRole("region", { name: "즐겨찾기 목록" });
  await list.getByRole("link", { name: "파이트 클럽", exact: true }).waitFor();
  const titles = await list.locator("h2").allInnerTexts();
  assert.deepEqual(titles, ["다크 나이트", "파이트 클럽"]);
  await page.close();
});

test("상세에서 내 평점을 남기고 고치고 지우면 다시 조회하지 않고 화면이 바뀐다", async () => {
  const { page, errors, requests } = await open();
  await page.goto(`${base}/movies/27205`);
  await page.getByRole("heading", { name: "내 평점", exact: true }).waitFor();
  const submit = page.getByRole("button", { name: "평점 남기기" });
  assert.equal(await submit.isDisabled(), true);
  await page.getByRole("button", { name: "4점", exact: true }).click();
  await page.getByLabel("한 줄 후기 (선택)").fill("꿈속의 꿈");
  await submit.click();
  await page.getByLabel("별점 4점").waitFor();
  assert.deepEqual(api(requests, "POST", "/ratings")[0].body, { movieId: 27205, score: 4, comment: "꿈속의 꿈" });

  await page.getByRole("button", { name: "평점 수정" }).click();
  await page.getByRole("button", { name: "5점", exact: true }).click();
  await page.getByRole("button", { name: "수정 완료" }).click();
  await page.getByLabel("별점 5점").waitFor();
  assert.deepEqual(api(requests, "PATCH", "/ratings/100")[0].body, { score: 5, comment: "꿈속의 꿈" });

  await page.getByRole("button", { name: "평점 삭제" }).click();
  await page.getByRole("button", { name: "평점 남기기" }).waitFor();
  assert.equal(api(requests, "DELETE", "/ratings/100").length, 1);
  // setQueryData로 고쳤으니 목록 조회는 처음 한 번뿐이다
  assert.equal(api(requests, "GET", "/members/1/ratings").length, 1);
  assert.deepEqual(errors, []);
  await page.close();
});

test("이미 남긴 평점은 상세에 보이고 로그인 전에는 로그인 안내를 보여 준다", async () => {
  const { page } = await open();
  await page.goto(`${base}/movies/550`);
  await page.getByLabel("별점 5점").waitFor();
  assert.match(await page.getByRole("region", { name: "내 평점" }).innerText(), /최고의 영화!/);
  await page.close();
  const guest = await open({ loggedIn: false });
  await guest.page.goto(`${base}/movies/550`);
  await guest.page.getByText("하면 이 영화에 평점을 남길 수 있어요.").waitFor();
  assert.equal(guest.requests.filter(r => r.url.pathname.includes("ratings")).length, 0);
  await guest.page.close();
});
