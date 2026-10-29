import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";
import { mockApis, startVite } from "./support/fake-api.mjs";

const key = "umcine-bookmark-store";
let server, base, browser;
before(async () => {
  ({ server, base } = await startVite(5186));
  browser = await chromium.launch({ channel: "chrome", headless: true });
});
after(async () => { await browser?.close(); server?.kill(); });

async function ready(page, path = "/") {
  await page.goto(base + path);
  await page.getByRole("heading", { level: 1 }).waitFor();
  await page.getByRole("button", { name: /북마크/ }).first().waitFor();
}

async function newPage(options) {
  const page = await browser.newPage(options);
  await mockApis(page);
  return page;
}

test("목록에서 추가한 북마크를 검색과 상세에서 공유하고 해제한다", async () => {
  const page = await newPage();
  page.setDefaultTimeout(3000);
  await ready(page);
  const button = page.getByRole("button", { name: "다크 나이트 북마크", exact: true });
  assert.equal(await button.getAttribute("aria-pressed"), "false");
  await button.click();
  await page.getByRole("link", { name: "영화 검색으로 이동" }).click();
  await page.getByRole("textbox", { name: "검색어" }).fill("다크");
  await page.getByRole("button", { name: "검색", exact: true }).click();
  assert.equal(await button.getAttribute("aria-pressed"), "true");
  await page.getByRole("link", { name: "다크 나이트 상세 보기" }).click();
  assert.equal(await button.getAttribute("aria-pressed"), "true");
  await button.click();
  await page.getByRole("link", { name: "영화 목록", exact: true }).click();
  assert.equal(await button.getAttribute("aria-pressed"), "false");
  await page.close();
});

test("ID만 저장하고 재시작 뒤 복원하며 저장값 삭제 뒤 빈 상태가 된다", async () => {
  const profile = await mkdtemp(join(tmpdir(), "umc-bookmarks-"));
  let context;
  try {
    context = await chromium.launchPersistentContext(profile, { channel: "chrome", headless: true });
    await mockApis(context);
    let page = context.pages()[0];
    await ready(page);
    await page.getByRole("button", { name: /북마크/ }).nth(1).click();
    await page.getByRole("button", { name: /북마크/ }).nth(6).click();
    const stored = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
    assert.deepEqual(stored.state, { bookmarkedMovieIds: [155, 278] });
    await page.reload();
    await page.getByRole("heading", { level: 1 }).waitFor();
    await page.getByRole("button", { name: /북마크/ }).first().waitFor();
    assert.equal(await page.locator('button[aria-pressed="true"]').count(), 2);
    await context.close();
    context = await chromium.launchPersistentContext(profile, { channel: "chrome", headless: true });
    await mockApis(context);
    page = context.pages()[0];
    await ready(page);
    assert.equal(await page.locator('button[aria-pressed="true"]').count(), 2);
    await page.evaluate(key => localStorage.removeItem(key), key);
    await page.reload();
    await page.getByRole("heading", { level: 1 }).waitFor();
    await page.getByRole("button", { name: /북마크/ }).first().waitFor();
    assert.equal(await page.locator('button[aria-pressed="true"]').count(), 0);
  } finally {
    await context?.close();
    await rm(profile, { recursive: true, force: true });
  }
});

test("잘못된 JSON과 ID를 걸러도 북마크 버튼이 동작한다", async () => {
  const page = await newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await ready(page);
  for (const value of ["not-json", JSON.stringify({ state: { bookmarkedMovieIds: "wrong" }, version: 0 })]) {
    await page.evaluate(({ key, value }) => localStorage.setItem(key, value), { key, value });
    await page.reload();
    await page.getByRole("heading", { level: 1 }).waitFor();
    await page.getByRole("button", { name: /북마크/ }).first().waitFor();
    assert.equal(await page.locator('button[aria-pressed="true"]').count(), 0);
    await page.getByRole("button", { name: /북마크/ }).first().click();
    assert.equal(await page.locator('button[aria-pressed="true"]').count(), 1);
  }
  await page.evaluate(key => localStorage.setItem(key, JSON.stringify({ state: { bookmarkedMovieIds: [155, 155, "278", -1, 1.5, null, 278] }, version: 0 })), key);
  await page.reload();
  await page.getByRole("heading", { level: 1 }).waitFor();
  await page.getByRole("button", { name: /북마크/ }).first().waitFor();
  assert.equal(await page.locator('button[aria-pressed="true"]').count(), 2);
  await page.getByRole("button", { name: /북마크/ }).first().click();
  assert.deepEqual(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).state.bookmarkedMovieIds, key), [155, 278, 550]);
  assert.deepEqual(errors, []);
  await page.close();
});
