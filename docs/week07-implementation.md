# 7주차 필수 코드 구현·검증 기록

2026-11-11 KST. 사용자의 요청으로 에이전트가 필수 코드를 구현했다. 사용자의 직접 작성·이해도·학습 후기를 대신 주장하지 않는다.

## 2026-11-15 GitHub 제출 전 재검증

- 6주차 PR [#92](https://github.com/UMC-CUK-11th/PE_Web/pull/92)의 병합을 확인하고, 최신 `upstream/삼삼/장형택`을 기준으로 `week07` 브랜치를 생성했다.
- FE 프로덕션 빌드와 TypeScript 검사 통과. lint는 오류 0, 기존 `search-page.tsx`의 `react(set-state-in-effect)` 경고 1개다.
- BE 오프라인 빌드 통과. `test --offline --rerun-tasks --console=plain`으로 테스트 13개를 다시 실행하여 실패·오류·건너뜀 0을 확인했다.
- 제출 변경 파일에서 실제 로컬 비밀값과 JWT·API 키 포함 여부를 검사했다. `.env.local`, 의존성, 빌드 산출물은 Git 제외 대상이며, `.env.example`에는 설정 예시만 포함한다.
- 실제 MySQL API 31개 확인 항목은 11월 11일의 기록이다. 이번 재검증에서는 해당 요청과 브라우저·Postman 캡처를 다시 실행하지 않았다.
- GitHub 제출 방향은 `HollowBell/UMC-CUK-11th-PE_Web:week07` → `UMC-CUK-11th/PE_Web:삼삼/장형택`, PR 제목은 `Title: 7주차 미션_삼삼`이다.

## 구현 범위

| 요구사항 | 코드 | 실행 확인 |
| --- | --- | --- |
| FE 회원가입 입력·유효성 검사 | 구현 | TypeScript/Vite 빌드 통과, 실제 브라우저 입력은 아직 미확인 |
| 이메일·닉네임 중복 확인 및 변경 시 초기화 | 구현 | API 자체는 실제 MySQL에서 확인, UI 이벤트는 아직 미확인 |
| 회원가입 POST·진행·성공·실패 상태 | 구현 | BE 회원가입 실제 요청 통과, FE 제출 이벤트는 아직 미확인 |
| FE 로그인·내 정보 조회/수정 화면 | 구현 | 빌드 통과, 브라우저 직접 접근·입력 확인 필요 |
| 로그인·비밀번호 검증·JWT 발급 | 구현 | 통합 테스트 및 실제 MySQL 요청 통과 |
| Interceptor·ApiException·CORS | 구현 | 토큰 누락/변조 및 실제 Authorization preflight 통과 |
| GET/PATCH /members/me | 구현 | 본인 조회·수정·자기 닉네임 유지·타인 닉네임 중복·잘못된 입력 통과 |
| 토큰 기반 평점 등록/수정/삭제 | 구현 | 201·200·삭제 200/null·중복 409·타인 403·없는 평점 404 통과 |
| JWT 만료 응답 | 구현 | 단위 테스트에서 60초 clock skew를 넘긴 만료 토큰으로 AUTH401_4 확인 |
| Postman 9단계 | 컬렉션 준비 | 동일 순서의 Node 실제 API 검증 통과. Postman에서 직접 실행·캡처는 남음 |
| jwt.io 디코딩 실습 | 로컬 디코딩 검증 | jwt.io 화면에서 직접 확인은 남음 |
| 선택 미션·심화 | 미구현 | 필수 범위 우선 |

FE 로그인·내 정보 **API 연동은 8주차 범위**다. `/login`은 입력 화면이며 로그인 버튼에서 토큰을 발급하지 않는다. `/mypage`, `/mypage/edit`는 명시된 예시 프로필을 사용하며 수정은 브라우저 메모리의 예시 데이터에 반영된다. Spring의 로그인·내 정보 API는 실제 동작한다.

## 실제 검증

- `FE/umcine`: `corepack.cmd pnpm@12.4.2 build` 통과. Vite가 라우트 파일을 생성한 다음 TypeScript를 검사하도록 빌드 순서를 고쳤다.
- `corepack.cmd pnpm@12.4.2 lint`: 오류 0. 기존 search-page의 `react(set-state-in-effect)` 경고 1개.
- `BE/movie`: `gradlew.bat build --offline --console=plain` 통과. 통합 테스트 11개 + JwtUtil 단위 테스트 2개 = **13개, 실패 0, 오류 0**.
- `node scripts/verify-week07.mjs`: 실제 실행 중인 Spring Boot → 로컬 **MySQL 8.0.46**에서 **31개 확인 항목 통과**. 이 수는 JWT 디코딩·CORS 확인도 포함하므로 '31개 HTTP 요청'과는 다르다.
- 원본 요청·응답: `docs/evidence/week07/api-responses.json`. 비밀번호·accessToken은 저장할 때 가렸으며, 검증 중 실제 발급 토큰을 메모리에서 사용했다.
- 테스트 회원은 `umc07a_...@example.com`, `umc07b_...@example.com` 이름으로 생성했다. 테스트 평점은 삭제했다. 이전 사용자 데이터·시드는 삭제하지 않았다.
- FE·BE 개발 서버를 각각 5173·8080에서 실행했다. 이 사실만으로 브라우저 렌더링 확인을 완료한 것으로 표시하지 않는다.

## 핵심 코드와 흐름

### 1. 입력 → 상태 → 화면

`FE/umcine/src/pages/auth/signup-page.tsx`

```tsx
onChange={(event) => handleChangeField("email", event.target.value)}

setForm((prev) => ({ ...prev, [key]: value }));
```

예: 이메일 입력창의 `a`를 읽어 `handleChangeField("email", "a")`를 실행한다. 기존 객체의 다른 필드는 복사하고 email만 바꾼 새 객체를 React에 전달한다. 다음 render는 새 form.email로 입력창과 검증 결과를 표시한다.

중복 확인은 서버가 검사한 값에만 유효하다. 이메일·닉네임을 수정하면 그 필드의 isAvailable을 false로 초기화한다. 확인 중에는 해당 입력·버튼을 잠그고, 가입 중에는 폼과 가입 버튼을 잠근다.

### 2. 가입 요청

```tsx
const response = await signup({
  email: form.email.trim(),
  nickname: form.nickname.trim(),
  password: form.password,
});
```

passwordConfirm은 화면 검사용이므로 요청에서 제외한다. catch에서 form을 비우지 않아 실패해도 입력값이 남는다. finally에서 isSubmitting을 false로 되돌린다. 성공 응답은 메시지를 표시하고 같은 가입 요청의 재제출을 막는다.

### 3. 로그인 → 토큰

`BE/movie/src/main/java/com/umc/movie/service/AuthService.java`

```java
Member member = memberRepository.findByEmail(request.email())
        .orElseThrow(this::invalidLogin);
if (request.password().getBytes(StandardCharsets.UTF_8).length > 72
        || !passwordEncoder.matches(request.password(), member.getPassword())) {
    throw invalidLogin();
}
String accessToken = jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());
```

이메일로 회원을 찾고 저장된 bcrypt 해시와 입력 비밀번호를 비교한다. 두 실패 모두 AUTH401_1이다. 통과하면 sub=memberId, email, iat, exp를 담아 서명한다. payload에 password는 없다.

### 4. 토큰 → 요청자 → 평점 소유자

```java
Long memberId = jwtUtil.getMemberId(header.substring(BEARER_PREFIX.length()));
request.setAttribute(MEMBER_ID, memberId);
```

Interceptor가 서명·만료를 검사한 회원 번호만 요청 속성에 저장한다. Controller는 `@RequestAttribute(AuthInterceptor.MEMBER_ID)`로 이를 받아 Service에 넘긴다.

```java
if (!rating.getMember().getMemberId().equals(memberId)) {
    throw new ApiException(HttpStatus.FORBIDDEN, "RATING403_1",
            "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.");
}
```

토큰이 없어 요청자를 확인하지 못하면 401이다. B의 정상 토큰으로 A의 평점을 고치려 하면 요청자는 확인되지만 소유자가 달라 403이다. 실제 데이터베이스를 조회한 Service가 이 비교를 한다.

## 이번 구현 중 실제 오류·해결

아래는 에이전트가 겪은 과정이다. 사용자 본인의 경험으로 바꾸어 쓰지 않는다.

1. **새 라우트 타입 오류**: 기존 `tsc -b && vite build`는 라우트 자동 생성 전에 `/signup` 타입을 검사해 TS2345가 발생했다. `vite build && tsc -b`로 변경하여 생성된 routeTree를 대상으로 타입 검사했고 통과했다.
2. **테스트 구문 오류**: 새 AuthApiIntegrationTest의 중첩 호출 두 곳에 닫는 괄호가 하나씩 더 있어 `';' expected`가 발생했다. 두 괄호를 제거한 뒤 13개 테스트가 통과했다.
3. **서버 재시작 직후 연결 실패**: 백엔드가 준비되기 전에 검증기를 실행해 `ECONNREFUSED 127.0.0.1:8080`이 발생했다. 서버 시작 완료 뒤 다시 실행해 31개 확인 항목이 통과했다.
4. **워크북 예시 이미지 접근**: 제한된 실행 환경의 파일 다운로드가 실패했다. 허용된 실행 환경으로 같은 Notion 파일 URL을 내려받아 회원가입 전체 예시 이미지 2장을 확인했다. 이를 기준으로 회색 배경·폼 폭·필드 안의 중복 확인 배치를 맞췄다. Figma 원본의 로그인·내 정보 프레임과 정확한 디자인 비교는 아직 하지 않았다.

## 제출 직전 실행·캡처 순서

1. 현재 Postman Local Mode에서는 `docs/postman/UMC 11기 7주차 필수 인증·인가` 폴더를 펼친다. 기존 `week07.postman_collection.json`은 **Upgrade to v3**로 변환되어 YAML 요청 파일 17개로 나뉘었다. 메서드·URL·헤더·Body·스크립트·변수가 보존됐는지 재검토했다. 로컬 BE가 8080에서 실행 중이어야 한다.
2. '본문 9단계' 폴더를 위에서 아래로 실행한다. 새 A·B 회원, 토큰 A·B, ratingId가 컬렉션 변수로 연결된다.
3. **캡처 1**: `2-A. 로그인 성공` 요청에서 POST URL, HTTP 200, result.nickname과 **실제 accessToken**이 보이도록 촬영한다.
4. **캡처 4**: `3. A 평점 등록`에서 요청 Body의 movieId·score·comment와 HTTP 201·COMMON201·result.ratingId를 함께 촬영한다. memberId는 바디에 없다.
5. **캡처 3**: `6. B가 A 평점 수정`에서 HTTP 403·RATING403_1과 요청 URL을 촬영한다. 이 요청은 A의 평점이 삭제되기 전에 실행해야 한다.
6. **캡처 2**: 추가 실습 폴더의 `토큰 없는 내 정보`에서 GET /members/me, HTTP 401·AUTH401_2를 촬영한다.
7. A 토큰을 jwt.io에 붙여 payload의 sub·email·exp 및 password 부재를 직접 확인한다. 실습 전용 로컬 토큰만 사용한다.
8. 브라우저에서 `http://127.0.0.1:5173/signup`, `/login`, `/mypage`, `/mypage/edit`를 연다. 회원가입 잘못된 입력·중복 확인·값 수정 후 재확인·진행·실패 시 입력 유지·성공을 확인한다. 내 정보 수정 후 돌아가 닉네임 반영을 확인한다.
9. 직접 확인한 항목만 워크북에 완료 표시한다. 핵심 키워드·학습 후기는 본인이 설명할 수 있는 내용으로 작성한다.
10. 코드 링크·캡처·미션 기록을 Notion에 넣고 공유 URL을 `https://umc.ai.kr/`에 **11월 11일 23:59 KST 전** 제출한다. 외부 업로드·최종 제출은 아직 하지 않았다.

Postman을 쓰지 못할 때 `/api-check.html`도 실제 로컬 API를 호출한다. 로그인 성공 토큰을 자동으로 입력하고, 토큰 지우기·직접 붙여넣기로 401·403을 확인할 수 있다. 워크북의 Postman 직접 실행 여부와는 구분한다.

## 복습·설명 확인 (미완료)

- 입력값 변경 뒤 왜 새 객체를 setForm에 전달하는지.
- 비밀번호를 encode해서 문자열끼리 비교하면 안 되는 이유.
- JWT 디코딩과 서명 검증의 차이, payload에 비밀번호를 넣으면 안 되는 이유.
- A→B로 토큰만 바꾸었을 때 401이 아닌 403이 되는 이유.
- 생성·수정·삭제 응답과 기존 6주차 API에서 바뀐 부분.

공식 참고: [React useState](https://react.dev/reference/react/useState), [JJWT 0.12.6](https://github.com/jwtk/jjwt/tree/0.12.6), [Spring MVC Interceptors](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-config/interceptors.html).
워크북의 Interceptor 구성을 구현했다. Spring 공식 문서는 실제 서비스 보안 계층에는 Spring Security 또는 필터 기반 구성을 권장한다. 해당 전환은 이번 필수 실습 범위를 넘어선 복습 항목이다.
