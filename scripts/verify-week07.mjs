import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.API_BASE_URL || "http://127.0.0.1:8080";
const checks = [];
const stamp = Date.now().toString();
const password = "Umcine123!";
const userA = { email: `umc07a_${stamp}@example.com`, nickname: `검증A${stamp.slice(-6)}`, password };
const userB = { email: `umc07b_${stamp}@example.com`, nickname: `검증B${stamp.slice(-6)}`, password };
let tokenA;
let ratingId;
let passed = false;

async function request(name, method, path, body, token, extraHeaders = {}) {
  const response = await fetch(base + path, {
    method,
    headers: { ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}), ...extraHeaders },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15000),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  const recorded = structuredClone(data);
  if (recorded?.result?.accessToken) recorded.result.accessToken = "[access token redacted; received and used in memory]";
  checks.push({ name, method, url: base + path,
    ...(body ? { request: { ...body, ...(body.password ? { password: "[test password redacted]" } : {}) } } : {}),
    ...(token ? { authorization: "Bearer [token redacted]" } : {}),
    status: response.status, response: recorded,
    ...(response.headers.get("access-control-allow-origin") ? { corsOrigin: response.headers.get("access-control-allow-origin") } : {}),
  });
  return { status: response.status, data };
}

function expect(result, status, code) {
  assert.equal(result.status, status);
  if (code) assert.equal(result.data.code, code);
  if (status >= 400) {
    assert.equal(result.data.isSuccess, false);
    assert.equal(result.data.result, null);
  }
  return result.data;
}

try {
  // 워크북 9단계: 두 회원 준비 → 로그인 → 등록 → 중복 → 본인 수정 → 타인 수정 → 무토큰 → 없는 평점 → 삭제.
  const a = expect(await request("1. A 가입", "POST", "/members", userA), 201, "COMMON201");
  const b = expect(await request("1. B 가입", "POST", "/members", userB), 201, "COMMON201");
  const loginA = expect(await request("2. A 로그인", "POST", "/auth/login", { email: userA.email, password }), 200, "COMMON200");
  const loginB = expect(await request("2. B 로그인", "POST", "/auth/login", { email: userB.email, password }), 200, "COMMON200");
  tokenA = loginA.result.accessToken;
  const tokenB = loginB.result.accessToken;
  assert.equal(tokenA.split(".").length, 3);
  const payload = JSON.parse(Buffer.from(tokenA.split(".")[1], "base64url").toString());
  assert.equal(payload.sub, String(a.result.memberId));
  assert.equal(payload.email, userA.email);
  assert.equal(payload.exp - payload.iat, 3600);
  assert.ok(!Object.hasOwn(payload, "password"));
  const header = JSON.parse(Buffer.from(tokenA.split(".")[0], "base64url").toString());
  checks.push({ name: "JWT 로컬 디코딩 (jwt.io 화면 검증과 구분)", header, payload });

  const created = expect(await request("3. A 평점 등록", "POST", "/ratings", { movieId: 550, score: 5, comment: "7주차 실제 API 검증" }, tokenA), 201, "COMMON201");
  ratingId = created.result.ratingId;
  assert.ok(Number.isInteger(ratingId));
  assert.ok(created.result.createdAt);
  expect(await request("4. 같은 영화 중복", "POST", "/ratings", { movieId: 550, score: 4 }, tokenA), 409, "RATING409_1");
  expect(await request("5. A 본인 수정", "PATCH", `/ratings/${ratingId}`, { score: 4, comment: "본인 수정 확인" }, tokenA), 200, "COMMON200");
  expect(await request("6. B가 A 평점 수정", "PATCH", `/ratings/${ratingId}`, { score: 2 }, tokenB), 403, "RATING403_1");
  expect(await request("7. 토큰 없이 수정", "PATCH", `/ratings/${ratingId}`, { score: 2 }), 401, "AUTH401_2");
  expect(await request("8. 없는 평점 삭제", "DELETE", "/ratings/999999999", undefined, tokenA), 404, "RATING404_1");
  expect(await request("9. A 본인 삭제", "DELETE", `/ratings/${ratingId}`, undefined, tokenA), 200, "COMMON200");
  ratingId = undefined;

  const me = expect(await request("내 정보 조회", "GET", "/members/me", undefined, tokenA), 200, "COMMON200");
  assert.equal(me.result.email, userA.email);
  assert.ok(!Object.hasOwn(me.result, "password"));
  expect(await request("제출 캡처용 무토큰 내 정보", "GET", "/members/me"), 401, "AUTH401_2");
  expect(await request("내 닉네임 유지", "PATCH", "/members/me", { nickname: userA.nickname }, tokenA), 200, "COMMON200");
  expect(await request("타인 닉네임 중복", "PATCH", "/members/me", { nickname: userB.nickname }, tokenA), 409, "MEMBER409_1");
  expect(await request("닉네임 검증 실패", "PATCH", "/members/me", { nickname: "가" }, tokenA), 400, "COMMON400");
  const nickname = `변경${stamp.slice(-7)}`;
  expect(await request("닉네임 변경", "PATCH", "/members/me", { nickname }, tokenA), 200, "COMMON200");
  const after = expect(await request("변경 저장 재조회", "GET", "/members/me", undefined, tokenA), 200, "COMMON200");
  assert.equal(after.result.nickname, nickname);
  const other = expect(await request("B 정보 유지 확인", "GET", "/members/me", undefined, tokenB), 200, "COMMON200");
  assert.equal(other.result.nickname, userB.nickname);

  const wrong = expect(await request("틀린 비밀번호", "POST", "/auth/login", { email: userA.email, password: "wrong" }), 401, "AUTH401_1");
  const missing = expect(await request("없는 이메일", "POST", "/auth/login", { email: `missing_${stamp}@example.com`, password }), 401, "AUTH401_1");
  assert.deepEqual(wrong, missing);
  const parts = tokenA.split(".");
  parts[1] = Buffer.from(JSON.stringify({ ...payload, sub: String(b.result.memberId) })).toString("base64url");
  expect(await request("payload 변조", "GET", "/members/me", undefined, parts.join(".")), 401, "AUTH401_3");
  expect(await request("형식 오류 토큰", "GET", "/members/me", undefined, "invalid"), 401, "AUTH401_3");
  expect(await request("별점 소수 거부", "POST", "/ratings", { movieId: 155, score: 2.5 }, tokenA), 400, "COMMON400");
  expect(await request("별점 범위 거부", "POST", "/ratings", { movieId: 155, score: 6 }, tokenA), 400, "COMMON400");
  const publicRatings = await request("공개 평점 조회 유지", "GET", `/members/${a.result.memberId}/ratings`);
  assert.equal(publicRatings.status, 200);
  assert.deepEqual(publicRatings.data, []);
  const email = await request("가입한 이메일 중복 확인", "GET", `/members/email/${encodeURIComponent(userA.email)}`);
  assert.equal(email.data.available, false);
  const nicknameCheck = await request("사용 가능 닉네임 확인", "GET", `/members/nickname/${encodeURIComponent(`새값${stamp.slice(-7)}`)}`);
  assert.equal(nicknameCheck.data.available, true);
  const preflight = await fetch(base + "/ratings", { method: "OPTIONS", headers: {
    Origin: "http://127.0.0.1:5173", "Access-Control-Request-Method": "POST",
    "Access-Control-Request-Headers": "authorization,content-type",
  } });
  assert.equal(preflight.status, 200);
  assert.equal(preflight.headers.get("access-control-allow-origin"), "http://127.0.0.1:5173");
  assert.match(preflight.headers.get("access-control-allow-headers"), /authorization/i);
  checks.push({ name: "실제 CORS preflight", status: preflight.status,
    allowOrigin: preflight.headers.get("access-control-allow-origin"), allowHeaders: preflight.headers.get("access-control-allow-headers") });
  const oldWrite = await request("기존 memberId 쓰기 경로 제거", "POST", `/members/${a.result.memberId}/ratings`, { movieId: 550, score: 5 });
  assert.equal(oldWrite.status, 405);
  passed = true;
  console.log(`Week07: ${checks.length} checks passed against the running backend (MySQL).`);
} finally {
  if (ratingId && tokenA) await request("검증용 평점 정리", "DELETE", `/ratings/${ratingId}`, undefined, tokenA).catch(() => {});
  await mkdir("docs/evidence/week07", { recursive: true });
  await writeFile("docs/evidence/week07/api-responses.json", JSON.stringify({
    recordedAt: new Date().toISOString(), runtime: "Node fetch → running Spring Boot → local MySQL; not Postman screenshots",
    passed, checks,
  }, null, 2));
}
