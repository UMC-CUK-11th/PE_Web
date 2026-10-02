import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const base = 'http://127.0.0.1:5184';
let server, browser, page;
const errors = [];
before(async () => {
  server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5184', '--strictPort'], { stdio: 'pipe' });
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(base)).ok) break; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', error => errors.push(error.message));
  page.setDefaultTimeout(4000);
});
after(async () => { await browser?.close(); server?.kill(); });

test('검색어를 URL에서 읽고 제목과 원제로 검색한다', async () => {
  await page.goto(`${base}/search?query=%20sPiDeR%20`);
  await page.getByRole('heading', { name: '영화 검색', exact: true }).waitFor();
  assert.match(await page.locator('main').innerText(), /영화 2편/);
  assert.equal(await page.locator('main a[href="/movies/1"]').count() > 0, true);
});
test('검색어가 없거나 결과가 없으면 별도 안내를 표시한다', async () => {
  await page.goto(`${base}/search`);
  await page.getByText('검색어를 입력해 주세요.', { exact: true }).waitFor();
  await page.getByRole('textbox', { name: '검색어', exact: true }).fill('없는영화xyz');
  await page.getByRole('button', { name: '검색', exact: true }).click();
  await page.getByText('검색 결과가 없어요.', { exact: true }).waitFor();
});
test('검색 기록의 뒤로 가기와 앞으로 가기에 입력과 결과가 함께 바뀐다', async () => {
  await page.goto(`${base}/search?query=스파이더맨`);
  const input = page.getByRole('textbox', { name: '검색어', exact: true });
  await input.fill('오디세이');
  await page.getByRole('button', { name: '검색', exact: true }).click();
  await page.waitForURL('**/*query=*');
  await page.getByText('영화 1편', { exact: true }).waitFor();
  await page.goBack();
  await page.getByText('영화 2편', { exact: true }).waitFor();
  assert.equal(await input.inputValue(), '스파이더맨');
  await page.goForward();
  await page.getByText('영화 1편', { exact: true }).waitFor();
  assert.equal(await input.inputValue(), '오디세이');
});
test('상세 URL 직접 접근과 새로고침 및 없는 ID를 처리한다', async () => {
  await page.goto(`${base}/movies/1`);
  await page.getByRole('heading', { name: '스파이더맨: 브랜드 뉴 데이', exact: true }).waitFor();
  await page.reload();
  await page.getByRole('heading', { name: '스파이더맨: 브랜드 뉴 데이', exact: true }).waitFor();
  assert.equal(await page.locator('main img').evaluateAll(imgs => imgs.length >= 2 && imgs.every(img => img.complete && img.naturalWidth > 0)), true);
  await page.goto(`${base}/movies/999`);
  await page.getByText('영화를 찾을 수 없어요.', { exact: true }).waitFor();
});
test('카드에서 상세로 이동하고 북마크는 해당 카드만 변경된다', async () => {
  await page.goto(base);
  const buttons = page.getByRole('button', { name: /북마크/ });
  await buttons.first().waitFor();
  const before = await buttons.evaluateAll(bs => bs.map(b => b.getAttribute('aria-pressed')));
  await buttons.first().click();
  const after = await buttons.evaluateAll(bs => bs.map(b => b.getAttribute('aria-pressed')));
  assert.notEqual(after[0], before[0]);
  assert.deepEqual(after.slice(1), before.slice(1));
  await page.locator('main a[href="/movies/1"]').first().click();
  await page.getByRole('heading', { name: '스파이더맨: 브랜드 뉴 데이', exact: true }).waitFor();
});
test('선택: 현재 메뉴만 활성화되고 모바일에서 가로로 넘치지 않는다', async () => {
  await page.goto(`${base}/search`);
  await page.getByRole('heading', { name: '영화 검색', exact: true }).waitFor();
  const nav = page.getByRole('navigation', { name: '주 메뉴' });
  assert.equal(await nav.locator('[aria-current="page"]').count(), 1);
  assert.equal(await nav.locator('[aria-current="page"]').innerText(), '검색');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await page.getByRole('heading', { name: '영화 목록', exact: true }).waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.equal(await page.locator('[aria-label="영화 목록"]').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), 1);
  assert.deepEqual(errors, []);
});
