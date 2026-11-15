import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mockApis, startVite } from './support/fake-api.mjs';

let server, base, browser;
before(async () => {
  ({ server, base } = await startVite(5187));
  browser = await chromium.launch({ channel: 'chrome', headless: true });
});
after(async () => { await browser?.close(); server?.kill(); });

async function open(overrides) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('dialog', dialog => { errors.push(`dialog: ${dialog.message()}`); dialog.dismiss(); });
  page.setDefaultTimeout(4000);
  const requests = await mockApis(page, overrides);
  return { page, errors, requests };
}

async function fillValidSignup(page, email = 'new@umc.com') {
  await page.getByLabel('이메일', { exact: true }).fill(email);
  await page.getByRole('button', { name: '이메일 중복 확인' }).click();
  await page.getByText('사용할 수 있는 이메일이에요.', { exact: true }).waitFor();
  await page.getByLabel('닉네임', { exact: true }).fill('새닉네임');
  await page.getByRole('button', { name: '닉네임 중복 확인' }).click();
  await page.getByText('사용할 수 있는 닉네임이에요.', { exact: true }).waitFor();
  await page.getByLabel('비밀번호', { exact: true }).fill('Umc!1234');
  await page.getByLabel('비밀번호 확인', { exact: true }).fill('Umc!1234');
}

test('회원가입은 형식 검사와 중복 확인을 모두 통과해야 버튼이 켜진다', async () => {
  const { page, errors } = await open();
  await page.goto(`${base}/signup`);
  const submit = page.getByRole('button', { name: '가입하기' });
  await page.getByRole('heading', { name: '회원가입', exact: true }).waitFor();
  assert.equal(await submit.isDisabled(), true);

  await page.getByLabel('이메일', { exact: true }).fill('not-an-email');
  await page.getByText('올바른 이메일 형식이 아니에요.', { exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: '이메일 중복 확인' }).isDisabled(), true);
  await page.getByLabel('이메일', { exact: true }).fill('noco@umc.com');
  await page.getByRole('button', { name: '이메일 중복 확인' }).click();
  await page.getByText('이미 사용 중인 이메일이에요.', { exact: true }).waitFor();

  await page.getByLabel('닉네임', { exact: true }).fill('a');
  await page.getByText('닉네임은 2자 이상 12자 이하로 입력해 주세요.', { exact: true }).waitFor();
  await page.getByLabel('비밀번호', { exact: true }).fill('umc12345');
  assert.equal(await page.locator('#signup-password-message').evaluate(el => el.className.includes('text-red-600')), true);
  await page.getByLabel('비밀번호 확인', { exact: true }).fill('umc1234');
  await page.getByText('비밀번호가 일치하지 않아요.', { exact: true }).waitFor();

  await fillValidSignup(page);
  assert.equal(await submit.isEnabled(), true);
  // 확인한 값을 바꾸면 다시 확인해야 한다
  await page.getByLabel('닉네임', { exact: true }).fill('또다른닉네임');
  assert.equal(await submit.isDisabled(), true);
  assert.equal(await page.getByText('사용할 수 있는 닉네임이에요.', { exact: true }).count(), 0);
  assert.deepEqual(errors, []);
  await page.close();
});

test('회원가입 요청 중에는 버튼을 잠그고 성공과 실패를 화면에 안내한다', async () => {
  let release;
  const { page, errors, requests } = await open({
    signup: async (route, body) => {
      await new Promise(resolve => { release = resolve; });
      return route.fulfill({ status: 201, headers: { 'access-control-allow-origin': '*' }, contentType: 'application/json',
        body: JSON.stringify({ isSuccess: true, code: 'COMMON201', message: '회원가입에 성공했습니다.', result: { memberId: 4, email: body.email, nickname: body.nickname } }) });
    },
  });
  await page.goto(`${base}/signup`);
  await fillValidSignup(page);
  await page.getByRole('button', { name: '가입하기' }).click();
  await page.getByRole('button', { name: '가입 중' }).waitFor();
  assert.equal(await page.getByRole('button', { name: '가입 중' }).isDisabled(), true);
  release();
  await page.getByText('회원가입에 성공했습니다.', { exact: true }).waitFor();
  assert.equal(await page.getByLabel('이메일', { exact: true }).inputValue(), '');
  const signupRequest = requests.find(r => r.method === 'POST' && r.url.pathname === '/members');
  assert.deepEqual(signupRequest.body, { email: 'new@umc.com', nickname: '새닉네임', password: 'Umc!1234' });
  assert.deepEqual(errors, []);
  await page.close();
});

test('회원가입이 거절되면 서버 메시지를 보여 주고 입력값을 유지한다', async () => {
  const { page, errors } = await open({
    signup: route => route.fulfill({ status: 409, headers: { 'access-control-allow-origin': '*' }, contentType: 'application/json',
      body: JSON.stringify({ isSuccess: false, code: 'COMMON4092', message: '이미 사용 중인 이메일입니다.', result: null }) }),
  });
  await page.goto(`${base}/signup`);
  await fillValidSignup(page);
  await page.getByRole('button', { name: '가입하기' }).click();
  await page.getByRole('alert').filter({ hasText: '이미 사용 중인 이메일입니다.' }).waitFor();
  assert.equal(await page.getByLabel('이메일', { exact: true }).inputValue(), 'new@umc.com');
  assert.equal(await page.getByRole('button', { name: '가입하기' }).isEnabled(), true);
  assert.deepEqual(errors.filter(e => !e.includes('409')), []);
  await page.close();
});

test('헤더의 로그인에서 로그인 화면으로 가고 회원가입 화면과 서로 오간다', async () => {
  const { page, errors } = await open();
  await page.goto(base);
  await page.getByRole('banner').getByRole('link', { name: '로그인', exact: true }).click();
  await page.getByRole('heading', { name: '로그인', exact: true }).waitFor();
  const submit = page.getByRole('main').getByRole('button', { name: '로그인' });
  assert.equal(await submit.isDisabled(), true);
  await page.getByLabel('이메일', { exact: true }).fill('umc@example.com');
  await page.getByLabel('비밀번호', { exact: true }).fill('Umc!1234');
  assert.equal(await page.getByLabel('이메일', { exact: true }).inputValue(), 'umc@example.com');
  assert.equal(await submit.isEnabled(), true);
  await page.getByRole('link', { name: '회원가입', exact: true }).click();
  await page.getByRole('heading', { name: '회원가입', exact: true }).waitFor();
  await page.getByRole('main').getByRole('link', { name: '로그인', exact: true }).click();
  await page.getByRole('heading', { name: '로그인', exact: true }).waitFor();
  assert.deepEqual(errors, []);
  await page.close();
});

test('내 정보에서 수정한 닉네임이 내 정보 화면에 반영되고 즐겨찾기를 보여 준다', async () => {
  const { page, errors, requests } = await open();
  await page.goto(base);
  await page.evaluate(() => localStorage.setItem('umcine-bookmark-store', JSON.stringify({ state: { bookmarkedMovieIds: [550, 155] }, version: 0 })));
  await page.goto(`${base}/my`);
  await page.getByRole('heading', { name: '내 정보', exact: true }).waitFor();
  assert.equal(await page.locator('dd').first().innerText(), 'moviefan');
  const bookmarks = page.getByRole('region', { name: '즐겨찾기 목록' });
  await bookmarks.getByRole('link', { name: '파이트 클럽', exact: true }).waitFor();
  await bookmarks.getByRole('link', { name: '다크 나이트', exact: true }).waitFor();

  await page.getByRole('link', { name: '정보 수정', exact: true }).click();
  await page.getByRole('heading', { name: '내 정보 수정', exact: true }).waitFor();
  const nav = page.getByRole('navigation', { name: '주 메뉴' });
  assert.equal(await nav.locator('[aria-current="page"]').innerText(), '내 정보');
  const save = page.getByRole('button', { name: '변경사항 저장' });
  assert.equal(await save.isDisabled(), true);
  assert.equal(await page.getByLabel('이메일', { exact: true }).isDisabled(), true);

  await page.getByLabel('닉네임', { exact: true }).fill('수현');
  await page.getByRole('button', { name: '닉네임 중복 확인' }).click();
  await page.getByText('이미 사용 중인 닉네임이에요.', { exact: true }).waitFor();
  assert.equal(await save.isDisabled(), true);
  await page.getByLabel('닉네임', { exact: true }).fill('영화광');
  await page.getByRole('button', { name: '닉네임 중복 확인' }).click();
  await page.getByText('사용할 수 있는 닉네임이에요.', { exact: true }).waitFor();
  await page.setInputFiles('input[type="file"]', { name: 'me.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64') });
  await page.getByRole('img', { name: '프로필 이미지' }).waitFor();
  await save.click();

  await page.getByRole('heading', { name: '내 정보', exact: true }).waitFor();
  assert.equal(await page.locator('dd').first().innerText(), '영화광');
  assert.equal(await page.getByRole('img', { name: '프로필 이미지' }).count(), 1);
  assert.equal(requests.filter(r => r.url.pathname === '/3/movie/550').length, 1);
  assert.deepEqual(errors, []);
  await page.close();
});
