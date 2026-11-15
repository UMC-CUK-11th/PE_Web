# 7주차 구현·학습 진행 기록

> **2026-11-11 최신 상태:** 사용자 요청으로 아래 초기 계획의 필수 코드를 구현했다. FE 빌드·lint, BE 테스트 13개, 실제 MySQL API 검증 31개 항목이 통과했다. 상세 구현·정확한 미검증 범위·제출 캡처 순서는 [최신 구현 기록](week07-implementation.md)을 기준으로 한다. 아래 체크박스와 '현재 작은 단계'는 11월 10일 시작 당시 기록이다.

- 시작일: 2026-11-10 (KST)
- 제출 마감: **2026-11-11 수요일 23:59 (KST)**
- 이 문서는 진행표다. 기능 구현, 실제 실행 확인, 사용자 설명 확인, 제출 완료를 구분한다.
- 사용자 학습 후기와 이해도는 대신 작성하지 않는다. 확인하지 않은 기능은 완료로 표시하지 않는다.

## 확인한 자료

- 사용자 제공 7주차 FE·BE 텍스트 두 파일의 본문과 마지막 미션·체크리스트·제출 안내를 확인했다.
- 연결된 Notion의 [7주차 FE 원본](https://app.notion.com/p/670234d8038b824ca2890151a59def2f)과 [7주차 BE 원본](https://app.notion.com/p/ef6234d8038b82bc97418139dbc6b836)을 확인했다.
- BE는 Java·Spring Boot를 기준으로 한다. NestJS 구현은 적용하지 않는다.
- 원본에서 [회원가입 Figma 디자인](https://www.figma.com/design/erFuXxEy5svB8Be5gjIqdu?node-id=42-2731) 링크를 찾았다. 웹 읽기 도구는 이 URL에 접근하지 못했다. 디자인 화면·치수와 로그인·내 정보 프레임은 아직 확인하지 않았다.
- 텍스트의 `!image.png`, `attachment:` 참조 자체에는 이미지 내용이 없다. Notion 원본에서 이미지 참조는 찾았지만 이미지 내용은 아직 보지 않았다.
- 사용자가 추가 제공한 6주차 기록에는 브라우저 Query Devtools·Network 확인 및 FE/BE 캡처 완료가 기재되어 있다. 해당 기록을 이전 로컬 문서의 '미검증'보다 최신으로 취급하되, 이미지 원본을 직접 검토한 것으로 표시하지 않는다.

## 시작 시 프로젝트 상태

- Git 브랜치: `week06`; 시작 시 추적 파일·미추적 파일 변경 없음. 기존 코드는 유지했다.
- 적용되는 `AGENTS.md`는 저장소와 확인한 상위 경로에서 발견하지 못했다.
- `FE/umcine`: 현재 React·TypeScript·Vite 앱.
- `BE/movie`: 현재 Java·Spring Boot 영화 API.
- `FE/week1-typescript`, `BE/study`: 이전 학습 코드 보존.
- 안내·계약: 루트 README, FE README, `docs/api-spec.md`, `docs/week05-progress.md`, `docs/week06-progress.md`.
- Node 24.21.0, pnpm 12.4.2, Java Temurin 21.0.12.1, Gradle wrapper 8.14.3.
- 실제 설치 목록: React 19.3.0, TypeScript 6.0.3, Vite 8.3.0, TanStack Query 5.105.0, Router 1.170.40, ky 2.0.0. Spring Boot 설정은 3.5.0.
- 시작 시 5173·8080 연결 거부, MySQL 3306 TCP 연결 성공. 이 사실만으로 DB 로그인·쿼리 성공을 뜻하지는 않는다.

## 재사용할 기존 구현

- [x] FE 영화 목록·검색·상세 useQuery, QueryClientProvider, 개발 도구, 60초/30초 staleTime 코드.
- [x] FE `/members`의 이메일·닉네임 중복 확인 및 회원별 평점 조회 코드.
- [x] BE 회원가입 DTO 검증 → 중복 검사 → bcrypt 저장 → 비밀번호 없는 DTO 응답 코드.
- [x] BE 평점 등록·수정·삭제, 중복 검사·소유권 비교, 전역 오류 응답 코드.
- [x] 기존 FE TypeScript·프로덕션 빌드 성공, lint 오류 0. 검색 입력 동기화 Effect 경고 1개는 기존 항목.
- [x] 기존 BE build·H2/MockMvc 통합 테스트 5개 통과. 실제 MySQL API 검증은 이번 세션에서 아직 하지 않았다.

## 7주차 필수 범위

### FE 본문 실습

- [ ] 3.1 `/signup` 라우트와 회원가입 화면을 실제 브라우저에서 확인.
- [ ] 3.2 이메일·닉네임·비밀번호·비밀번호 확인 입력과 상태 연결.
- [ ] 이메일 형식, 닉네임 2~12자, 비밀번호 대/소문자·숫자·특수문자 포함 8자 이상, 비밀번호 일치 검사.
- [ ] 입력을 시작한 필드의 오류 표시와 제출 가능 조건.
- [ ] 3.3 이메일·닉네임 중복 확인 API 연결. `available: true`는 사용 가능.
- [ ] 중복 확인 중 해당 입력·버튼 비활성화, 성공·중복·요청 실패 안내.
- [ ] 확인한 값을 수정하면 그 필드의 중복 확인 결과 초기화.
- [ ] 입력 조건과 이메일·닉네임 중복 확인을 모두 통과해야 제출 가능.
- [ ] 3.4 POST `/members`: email·nickname·password만 보내고 passwordConfirm 제외.
- [ ] 가입 요청 중 재제출 방지·버튼 비활성화·'가입 중' 표시.
- [ ] 성공 메시지, 실패 시 입력값 유지 및 재시도 확인. 이번 주는 useState로 요청 상태 직접 관리.

### FE 마지막 필수 미션

- [ ] 디자인에 맞춘 로그인 화면과 경로.
- [ ] 내 정보 조회 화면과 경로.
- [ ] 내 정보 수정 화면과 경로, 입력값 반영.
- [ ] 각 페이지에 실제 접속해 표시·입력 확인.

로그인·내 정보 조회/수정의 **FE API 연동은 8주차 범위**다. 7주차에는 화면을 구현한다. BE의 동일 API는 7주차 필수다.

### BE 준비와 본문 실습 1~6

- [ ] jjwt-api/impl/jackson 0.12.6, JWT_SECRET·JWT_ACCESS_EXPIRATION 설정. 비밀값은 Git 제외.
- [ ] ApiException과 기존 GlobalExceptionHandler 연결. 기존 오류 처리는 보존.
- [ ] 실습 1: LoginRequest/Response, 이메일 회원 조회, bcrypt matches, JWT 발급, POST `/auth/login`.
- [ ] 없는 이메일·틀린 비밀번호 모두 401 / AUTH401_1 및 동일 메시지.
- [ ] JWT를 jwt.io에서 디코딩해 sub·email·exp 확인. 비밀번호가 payload에 없는지 확인.
- [ ] 실습 2: AuthInterceptor의 Bearer 추출 → 서명/만료 검증 → 요청에 memberId 저장.
- [ ] WebConfig 등록: 공개 API는 계속 공개, OPTIONS 통과, CORS에 Authorization 허용.
- [ ] 실습 3: GET `/members/me`, 토큰 회원의 email·nickname·createdAt만 응답.
- [ ] 실습 4: PATCH `/members/me`, 닉네임 검증·중복 검사·변경. 자기 닉네임 유지는 허용.
- [ ] 실습 5: POST `/ratings`, PATCH·DELETE `/ratings/{ratingId}`. 쓰기 API의 memberId 출처를 토큰으로 변경.
- [ ] 공개 GET `/members/{memberId}/ratings`는 유지. 예전 쓰기 경로로 타인 명의 요청 불가 확인.
- [ ] 평점 등록 201·수정 200에서 result는 RatingResponse. 삭제는 **200 / COMMON200 / result:null**.
- [ ] 실습 6: 없는 토큰 401 / AUTH401_2, 변조 401 / AUTH401_3, 타인 평점 403 / RATING403_1.
- [ ] 없는 평점 404 / RATING404_1, 같은 영화 중복 평점 409 / RATING409_1.
- [ ] 닉네임 중복 MEMBER409_1, 없는 회원 MEMBER404_1. 오류 공통 JSON 유지.

### BE 마지막 필수 미션: Postman 9단계

- [ ] A·B 가입 → 각각 로그인 → A 평점 등록 → 같은 영화 중복 등록 → A 수정 → B 수정 403 → 토큰 제거 401 → 없는 평점 삭제 404 → A 삭제 200.
- [ ] 헤더의 토큰만 바꿨을 때 403이 되는 이유를 사용자가 설명.
- [ ] 토큰 없이 요청하면 401이 되는 이유를 사용자가 설명.

## 이번 기능에 필요한 선행 보완

- [x] FE 패키지 접근·실행 파일 문제 복구, 기존 빌드 재검증.
- [x] Gradle 사용자 캐시 경로를 실행 명령에서 명시해 기존 빌드 재검증.
- [ ] 회원가입 폼·회원 API 요청 함수 연결. 기존 `src/api/members.ts`를 재사용/분리할 때 중복 구현을 피한다.
- [ ] MemberRepository.findByEmail 및 닉네임 변경 메서드 추가.
- [ ] CORS Authorization 허용 및 JWT 환경 설정 추가.

이전 주차 전체를 재구현할 필요는 없다. 현재 CORS는 Content-Type·Accept만 허용하므로 인증 헤더 연결 단계에서 보완한다. 기존 프로젝트에는 `@/` 별칭 설정이 없어 현재 상대 경로 import 방식을 따른다.

## 제출할 기록과 캡처

- [ ] BE 로그인 성공: POST URL·200·COMMON200·result.accessToken 표시.
- [ ] BE 토큰 없는 GET `/members/me`: 401·AUTH401_2 표시.
- [ ] BE B 토큰으로 A 평점 PATCH: 403·RATING403_1 표시.
- [ ] BE A의 POST `/ratings`: 바디에 memberId 없음, 201·COMMON201·result.ratingId 표시.
- [ ] FE 회원가입 검증·중복 확인·진행·성공/실패 결과와 로그인·내 정보 화면 확인 결과 기록. FE 워크북은 고정 캡처 장수를 지정하지 않았다.
- [ ] 실제 작성한 핵심 코드와 확인 결과, BE 중간 과정, 실제 발생한 오류·해결 기록. 설명 확인 전 '이해했다'라고 쓰지 않는다.
- [ ] 인증/인가·JWT·bcrypt·Bearer·Interceptor·401/403 핵심 키워드와 본인 학습 후기 작성.
- [ ] 스터디 인증 사진 첨부 여부 확인.
- [ ] 코드 링크와 Notion 미션 기록, 공유 링크 접근 확인 후 umc.ai.kr 제출. 외부 업로드·제출은 아직 수행하지 않았다.

## 선택·마감 후 복습

- FE 인증 필요 페이지 폴더 설계만 하기. 이번 선택 미션에는 layout·접근 제한 구현이 없다.
- React Hook Form 심화, BE 토큰 만료 60초 체험·캡처, @LoginMember/ArgumentResolver.
- 주의: BE 예제는 clockSkewSeconds(60)이 있어 유효기간 60초 뒤에도 최대 60초 여유가 적용된다. 만료 검증 시 이를 구분한다.
- queryOptions, Suspense/ErrorBoundary, 객체·배열 상태 갱신, TypeScript 키 타입, Spring 주입·트랜잭션 상세 복습.
- 블로그·지식in 상점 활동·CodeRabbit은 필수 기능·검증 후 진행.

## 현재 작은 단계

- `/signup` 라우트와 이메일 상태·표시·초기화 틀을 준비했다.
- 이메일 input은 `readOnly` 상태다. 사용자가 `onChange` 한 줄로 입력 → setEmail → 다음 render의 email → 화면 표시를 연결할 차례다.
- 현재 전체 회원가입 기능은 미완료다. 이 틀을 제출 완료 화면으로 취급하지 않는다.

## 이번 세션에서 실제 겪은 환경 오류

아래는 에이전트의 실행 준비 과정이며 사용자 본인이 해결한 경험으로 쓰지 않는다.

1. FE: `TS2307: Cannot find module 'ky' or its corresponding type declarations.` 및 TanStack Query 모듈 오류. 제한된 실행 환경에서 기존 패키지 경로 접근이 거부됐다. 설치 재시도도 `ERR_PNPM_PACKAGE_MANAGER_REMOVE_MODULES_DIR` / 액세스 거부로 실패했고 한때 실행 파일이 없어 `tsc is not recognized`가 발생했다. 일반 사용자 권한으로 `corepack.cmd pnpm@12.4.2 install --frozen-lockfile`을 완료한 뒤 같은 권한으로 build·lint가 통과했다. 추적 중인 package.json·lockfile 버전은 바꾸지 않았다.
2. BE: `Could not create parent directory for lock file C:\.gradle\wrapper\dists\...`로 시작 실패. 저장소 내부 별도 캐시를 이용한 오프라인 시도는 Spring Boot 플러그인을 찾지 못했다. 기존 사용자 캐시를 쓸 수 있는 실행 환경에서 GRADLE_USER_HOME을 `C:\Users\prote\.gradle`로 지정하자 build·test가 통과했다. 시스템 환경 변수나 실행 정책은 변경하지 않았다.
