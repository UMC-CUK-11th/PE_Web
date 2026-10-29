import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mockApis, startVite } from './support/fake-api.mjs';

let server, base, browser;
before(async () => {
  ({ server, base } = await startVite(5185));
  browser = await chromium.launch({ channel: 'chrome', headless: true });
});
after(async () => { await browser?.close(); server?.kill(); });

async function open(overrides) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.setDefaultTimeout(4000);
  const requests = await mockApis(page, overrides);
  return { page, errors, requests };
}

test('목록은 TMDB 인기 영화를 토큰과 함께 요청하고 포스터가 없으면 안내를 표시한다', async () => {
  const { page, errors, requests } = await open();
  await page.goto(base);
  await page.getByRole('link', { name: '파이트 클럽', exact: true }).waitFor();
  const popular = requests.find(r => r.url.pathname === '/3/movie/popular');
  assert.equal(popular.authorization, 'Bearer test-token');
  assert.equal(popular.url.searchParams.get('language'), 'ko-KR');
  assert.equal(popular.url.searchParams.get('page'), '1');
  assert.equal(await page.locator('main article').count(), 7);
  assert.equal(await page.getByRole('img', { name: '인셉션 포스터 없음' }).innerText(), '이미지 없음');
  assert.equal(await page.locator('main img[src="https://image.tmdb.org/t/p/w500/fight.jpg"]').count(), 1);
  assert.match(await page.locator('main').innerText(), /1999\.10\.15/);
  assert.deepEqual(errors, []);
  await page.close();
});

test('목록은 로딩, 오류와 빈 결과를 구분한다', async () => {
  let release;
  const slow = await open({ popular: async route => { await new Promise(r => { release = r; }); return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"page":1,"results":[],"total_pages":0,"total_results":0}' }); } });
  await slow.page.goto(base);
  await slow.page.getByText('영화 목록을 불러오는 중이에요.', { exact: true }).waitFor();
  release();
  await slow.page.getByText('조건에 맞는 영화가 없어요.', { exact: true }).waitFor();
  await slow.page.close();
  const failed = await open({ popular: route => route.fulfill({ status: 401, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"status_code":7}' }) });
  await failed.page.goto(base);
  await failed.page.getByRole('alert').filter({ hasText: '영화 목록을 불러오지 못했어요.' }).waitFor();
  await failed.page.close();
});

test('검색은 URL의 검색어로 요청하고 빈 검색어는 요청하지 않는다', async () => {
  const { page, errors, requests } = await open();
  await page.goto(`${base}/search`);
  await page.getByText('검색어를 입력해 주세요.', { exact: true }).waitFor();
  assert.equal(requests.filter(r => r.url.pathname === '/3/search/movie').length, 0);
  await page.goto(`${base}/search?query=%20dark%20`);
  await page.getByText('영화 1편', { exact: true }).waitFor();
  const search = requests.find(r => r.url.pathname === '/3/search/movie');
  assert.equal(search.url.searchParams.get('query'), 'dark');
  assert.equal(search.url.searchParams.get('include_adult'), 'false');
  assert.equal(await page.locator('main a[href="/movies/155"]').count() > 0, true);
  await page.getByRole('textbox', { name: '검색어', exact: true }).fill('없는영화xyz');
  await page.getByRole('button', { name: '검색', exact: true }).click();
  await page.getByText('조건에 맞는 영화가 없어요.', { exact: true }).waitFor();
  assert.deepEqual(errors, []);
  await page.close();
});

test('검색어가 바뀌면 늦게 도착한 이전 응답이 결과를 덮어쓰지 않는다', async () => {
  let releaseFirst;
  const { page } = await open({
    search: async (route, url) => {
      const query = url.searchParams.get('query');
      if (query === '느린검색') await new Promise(r => { releaseFirst = r; });
      const results = query === '인셉션' ? [{ id: 27205, title: '인셉션', original_title: 'Inception', poster_path: null, backdrop_path: null, release_date: '2010-07-15', overview: '', vote_average: 8, vote_count: 1, genre_ids: [] }]
        : [{ id: 1, title: '느린 결과', original_title: 'Slow', poster_path: null, backdrop_path: null, release_date: '', overview: '', vote_average: 0, vote_count: 0, genre_ids: [] }];
      return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ page: 1, results, total_pages: 1, total_results: 1 }) });
    },
  });
  await page.goto(`${base}/search?query=느린검색`);
  await page.getByText('검색 결과를 불러오는 중이에요.', { exact: true }).waitFor();
  const input = page.getByRole('textbox', { name: '검색어', exact: true });
  await input.fill('인셉션');
  await page.getByRole('button', { name: '검색', exact: true }).click();
  await page.getByRole('link', { name: '인셉션', exact: true }).waitFor();
  releaseFirst();
  await page.waitForTimeout(300);
  assert.equal(await page.getByText('느린 결과').count(), 0);
  await page.goBack();
  assert.equal(await input.inputValue(), '느린검색');
  await page.close();
});

test('상세는 직접 접근과 새로고침을 처리하고 장르와 상영 시간을 표시한다', async () => {
  const { page, errors } = await open();
  await page.goto(`${base}/movies/550`);
  await page.getByRole('heading', { name: '파이트 클럽', exact: true }).waitFor();
  await page.reload();
  await page.getByRole('heading', { name: '파이트 클럽', exact: true }).waitFor();
  const text = await page.locator('main').innerText();
  assert.match(text, /드라마, 스릴러/);
  assert.match(text, /2시간 19분/);
  assert.match(text, /규칙 첫 번째/);
  assert.equal(await page.locator('main img[src="https://image.tmdb.org/t/p/w1280/fight-bg.jpg"]').count(), 1);
  await page.goto(`${base}/movies/155`);
  await page.getByRole('heading', { name: '다크 나이트', exact: true }).waitFor();
  assert.match(await page.locator('main').innerText(), /이미지 없음/);
  await page.goto(`${base}/movies/27205`);
  await page.getByText('상영 시간 정보가 없어요.', { exact: true }).waitFor();
  assert.deepEqual(errors, []);
  await page.close();
});

test('상세는 잘못된 번호는 요청하지 않고 404와 다른 오류를 구분한다', async () => {
  const { page, requests } = await open();
  for (const id of ['abc', '0', '1.5']) {
    await page.goto(`${base}/movies/${id}`);
    await page.getByRole('heading', { name: '올바르지 않은 영화 번호예요.', exact: true }).waitFor();
  }
  assert.equal(requests.filter(r => r.url.pathname.startsWith('/3/movie/') && r.url.pathname !== '/3/movie/popular').length, 0);
  await page.goto(`${base}/movies/999999`);
  await page.getByRole('heading', { name: '영화를 찾을 수 없어요.', exact: true }).waitFor();
  await page.close();
  const failed = await open({ detail: route => route.fulfill({ status: 500, headers: { 'access-control-allow-origin': '*' }, body: 'error' }) });
  await failed.page.goto(`${base}/movies/550`);
  await failed.page.getByRole('heading', { name: '영화 정보를 불러오지 못했어요.', exact: true }).waitFor({ timeout: 15000 });
  await failed.page.close();
});

test('카드에서 상세로 이동하고 북마크는 해당 카드만 변경된다', async () => {
  const { page } = await open();
  await page.goto(base);
  const buttons = page.getByRole('button', { name: /북마크/ });
  await buttons.first().waitFor();
  const before = await buttons.evaluateAll(bs => bs.map(b => b.getAttribute('aria-pressed')));
  await buttons.first().click();
  const after = await buttons.evaluateAll(bs => bs.map(b => b.getAttribute('aria-pressed')));
  assert.notEqual(after[0], before[0]);
  assert.deepEqual(after.slice(1), before.slice(1));
  await page.locator('main a[href="/movies/550"]').first().click();
  await page.getByRole('heading', { name: '파이트 클럽', exact: true }).waitFor();
  await page.close();
});

test('내 정보는 우리 서버의 중복 확인과 유저별 평점 API를 호출한다', async () => {
  const { page, errors, requests } = await open();
  await page.goto(`${base}/my`);
  await page.getByRole('link', { name: '영화 #155', exact: true }).waitFor();
  assert.deepEqual(await page.getByRole('list', { name: '평점 목록' }).locator('li a').allInnerTexts(), ['영화 #155', '영화 #550']);
  await page.getByRole('textbox', { name: '닉네임', exact: true }).fill('수현');
  await page.getByRole('button', { name: '확인' }).first().click();
  await page.getByText('이미 사용 중인 닉네임이에요.', { exact: true }).waitFor();
  await page.getByRole('textbox', { name: '닉네임', exact: true }).fill('새닉네임');
  await page.getByRole('button', { name: '확인' }).first().click();
  await page.getByText('사용할 수 있는 닉네임이에요.', { exact: true }).waitFor();
  await page.getByRole('textbox', { name: '이메일', exact: true }).fill('noco@umc.com');
  await page.getByRole('button', { name: '확인' }).nth(1).click();
  await page.getByText('이미 사용 중인 이메일이에요.', { exact: true }).waitFor();
  assert.equal(requests.some(r => r.url.pathname === '/members/email/noco%40umc.com'), true);
  await page.getByLabel('유저 번호').fill('3');
  await page.getByRole('button', { name: '조회', exact: true }).click();
  await page.getByText('아직 남긴 평점이 없어요.', { exact: true }).waitFor();
  await page.getByLabel('유저 번호').fill('999');
  await page.getByRole('button', { name: '조회', exact: true }).click();
  await page.getByText('존재하지 않는 유저예요.', { exact: true }).waitFor();
  await page.getByRole('link', { name: '영화', exact: true }).waitFor();
  assert.deepEqual(errors.filter(e => !e.includes('404')), []);
  await page.close();
});

test('선택: 현재 메뉴만 활성화되고 모바일에서 가로로 넘치지 않는다', async () => {
  const { page, errors } = await open();
  await page.goto(`${base}/search`);
  await page.getByRole('heading', { name: '영화 검색', exact: true }).waitFor();
  const nav = page.getByRole('navigation', { name: '주 메뉴' });
  assert.equal(await nav.locator('[aria-current="page"]').count(), 1);
  assert.equal(await nav.locator('[aria-current="page"]').innerText(), '검색');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await page.getByRole('link', { name: '파이트 클럽', exact: true }).waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.equal(await page.locator('[aria-label="영화 목록"]').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), 1);
  assert.deepEqual(errors, []);
  await page.close();
});
