# Week07 Frontend 구현 기록

## 작업 기준

- 저장소: `PE_Web`, 작업 브랜치: 기존 `week07` 유지
- 실제 로컬 경로: `C:/Users/proce/OneDrive/바탕 화면/UMC11TH`
- 프론트엔드: `FE/umcine`
- 백엔드 기본 주소: `http://localhost:3000`
- 기존 백엔드 소스, 영화 API·화면·컴포넌트, 북마크 store, QueryClient, Devtools 설정 및 의존성 파일은 변경하지 않았다.
- 기존 미추적 `PE_Web/` 폴더는 이번 작업과 커밋에서 제외했다.
- 원격 push 및 PR 생성은 진행하지 않는다.

## 1. 생성한 파일

경로는 저장소 루트 기준이다.

```text
FE/umcine/src/api/api-client.ts
FE/umcine/src/api/members/check-email-duplicate.ts
FE/umcine/src/api/members/check-nickname-duplicate.ts
FE/umcine/src/api/members/models.ts
FE/umcine/src/api/members/signup.ts
FE/umcine/src/components/auth/auth-panel.tsx
FE/umcine/src/components/auth/form-styles.ts
FE/umcine/src/hooks/use-duplicate-check.ts
FE/umcine/src/pages/auth/signup-page.tsx
FE/umcine/src/pages/auth/login-page.tsx
FE/umcine/src/pages/my/demo-profile.ts
FE/umcine/src/pages/my/my-page.tsx
FE/umcine/src/pages/my/my-edit-page.tsx
FE/umcine/src/routes/signup.tsx
FE/umcine/src/routes/login.tsx
FE/umcine/src/routes/my.tsx
FE/umcine/src/routes/my_.edit.tsx
FE/umcine/src/utils/auth/validation.ts
FE/umcine/src/utils/auth/request-error.ts
scripts/verify-week07-auth-contracts.mjs
scripts/verify-week07-auth-ui.mjs
WEEK07_FRONTEND_IMPLEMENTATION.md
```

## 2. 수정한 파일

- `FE/umcine/src/config/env.ts`: 백엔드 URL 접근자를 추가했다. 환경변수가 없으면 3000 포트를 사용한다.
- `FE/umcine/src/api/members.ts`: 기존 함수·타입의 import를 유지하도록 re-export하고, 평점 조회에는 공통 API Client를 사용한다.
- `FE/umcine/src/components/layout/header.tsx`: 기존 메뉴를 유지하고 로그인·회원가입·내 정보 링크를 추가했다. 좁은 화면에서는 메뉴가 다음 줄로 이동한다.
- `FE/umcine/src/routeTree.gen.ts`: Router 플러그인이 새 route 파일을 읽어 자동 생성했다. 수동 편집하지 않았다.

## 3. 회원가입 Validation

- 이메일: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- 닉네임: 길이 2~12자
- 비밀번호: 영문 대문자·소문자·숫자·`!@#$%^&*` 중 특수문자를 모두 포함하며, 허용된 문자로 8자 이상
- 비밀번호 확인: 비어 있지 않고 비밀번호와 동일한 값
- 빈 필드에는 오류를 표시하지 않고, 입력된 값이 유효하지 않으면 필드 아래에 오류를 표시한다.
- 네 필드가 모두 유효하고 이메일·닉네임 중복 확인을 통과해야 가입할 수 있다.
- label, 비밀번호 type, 자동완성 속성, 오류 설명 연결, focus 표시 및 disabled 스타일을 적용했다.

## 4. 이메일·닉네임 중복 확인

- `GET /members/email/{email}`, `GET /members/nickname/{nickname}`을 기존 API와 공유한다.
- 입력값은 URL 경로에서 `encodeURIComponent`로 인코딩한다.
- 유효한 입력값만 확인할 수 있고, 요청 중 해당 input과 버튼을 잠그며 `확인 중`을 표시한다.
- `available === true`이면 사용 가능, 그 외에는 중복 메시지를 표시한다. 요청 실패는 재시도 안내를 표시한다.
- 결과는 확인 당시 값과 함께 저장한다. 값을 수정하면 결과를 초기화하므로 원래 값으로 되돌려도 다시 확인해야 한다.
- ref로 동시 요청을 차단하고, revision을 비교해 이전 요청 결과가 초기화 이후 다시 적용되는 것도 방지한다.

## 5. 회원가입 API 요청·응답

- `POST http://localhost:3000/members`
- 요청 객체는 `email`, `nickname`, `password` 세 필드만 명시적으로 만든다. `passwordConfirm`은 전송하지 않는다.
- `SignupRequest`, `SignupResponse` 타입을 정의하고 Spring Boot의 `isSuccess`, `code`, `message`, `result` 구조를 사용한다.
- HTTP 오류 및 `isSuccess: false`를 실패로 처리한다.
- `useState`의 `isSubmitting`과 ref로 요청 상태를 관리한다. `useMutation`은 사용하지 않는다.
- 요청 중 폼과 가입 버튼을 잠그고 `가입 중`을 표시한다.
- 성공 시 서버의 `message`를 표시하고 비밀번호를 비운다. 성공한 폼은 재제출하지 못하게 한다.
- 실패 시 입력값을 유지하고 오류 메시지와 재시도 가능한 버튼을 제공한다.

## 6. 로그인 화면

`/login`에 이메일·비밀번호 입력, 로그인 버튼, 회원가입 링크를 만들었다. 입력은 React 로컬 상태에 반영하며, 제출하면 기능 준비 안내만 표시한다. 로그인 API나 토큰 저장은 구현하지 않았다.

## 7. 내 정보 조회·수정 화면

- `/my`: 예시 프로필의 이메일·닉네임·가입일과 내 정보 수정 링크를 표시한다.
- `/my/edit`: 닉네임 입력, 2~12자 검증, 수정 버튼, 취소 링크를 구현했다.
- 수정은 해당 화면의 로컬 미리보기에만 반영된다. 페이지 이동·새로고침 후에도 유지되는 실제 회원 정보 변경 기능이 아니다.
- `GET /members/me`, `PATCH /members/me`는 호출하지 않는다.

## 8. 선택 미션: 폴더 구조

회원가입·로그인은 `pages/auth`, 내 정보 조회·수정은 `pages/my`에 모았다. route 파일에는 연결 코드만 두어 화면과 라우팅 책임을 분리했다. `my_.edit.tsx`는 TanStack Router의 부모 route 제외 규칙을 사용하므로 URL `/my/edit`를 유지하면서 `/my` 조회 화면 안에 수정 화면이 중첩되지 않는다.

AuthPanel은 제목·설명을 표시하는 공통 UI일 뿐, 인증 Layout이나 접근 제한 기능이 아니다.

## 9~10. 검증 결과

- `pnpm lint`: 통과
- `pnpm build`: 통과
- 기존 Week06 Query 계약 테스트: 통과. 목록 캐시 재사용, 검색·상세 key 분리와 staleTime을 검증했다.
- Week07 API 계약 테스트: 통과. 입력 검증 경계값, URL 인코딩, 기존 함수 호환성, 정확한 가입 요청 필드, 인증 헤더 미포함, 서버 오류 처리를 검증했다.
- Week07 React DOM 테스트: 통과. 빈 입력·잘못된 입력, 중복 및 사용 가능 상태, 확인 중 잠금, 값 변경 시 재확인, 가입 실패 후 값 유지, 중복 제출 차단, 성공 메시지, 로그인·프로필 화면의 로컬 동작을 검증했다.
- 위 계약·DOM 테스트는 검증용 응답을 사용한다. 실제 Spring Boot/MySQL 회원가입 성공 결과를 의미하지 않는다.
- Windows 호스트에서 Vite의 신규 4개 경로와 기존 `/`, `/search`, `/api-test`, `/movies/550`에 HTTP 200 응답을 확인했다. SPA 문서 응답 확인이며 실제 브라우저에서의 시각적 검증과는 구분한다.
- Windows 호스트에서 `localhost:3000`에 읽기 전용 이메일 확인 요청을 보냈으나 연결이 거부됐다. 실제 중복 확인·회원가입·DB 저장은 백엔드 실행 후 추가 검증해야 한다.
- 실제 브라우저에서 데스크톱·모바일 레이아웃을 눈으로 확인하는 검증은 수행하지 않았다.

### 실행 명령

```powershell
cd FE/umcine
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm dev --host 127.0.0.1 --port 5173 --strictPort
```

프론트 주소: `http://localhost:5173/signup`, `/login`, `/my`, `/my/edit`

저장소 루트에서 계약 테스트:

```powershell
node scripts/verify-week06-query-contracts.mjs
node scripts/verify-week07-auth-contracts.mjs
```

선택 DOM 테스트는 jsdom을 Git에서 제외되는 테스트 전용 폴더에 설치한다. 프로젝트의 package.json·lockfile 및 런타임 의존성은 바꾸지 않는다.

```powershell
npm install --prefix .verification/week07-test-runtime --no-save --package-lock=false jsdom
node scripts/verify-week07-auth-ui.mjs
```

### 실제 백엔드 실행 후 남은 확인

1. `/signup`에서 사용 가능한 이메일과 닉네임을 확인한다.
2. 확인된 값을 수정하면 가입 버튼이 비활성화되는지 확인하고 재확인한다.
3. 유효한 비밀번호와 비밀번호 확인을 입력한다.
4. 가입 후 서버의 성공 메시지와 Network의 `POST /members` 응답을 확인한다.
5. 요청 payload에 `passwordConfirm`이 없고, 생성한 회원의 이메일·닉네임은 다시 조회했을 때 중복으로 나오는지 확인한다.

## 실제 이슈와 해결

### 프로젝트 이동 후 패키지 실행 실패

- 이슈: `vite/bin/vite.js`를 찾지 못해 개발 서버를 실행할 수 없었다.
- 원인: 이전 폴더에서 설치된 node_modules 연결이 새 프로젝트 위치에서 유효하지 않았다.
- 해결: 기존 lockfile을 유지하며 `pnpm install --frozen-lockfile`로 패키지 연결을 복원했다. pnpm의 저장소 링크 권한과 비대화식 재설치 조건을 맞춰 실행했다.

### 로컬 서버 접근 제한

- 이슈: 샌드박스에서 로컬 소켓 접근이 차단되고 그 안에서 실행한 개발 서버에 Windows 호스트 요청이 도달하지 않았다.
- 해결: 샌드박스의 개발 서버를 종료한 뒤 Windows 호스트 권한으로 다시 실행해 5173 포트에서 HTTP 응답을 확인했다.
- 남은 사항: 동일한 호스트 기준으로도 백엔드 3000 포트는 연결 거부 상태다. 백엔드 주소를 임의로 바꾸거나 다른 서버를 만들어 대체하지 않았다.

### DOM 테스트 환경 조정

- 이슈: Vite SSR로 불러온 화면을 DOM 테스트에 연결할 때 Router의 서버·클라이언트 분기 차이로 `Matches` 초기화 오류가 발생했다.
- 해결: 테스트에서 RouterContextProvider로 실제 페이지 컴포넌트에 라우터 문맥을 제공해 폼 동작을 검증했다. 프로덕션 라우터 설정은 변경하지 않았다.
- 한계: 이 DOM 테스트는 실제 브라우저의 전체 라우팅 동작을 검증하는 E2E 테스트가 아니다.

## 11. 커밋

기능 구현과 검증·문서를 나누어 로컬 커밋한다. 정확한 SHA와 메시지는 최종 작업 보고 및 `git log`에서 확인할 수 있다.

## 12. 8주차에 남겨둔 기능

로그인 API, JWT 저장·decode, 자동 Authorization 헤더, 로그인 상태 전역 관리, 내 정보 API 조회·수정, 인증 Layout, Route Guard, 접근 제한·로그인 리다이렉트, Refresh Token은 이번 작업에 포함하지 않았다.
