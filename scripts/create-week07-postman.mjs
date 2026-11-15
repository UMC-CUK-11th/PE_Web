import { mkdir, writeFile } from "node:fs/promises";

function item(name, method, path, { body, token, status = 200, code, tests = [] } = {}) {
  return { name, request: {
    method,
    header: [...(body ? [{ key: "Content-Type", value: "application/json" }] : []),
      ...(token ? [{ key: "Authorization", value: `Bearer {{${token}}}` }] : [])],
    url: `{{baseUrl}}${path}`,
    ...(body ? { body: { mode: "raw", raw: JSON.stringify(body, null, 2), options: { raw: { language: "json" } } } } : {}),
  }, event: [{ listen: "test", script: { type: "text/javascript", exec: [
    `pm.test('HTTP ${status}', () => pm.response.to.have.status(${status}));`,
    ...(code ? [`pm.test('${code}', () => pm.expect(pm.response.json().code).to.eql('${code}'));`] : []), ...tests,
  ] } }] };
}

const signupA = item("1-A. 검증 회원 A 가입", "POST", "/members", {
  body: { email: "umc07a_{{stamp}}@example.com", nickname: "A{{shortStamp}}", password: "{{testPassword}}" }, status: 201, code: "COMMON201",
});
signupA.event.unshift({ listen: "prerequest", script: { type: "text/javascript", exec: [
  "const stamp = Date.now().toString();", "pm.collectionVariables.set('stamp', stamp);",
  "pm.collectionVariables.set('shortStamp', stamp.slice(-8));",
] } });
const collection = {
  info: { name: "UMC 11기 7주차 필수 인증·인가", schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    description: "로컬 Spring Boot를 실행한 뒤 위에서 아래로 요청합니다. 테스트 회원 2명을 생성하고 평점은 마지막에 삭제합니다. 최종 제출 캡처는 실제 요청 결과에서 촬영하세요." },
  variable: [{ key: "baseUrl", value: "http://127.0.0.1:8080" }, { key: "testPassword", value: "Umcine123!" },
    ...["stamp", "shortStamp", "tokenA", "tokenB", "ratingId"].map(key => ({ key, value: "" }))],
  item: [
    { name: "본문 9단계 (위에서 아래로 실행)", item: [
      signupA,
      item("1-B. 검증 회원 B 가입", "POST", "/members", { body: { email: "umc07b_{{stamp}}@example.com", nickname: "B{{shortStamp}}", password: "{{testPassword}}" }, status: 201, code: "COMMON201" }),
      item("2-A. 로그인 성공 [캡처 1]", "POST", "/auth/login", { body: { email: "umc07a_{{stamp}}@example.com", password: "{{testPassword}}" }, code: "COMMON200",
        tests: ["if (pm.response.code === 200) pm.collectionVariables.set('tokenA', pm.response.json().result.accessToken);"] }),
      item("2-B. B 로그인", "POST", "/auth/login", { body: { email: "umc07b_{{stamp}}@example.com", password: "{{testPassword}}" }, code: "COMMON200",
        tests: ["if (pm.response.code === 200) pm.collectionVariables.set('tokenB', pm.response.json().result.accessToken);"] }),
      item("3. A 평점 등록 [캡처 4: Body와 201]", "POST", "/ratings", { token: "tokenA", body: { movieId: 550, score: 5, comment: "7주차 실습" }, status: 201, code: "COMMON201",
        tests: ["if (pm.response.code === 201) pm.collectionVariables.set('ratingId', pm.response.json().result.ratingId);"] }),
      item("4. 같은 영화 중복 등록 409", "POST", "/ratings", { token: "tokenA", body: { movieId: 550, score: 4 }, status: 409, code: "RATING409_1" }),
      item("5. A 본인 평점 수정", "PATCH", "/ratings/{{ratingId}}", { token: "tokenA", body: { score: 4, comment: "수정한 후기" }, code: "COMMON200" }),
      item("6. B가 A 평점 수정 [캡처 3: 403]", "PATCH", "/ratings/{{ratingId}}", { token: "tokenB", body: { score: 2 }, status: 403, code: "RATING403_1" }),
      item("7. 토큰 없이 수정 401", "PATCH", "/ratings/{{ratingId}}", { body: { score: 2 }, status: 401, code: "AUTH401_2" }),
      item("8. 없는 평점 삭제 404", "DELETE", "/ratings/999999999", { token: "tokenA", status: 404, code: "RATING404_1" }),
      item("9. A 본인 평점 삭제 200", "DELETE", "/ratings/{{ratingId}}", { token: "tokenA", code: "COMMON200" }),
    ] },
    { name: "내 정보·로그인 실패 추가 실습", item: [
      item("토큰 없는 내 정보 [캡처 2: 401]", "GET", "/members/me", { status: 401, code: "AUTH401_2" }),
      item("A 내 정보 조회", "GET", "/members/me", { token: "tokenA", code: "COMMON200" }),
      item("A 내 정보 수정", "PATCH", "/members/me", { token: "tokenA", body: { nickname: "변경{{shortStamp}}" }, code: "COMMON200" }),
      item("잘못된 비밀번호", "POST", "/auth/login", { body: { email: "umc07a_{{stamp}}@example.com", password: "wrong" }, status: 401, code: "AUTH401_1" }),
      item("없는 이메일 (같은 응답 확인)", "POST", "/auth/login", { body: { email: "missing_{{stamp}}@example.com", password: "{{testPassword}}" }, status: 401, code: "AUTH401_1" }),
      item("변조·형식 오류 토큰", "GET", "/members/me", { token: "invalidToken", status: 401, code: "AUTH401_3" }),
    ] },
  ],
};
collection.variable.push({ key: "invalidToken", value: "invalid" });
await mkdir("docs/postman", { recursive: true });
await writeFile("docs/postman/week07.postman_collection.json", JSON.stringify(collection, null, 2) + "\n");
console.log("Created docs/postman/week07.postman_collection.json (no live tokens).");
