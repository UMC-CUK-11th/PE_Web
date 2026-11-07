import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { createServer } from "../FE/umcine/node_modules/vite/dist/node/index.js";

// Isolated fixture transport: no live backend, accounts, or secret values.
const originalFetch = globalThis.fetch;
const originalBaseUrl = process.env.VITE_BACKEND_API_BASE_URL;
process.env.VITE_BACKEND_API_BASE_URL = "http://localhost:3000";
const requests = [];
let responseBody = { available: true };
let responseStatus = 200;
globalThis.fetch = async (input, init) => {
  const request = new Request(input, init);
  requests.push(request);
  return new Response(JSON.stringify(responseBody), {
    status: responseStatus,
    headers: { "content-type": "application/json" },
  });
};

let server;
try {
  server = await createServer({
    root: fileURLToPath(new URL("../FE/umcine/", import.meta.url)),
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "error",
  });
  const { validateSignup, isValidNickname } = await server.ssrLoadModule(
    "/src/utils/auth/validation.ts",
  );
  const validValues = {
    email: "test@umc.com",
    nickname: "테스트",
    password: "Test1234!",
    passwordConfirm: "Test1234!",
  };
  assert.ok(Object.values(validateSignup(validValues)).every(Boolean));
  for (const email of ["", "invalid", "a@b", "a b@umc.com"]) {
    assert.equal(validateSignup({ ...validValues, email }).email, false);
  }
  for (const length of [0, 1, 13])
    assert.equal(isValidNickname("가".repeat(length)), false);
  for (const length of [2, 12])
    assert.equal(isValidNickname("가".repeat(length)), true);
  for (const password of [
    "",
    "Test12!",
    "test1234!",
    "TEST1234!",
    "Testtest!",
    "Test12345",
    "Test1234! ",
    "Test1234!한",
    "Test1234!?",
  ]) {
    assert.equal(validateSignup({ ...validValues, password }).password, false);
  }
  assert.equal(
    validateSignup({ ...validValues, passwordConfirm: "" }).passwordConfirm,
    false,
  );
  assert.equal(
    validateSignup({ ...validValues, passwordConfirm: "different" })
      .passwordConfirm,
    false,
  );
  console.log(
    "PASS: workbook validation, boundaries, and confirmation matching",
  );

  const members = await server.ssrLoadModule("/src/api/members.ts");
  const { getRequestErrorMessage } = await server.ssrLoadModule(
    "/src/utils/auth/request-error.ts",
  );
  assert.equal((await members.checkEmail("test+tag@umc.com")).available, true);
  assert.equal(
    requests.at(-1).url,
    "http://localhost:3000/members/email/test%2Btag%40umc.com",
  );
  responseBody = { available: false };
  assert.equal((await members.checkNickname("영화/산책")).available, false);
  assert.ok(requests.at(-1).url.endsWith(encodeURIComponent("영화/산책")));
  responseBody = [];
  assert.deepEqual(await members.getMemberRatings(1), []);
  assert.equal(requests.at(-1).url, "http://localhost:3000/members/1/ratings");
  console.log(
    "PASS: existing members exports, encoded duplicate endpoints, and rating compatibility",
  );

  responseStatus = 201;
  responseBody = {
    isSuccess: true,
    code: "COMMON201",
    message: "회원가입에 성공했습니다.",
    result: {
      memberId: 7,
      email: validValues.email,
      nickname: validValues.nickname,
    },
  };
  assert.equal(
    (await members.signup(validValues)).message,
    responseBody.message,
  );
  const signupRequest = requests.at(-1);
  assert.equal(signupRequest.method, "POST");
  assert.equal(signupRequest.url, "http://localhost:3000/members");
  assert.deepEqual(await signupRequest.json(), {
    email: validValues.email,
    nickname: validValues.nickname,
    password: validValues.password,
  });
  assert.ok(requests.every((request) => !request.headers.has("Authorization")));
  console.log(
    "PASS: POST signup whitelists exactly email/nickname/password and sends no authentication header",
  );

  responseStatus = 200;
  responseBody = {
    isSuccess: false,
    code: "MEMBER409",
    message: "이미 사용 중인 이메일입니다.",
    result: null,
  };
  await assert.rejects(members.signup(validValues), {
    message: responseBody.message,
  });
  responseStatus = 409;
  await assert.rejects(members.signup(validValues), (error) => {
    assert.equal(
      getRequestErrorMessage(error, "fallback"),
      responseBody.message,
    );
    return true;
  });
  assert.equal(
    getRequestErrorMessage(new TypeError("Failed to fetch"), "연결 실패"),
    "연결 실패",
  );
  console.log(
    "PASS: application failures, HTTP failures, and network error messages",
  );
} finally {
  await server?.close();
  globalThis.fetch = originalFetch;
  if (originalBaseUrl === undefined)
    delete process.env.VITE_BACKEND_API_BASE_URL;
  else process.env.VITE_BACKEND_API_BASE_URL = originalBaseUrl;
}
