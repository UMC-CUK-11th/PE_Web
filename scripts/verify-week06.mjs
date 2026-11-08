import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = "http://127.0.0.1:8080";
const checks = [];
const stamp = Date.now().toString();
const testPassword = "Umcine123!";
const user = { email: "umc06_" + stamp + "@example.com", nickname: "검증A" + stamp.slice(-6), password: testPassword };

async function request(method, path, body) {
  const response = await fetch(base + path, {
    method, headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(15000),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  checks.push({ method, url: base + path,
    ...(body ? { request: { ...body, ...(body.password ? { password: "[test password redacted]" } : {}) } } : {}),
    status: response.status, response: data, ...(response.status === 204 ? { bodyBytes: text.length } : {}) });
  return { status: response.status, data, text };
}

try {
  const signup = await request("POST", "/members", user);
  assert.equal(signup.status, 201);
  assert.equal(signup.data.isSuccess, true);
  assert.ok(!Object.hasOwn(signup.data.result, "password"));
  const memberId = signup.data.result.memberId;
  const other = await request("POST", "/members", { ...user, email: "other_" + stamp + "@example.com", nickname: "검증B" + stamp.slice(-6) });
  assert.equal(other.status, 201);
  const otherId = other.data.result.memberId;

  assert.equal((await request("POST", "/members", { ...user, nickname: "검증C" + stamp.slice(-6) })).status, 409);
  assert.equal((await request("POST", "/members", { ...user, email: "duplicate_" + stamp + "@example.com" })).status, 409);
  assert.equal((await request("POST", "/members", { ...user, email: "bad-email" })).status, 400);
  assert.equal((await request("POST", "/members", { ...user, nickname: "가" })).status, 400);
  assert.equal((await request("POST", "/members", { ...user, password: "weak" })).status, 400);

  const path = "/members/" + memberId + "/ratings";
  const rating = await request("POST", path, { movieId: 550, score: 5, comment: "실제 MySQL API 검증용 후기" });
  assert.equal(rating.status, 201);
  const ratingId = rating.data.result;
  assert.equal((await request("POST", path, { movieId: 550, score: 4 })).status, 409);
  assert.equal((await request("POST", path, { movieId: 155, score: 6 })).status, 400);
  assert.equal((await request("POST", path, { movieId: 155, score: 2.5 })).status, 400);
  assert.equal((await request("POST", path, { movieId: 0, score: 5 })).status, 400);
  assert.equal((await request("POST", path, { movieId: 155, score: 5, comment: "가".repeat(501) })).status, 400);
  const before = await request("GET", path);
  assert.equal(before.data.length, 1);
  assert.equal(before.data[0].score, 5);

  const item = path + "/" + ratingId;
  const otherItem = "/members/" + otherId + "/ratings/" + ratingId;
  assert.equal((await request("PATCH", otherItem, { score: 4 })).status, 403);
  assert.equal((await request("DELETE", otherItem)).status, 403);
  assert.equal((await request("PATCH", path + "/999999999", { score: 4 })).status, 404);
  assert.equal((await request("DELETE", path + "/999999999")).status, 404);
  assert.equal((await request("POST", "/members/999999999/ratings", { movieId: 550, score: 5 })).status, 404);
  assert.equal((await request("PATCH", item, { score: 4, comment: "수정된 후기" })).status, 200);
  const updated = await request("GET", path);
  assert.equal(updated.data[0].score, 4);
  assert.equal(updated.data[0].comment, "수정된 후기");
  const deleted = await request("DELETE", item);
  assert.equal(deleted.status, 204);
  assert.equal(deleted.text, "");
  assert.deepEqual((await request("GET", path)).data, []);
  for (const check of checks.filter((check) => check.status >= 400)) {
    assert.equal(check.response.isSuccess, false);
    assert.equal(typeof check.response.code, "string");
    assert.equal(typeof check.response.message, "string");
    assert.equal(check.response.result, null);
  }
  const evidence = { recordedAt: new Date().toISOString(), runtime: "Node HTTP + real MySQL backend (not browser)",
    testMemberId: memberId, testEmail: user.email, checks };
  const directory = new URL("../docs/evidence/week06/", import.meta.url);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL("api-responses.json", directory), JSON.stringify(evidence, null, 2) + "\n");
  console.log(JSON.stringify({ ok: true, checks: checks.length, memberId, testedStatuses: [200, 201, 204, 400, 403, 404, 409] }));
} catch (error) {
  console.error(JSON.stringify({ ok: false, errorType: error.name, message: error instanceof assert.AssertionError ? error.message : "API verification failed", networkCode: error.cause?.code }));
  process.exitCode = 1;
}
