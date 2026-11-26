# UMCine 10주차 Frontend — Vercel 배포 준비 기록

점검일은 2026-11-26이며, 이 문서는 실제 Vercel 배포 전의 로컬 준비 결과다.

## 1. 현재 프로젝트 분석

| 항목 | 확인 결과 |
| --- | --- |
| Git 저장소 루트 | `C:/Users/proce/OneDrive/바탕 화면/UMC11TH` |
| Next.js 프로젝트 루트 | `FE/umcine` |
| 현재 브랜치 | `week09` |
| Next.js / Router | `16.4.6` / `src/app`의 App Router |
| Node.js / pnpm | 로컬 `22.19.0` / `10.28.2` |
| Lockfile | `FE/umcine/pnpm-lock.yaml`, lockfileVersion `9.0` |
| 화면 컴포넌트 | `src/screens` |
| 공통 UI | 서버 `app/layout.tsx`, 클라이언트 Header |
| 서버 상태 | TanStack Query, 서버별 QueryClient 분리 및 브라우저 캐시 재사용 |
| 인증 상태 | Zustand persist, `skipHydration` 후 Provider에서 저장소 복원 |
| 이미지 | `next/image`, HTTPS `image.tmdb.org/t/p/**` 허용 |

### Git remote

| 이름 | 저장소 |
| --- | --- |
| `origin` | `https://github.com/UMC-CUK-11th/PE_Web.git` |
| `myfork` | `https://github.com/kinjaebeom/PE_Web.git` |
| `personal` | `https://github.com/kinjaebeom/PE_Web.git` |

`origin`은 UMC 원본 저장소다. 개인 fork는 `myfork`와 `personal`이 가리킨다.

**현재 작업 트리에 있는 Next.js 마이그레이션은 아직 커밋에 포함되어 있지 않다.** 점검 당시 HEAD `23dc42e`의 프론트 package.json에는 Vite build script가 남아 있었다. 사용자가 배포용 변경을 검토하고 커밋·푸시한 뒤, Vercel이 선택한 브랜치에 Next.js 파일이 실제로 들어 있는지 확인해야 한다.

Production Branch 후보는 `week09`다. `main`을 운영 브랜치로 선택하려면 먼저 사용자가 해당 브랜치에 배포할 코드를 반영해야 한다. 브랜치 선택과 remote 설정 변경은 사용자 단계다.

## 2. 이번 배포 준비의 코드 변경

9주차에서 이미 수정 중이던 파일과 구분하여, 이번 작업에서 변경한 항목을 기록한다.

| 파일 | 변경 내용 |
| --- | --- |
| `FE/umcine/package.json` | `packageManager: pnpm@10.28.2`, `engines.node: 22.x` 명시 |
| `FE/umcine/src/app/api/tmdb/[...path]/route.ts` | TMDB의 인기 목록·영화 검색·상세 GET 요청을 처리하는 서버 Route Handler 추가 |
| `FE/umcine/src/api/tmdb-client.ts` | 브라우저 요청을 같은 origin의 `/api/tmdb/`로 연결 |
| `FE/umcine/src/api/movies/get-movies-with-fetch.ts` | 기존 fetch 예제도 같은 서버 경로 사용 |
| `FE/umcine/src/config/env.ts` | 클라이언트가 읽던 TMDB 자격 증명 접근자 제거, 공개 Backend URL 접근자 유지 |
| `FE/umcine/.env.example` | 서버 전용 `TMDB_ACCESS_TOKEN`과 로컬 Backend URL 설명 추가 |
| `FE/umcine/src/app/layout.tsx` | TMDB attribution 로고에 `h-auto`를 적용해 비율 관련 경고 수정 |
| `FE/umcine/README.md` | 새 토큰 변수와 배포 준비 문서 안내 |
| `WEEK10_FRONTEND_DEPLOYMENT_PREPARATION.md` | 실제 준비·검증 결과 및 배포 이후 기록 양식 |

Git에서 제외된 `.env`, `.env.local`의 기존 토큰 값도 출력 없이 새 변수 이름으로 이전했다. 실제 값은 예시 파일과 문서에 포함하지 않았다. 의존성은 추가하지 않았고, lockfile 기준 설치가 통과했다.

### TMDB 요청 흐름

```text
브라우저의 기존 Query / API 함수
    → 같은 사이트 /api/tmdb/*
    → Next.js Route Handler
    → 서버 전용 토큰을 붙여 TMDB에 요청
    → 영화 JSON을 브라우저에 반환
```

중계 경로는 `movie/popular`, `search/movie`, `movie/{양의 정수}`로 제한했다. 페이지는 1~500을 검사하고, 검색어가 없으면 400을 반환한다. TMDB hostname과 API 버전을 고정해 임의 외부 주소로 자격 증명을 전달하는 경로가 생기지 않도록 했다.

설정 누락은 503, 외부 연결 실패는 502로 처리한다. upstream 토큰은 응답이나 로그에 출력하지 않는다. 기존 TanStack Query key와 화면의 오류·빈 결과·로딩 처리는 같은 API 함수를 통해 이어진다.

## 3. 환경 변수

| 변수 | 용도 | Vercel 적용 환경 |
| --- | --- | --- |
| `TMDB_ACCESS_TOKEN` | 서버 전용 TMDB API Read Access Token | Production, Preview에 사용자 직접 등록 |
| `NEXT_PUBLIC_TMDB_API_BASE_URL` | TMDB 주소, `https://api.themoviedb.org/3` | Production, Preview. 생략 시 코드의 같은 기본 주소 사용 |
| `NEXT_PUBLIC_BACKEND_API_BASE_URL` | 브라우저가 호출할 Spring Boot API의 공개 HTTPS 주소 | Production과 Preview 각각의 Backend 주소 |
| `ENABLE_EXPERIMENTAL_COREPACK` | packageManager에 지정한 pnpm 버전을 Vercel에서 사용할 때 `1` | 해당 방식을 선택하면 Production, Preview |

### 기존 변수 점검 결과

- `NEXT_PUBLIC_TMDB_ACCESS_TOKEN`은 점검 당시 실제로 브라우저 API Client에서 사용하고 있었다. 이번 준비에서 서버 전용 `TMDB_ACCESS_TOKEN`으로 이전했다. Vercel에는 새 이름을 사용한다.
- `NEXT_PUBLIC_TMDB_API_BASE_URL`은 공개해도 되는 주소다. 현재 서버 Route Handler에서 읽고, 지원 주소와 일치하는지 확인한다.
- `NEXT_PUBLIC_BACKEND_API_BASE_URL`은 Client API가 사용하므로 공개 변수다. `http://localhost:3000`은 로컬 개발 기본값이다.
- 현재 소스의 `VITE_`, `import.meta.env` 사용 흔적은 검색에서 발견되지 않았다.
- `.env`, `.env.local`은 Git 추적 목록에 없고 ignore 규칙에 포함된다.
- JWT 서명 Secret과 DB Password는 Spring Boot 서버의 환경 변수로 관리한다.

`NEXT_PUBLIC_` 값은 브라우저 JavaScript에 포함될 수 있고 build 시 값이 반영된다. 따라서 공개 API 주소만 이 prefix를 사용한다. 예전에 공개 번들로 배포했던 TMDB 토큰이 있다면 사용자가 재발급을 검토하고 새 서버 변수에 등록할 수 있다. [Next.js 환경 변수](https://nextjs.org/docs/app/guides/environment-variables)

Production과 Preview의 Backend 주소가 다르면 환경별로 구분해 등록한다. 값 변경 이후에는 새 배포가 필요하다. [Vercel 환경 변수](https://vercel.com/docs/environment-variables)

## 4. Vercel에 직접 입력할 설정

| 설정 | 값 |
| --- | --- |
| GitHub 저장소 | 개인 fork `kinjaebeom/PE_Web` |
| Framework Preset | Next.js |
| Root Directory | `FE/umcine` |
| Node.js Version | `22.x` |
| Install Command | `pnpm install --frozen-lockfile` |
| Build Command | `pnpm build` |
| Output Directory | Next.js preset의 기본값 `.next`, Override를 끈 상태로 사용 |
| Production Branch 후보 | 사용자 변경이 반영된 `week09` |

SSR과 서버 Route Handler를 사용하는 프로젝트이므로 Vercel의 Next.js preset으로 배포한다. 별도 정적 export 설정이나 `vercel.json`은 추가하지 않았다. Framework preset은 빌드 결과와 서버 기능을 처리한다. [Vercel Build 설정](https://vercel.com/docs/builds/configure-a-build)

Node.js 22는 현재 Vercel 지원 목록에 있으며 package.json의 engines로 major를 지정했다. 정확한 pnpm 버전을 Corepack으로 적용하려면 위 Corepack 환경 변수를 사용한다. [Node 버전](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [Corepack 설정](https://vercel.com/docs/builds/configure-a-build#corepack)

## 5. 실행한 로컬 검증

| 명령 / 검사 | 실제 결과 |
| --- | --- |
| `pnpm install --frozen-lockfile` | 통과, 기존 lockfile과 일치 |
| `pnpm lint` | 통과 |
| `pnpm typecheck` | 통과 |
| `pnpm build` | 통과, App Router 및 `/api/tmdb/[...path]` 생성 |
| `next start --hostname localhost --port 5175` 후 운영 빌드 브라우저 검사 | 통과, 아래 공개 화면 검사를 운영 빌드에서도 재확인. 검사 후 임시 운영 서버 종료 |
| production browser JavaScript의 토큰 문자열 검사 | 실제 로컬 TMDB 토큰이 `.next/static`의 JavaScript에 포함되지 않음 |
| `.env`, `.env.local` Git 추적 / ignore | 미추적·ignore 확인 |

검증용 개발 서버는 `http://localhost:5174`에서 실행했다. 당시 5173 포트는 다른 프로젝트의 Vite가 사용하고 있어 별도 포트를 사용했다.

### 실제 API 요청

| 요청 | 결과 |
| --- | --- |
| `/api/tmdb/movie/popular?page=1` | 200, 실제 영화 20개 |
| `/api/tmdb/movie/550` | 200, 영화 ID 550 |
| `/api/tmdb/search/movie?query=Spider-Man` | 200, 검색 결과 20개 |
| `/api/tmdb/configuration` | 404, 지원하지 않는 경로 |
| `/api/tmdb/movie/popular?page=501` | 400, 잘못된 페이지 |
| `/api/tmdb/search/movie` | 400, 검색어 누락 |

### 실제 브라우저

| 확인 항목 | 결과 |
| --- | --- |
| 홈 목록·포스터 | 실제 TMDB 데이터와 이미지 표시 확인 |
| Pagination 및 이전 페이지 캐시 | 확인 |
| 검색·상세 URL 이동·상세 화면 | 확인 |
| 검색 결과 없음·잘못된 영화 ID | 확인 |
| 회원가입 입력 검증·가입 버튼 조건 | 비로그인 입력 검증 확인 |
| 비로그인 북마크 클릭 → 로그인 | 확인 |
| 비로그인 `/my`, `/my/edit` → 로그인 | 확인 |
| API Test 페이지 | 화면 표시 확인 |
| 화면 크기 설정 저장 및 새로고침 | 확인 |
| 모바일 390px 폭의 가로 넘침 | 없음 |
| 테스트 흐름의 runtime / hydration / console 오류 | 0건 |
| 브라우저의 직접 TMDB API 요청 및 TMDB 인증 헤더 | 없음, 같은 origin 중계 요청 확인 |

### 미검증

Spring Boot `http://localhost:3000`은 연결 거부 상태였다. 이번 작업에서는 DB 비밀번호를 입력하거나 Backend 설정을 바꾸지 않았다. 다음 항목은 실제 서버와 DB 준비 후 확인해야 한다.

- 회원가입 성공 및 실제 이메일·닉네임 중복 확인
- 로그인 성공·로그아웃·로그인 유지
- Bearer Token 및 401 응답 처리의 실제 API 동작
- 회원 정보 조회·닉네임 수정과 추가 GET 없는 캐시 반영
- 즐겨찾기 등록·조회·해제
- 평점 등록·수정·삭제
- 실제 인증 변경 시 개인화 캐시 정리

인증 Store와 Query cache 정리 로직은 코드로 점검했다. 실제 성공 응답을 사용한 인증 검증은 미검증 항목으로 유지한다.

## 6. 최초 배포 후 문구 변경 실습 준비

실습 대상 위치는 `FE/umcine/src/screens/movies/movie-list-page.tsx`의 `MovieListPage`다.

현재 홈 화면에는 독립적인 제목 `영화 목록`이 없다. 해당 문자열은 Pagination의 접근성 label, 오류 안내, 상세 화면의 목록 링크 등에 존재한다. 따라서 최초 배포 후 사용자 지시에 따라 홈의 `<main>` 안, `<CardSizeControl />` 앞에 `지금 인기 있는 영화` 제목을 배치하는 방식으로 실습할 수 있다.

최초 배포 전 이번 작업에서는 이 문구 변경을 적용하지 않았다. 배포 성공 확인 뒤 사용자가 요청하면 파일 수정과 로컬 검증 결과를 제공하고, 사용자가 운영 브랜치 반영과 자동 배포 확인을 진행한다.

## 7. 실제 배포 시 사용자 작업

1. 이번 준비 및 9주차 변경을 검토하고 배포할 브랜치에 직접 커밋·푸시한다.
2. 개인 fork 저장소에 `FE/umcine/src/app`과 Next.js package.json이 반영됐는지 확인한다.
3. Vercel에서 GitHub 저장소를 연결하고 프로젝트를 생성한다.
4. 위 Root Directory·Framework·Node·빌드 설정과 Production Branch를 직접 선택한다.
5. Production·Preview 범위를 확인하고 실제 환경 변수 값을 직접 등록한다.
6. 최초 Deploy를 실행한다.
7. Deployment URL과 빌드 로그, 배포 커밋 SHA를 기록한다.
8. 배포 URL을 전달해 아래 항목을 검증한다.

배포 frontend가 localhost를 호출하면 방문자 PC의 주소에 연결된다. Spring Boot의 공개 HTTPS 주소와 배포된 프론트 origin을 허용하는 Backend CORS 설정이 준비되어야 인증 기능을 검증할 수 있다.

일반 HTTP Backend를 HTTPS frontend에서 `fetch`로 호출하면 Mixed Content 차단이 발생할 수 있다. localhost는 브라우저의 특별 취급이 있지만 배포 Backend 주소를 대신할 수 없다. [Mixed Content](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Mixed_content)

## 8. 배포 후 검증 체크리스트

배포 URL을 받은 뒤 실제 production origin에서 검사한다.

- [ ] 루트 URL이 열리고 배포 SHA가 의도한 코드와 일치한다.
- [ ] `/api/tmdb/movie/popular`가 200을 반환하며 영화 카드와 이미지가 보인다.
- [ ] `/search`, 검색 결과·빈 결과·Pagination이 정상이다.
- [ ] `/movies/550` 직접 접속·새로고침·뒤로가기가 정상이다.
- [ ] Next Image 요청이 200이며 `remotePatterns` 관련 오류가 없다.
- [ ] `/login`, `/signup` 직접 접속이 정상이다.
- [ ] 비로그인 `/my`, `/my/edit` 접근은 로그인 화면으로 이동한다.
- [ ] 로그인 성공·새로고침 후 유지·로그아웃이 정상이다.
- [ ] 회원 정보 조회·수정이 정상이며 변경 후 Header에도 반영된다.
- [ ] 즐겨찾기 등록·목록·상태 조회·해제가 정상이다.
- [ ] 평점 등록·수정·삭제가 정상이다.
- [ ] 개인화 캐시가 다른 로그인 상태로 넘어가지 않는다.
- [ ] Console·Runtime·Hydration 오류가 없다.
- [ ] Backend 요청 URL과 응답 status, OPTIONS preflight를 확인한다.
- [ ] CORS·Mixed Content 오류가 없다.
- [ ] 모바일 폭에서 가로 넘침이 없다.

Backend가 준비되지 않았거나 배포 URL에 접근할 수 없는 항목은 미검증으로 기록한다. 토큰·비밀번호·Authorization 헤더가 표시된 Network 상세 화면은 인증 사진에 포함하지 않는다.

### 예상되는 오류와 확인 위치

| 현상 | 확인 및 해결 방향 |
| --- | --- |
| 루트에서 프레임워크 감지 실패 | 개인 fork의 코드 반영 여부, Root Directory `FE/umcine` 확인 |
| TMDB API 503 | 서버 전용 `TMDB_ACCESS_TOKEN` 등록 범위와 정확한 API base URL 확인 후 새 배포 |
| TMDB API 401 | API Read Access Token의 유효성 확인 |
| TMDB API 429 | upstream rate limit 확인 및 잠시 후 재시도 |
| TMDB API 502 | 함수의 외부 연결·timeout과 Runtime Logs 확인 |
| 로그인 API가 localhost로 요청됨 | 올바른 HTTPS Backend URL로 공개 변수를 설정한 뒤 새 배포 |
| CORS 오류 | Backend에서 실제 Production·Preview origin과 메서드, Authorization 헤더 허용 |
| Mixed Content 오류 | Backend의 공개 HTTPS endpoint 준비 |
| 이미지 400 | 요청 hostname·경로와 `remotePatterns` 일치 확인 |
| 환경 변수 변경이 반영되지 않음 | 해당 환경에 새 deployment 생성 |

## 9. 선택 미션 계획

| 미션 | 필요한 코드 준비 | Vercel에서 사용자 작업 |
| --- | --- | --- |
| Preview Deployment | 현재 구조로 가능. 환경이 다르면 Preview Backend 변수 준비 | Git 연결 후 비운영 브랜치/PR의 Preview 생성과 변수 범위·접근 정책 확인 |
| Instant Rollback | 별도 앱 코드 변경 불필요 | 이전 Production 배포 선택, Rollback 실행 및 운영 URL 검증 |
| Web Analytics | 지시를 받은 뒤 `@vercel/analytics` 설치와 루트 레이아웃의 Analytics 컴포넌트 추가 계획 | Analytics 활성화, 데이터 수집 확인 |
| 사용자 도메인 | 기본 연결에 별도 앱 코드 변경 불필요 | 도메인 등록, Vercel 안내에 따른 DNS·소유권 검증, HTTPS 및 연결 확인 |

선택 미션은 이번 작업에서 실행하지 않았다. Rollback은 어떤 배포를 운영 도메인에 연결할지 바꾸는 작업이며, DB 변경 복구 계획은 별도로 확인한다. [Preview 환경](https://vercel.com/docs/environment-variables), [Instant Rollback](https://vercel.com/docs/instant-rollback), [Web Analytics](https://vercel.com/docs/frameworks/full-stack/nextjs#web-analytics), [도메인 연결](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting)

## 10. 핵심 키워드

### 배포와 localhost

배포는 다른 사용자가 접근할 수 있는 서버 환경에서 애플리케이션을 빌드하고 실행해 제공하는 과정이다. localhost는 요청을 실행하는 기기 자신을 가리킨다. 브라우저 코드의 localhost는 방문자 PC이고, 서버 Route Handler의 localhost는 그 서버 실행 환경이다.

### 네트워크·도메인·HTTPS

프론트와 API가 공개 네트워크에서 접근 가능해야 하며, 도메인의 DNS는 실제 서비스로 연결되어야 한다. HTTPS는 브라우저와 서비스 사이의 통신을 보호한다. 프론트와 API의 origin이 다르면 브라우저 요청에 대한 CORS 허용도 필요하다.

### Vercel의 역할

Git 변경을 바탕으로 빌드하고 배포 URL과 도메인 연결, Next.js 서버 함수 실행을 관리한다. 이번 프로젝트는 App Router와 Route Handler, 이미지 최적화를 사용하므로 해당 기능을 함께 지원하는 배포 환경이 필요하다. [Vercel 배포](https://vercel.com/docs/deployments)

### Production·Preview·Rollback

- Production은 운영 도메인에 제공되는 배포다.
- Preview는 운영 반영 전에 별도 URL로 변경을 확인하는 배포다.
- Instant Rollback은 이전 Production deployment로 운영 연결을 되돌리는 기능이다.

### 다른 배포 플랫폼

Netlify는 Next.js Runtime을 제공하며, Render에서는 서버 기능이 있는 Next.js 앱을 Node Web Service로 배포할 수 있다. 직접 운영 환경에서는 Node.js 서버나 Docker 배포도 가능하다. 서버 Route Handler를 사용하는 현재 UMCine은 서버 실행 기능을 지원하는 배포 형태가 필요하다. [Netlify Next.js](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/), [Render Next.js](https://render.com/docs/deploy-nextjs-app), [Next.js 배포 방식](https://nextjs.org/docs/app/getting-started/deploying)

## 11. 학습 후기 초안

이번 주차에는 실제 배포 전에 로컬 프로젝트와 Git에 반영된 코드를 함께 확인해야 한다는 점을 배웠다. 현재 로컬에서 Next.js가 정상 실행되어도 배포 브랜치의 커밋에 해당 코드가 포함되어 있어야 같은 결과를 얻을 수 있었다. 환경 변수 점검에서는 공개 API 주소와 서버에서만 사용하는 TMDB 토큰을 구분하고, Route Handler로 요청 경로를 연결했다. production build와 실제 브라우저 검사로 화면 동작과 토큰의 클라이언트 번들 포함 여부를 확인했다. 배포 환경의 Backend 주소와 CORS·HTTPS 설정은 로컬 실행과 별도로 준비해야 한다는 것도 이해했다. 실제 배포와 자동 배포 결과는 사용자가 진행한 뒤 추가로 기록할 예정이다.

## 12. 실제 트러블슈팅

### 로컬 검증 포트가 다른 프로젝트를 가리킨 문제

- 이슈와 오류 — 5173에서 영화 중계 API를 요청했을 때 401이 반환되었다.
- 원인 — 실행 프로세스를 확인하니 5173은 다른 프로젝트의 Vite 서버였다.
- 해결 — 해당 프로세스를 건드리지 않고 UMCine을 5174에 실행해 검증 주소를 맞췄다.
- 재검증 — 실제 UMCine 중계 경로의 목록·검색·상세는 200을 반환했다.
- 배운 점 — localhost의 응답만으로 대상 프로젝트를 판단하지 말고 실제 포트의 프로세스와 실행 경로를 확인해야 한다.

### 개발 서버의 반복 새로고침으로 자동 검증이 중단된 문제

- 이슈와 오류 — 실제 브라우저 테스트에서 `page.goto: Timeout 30000ms exceeded`가 발생했다.
- 관찰 — HMR 갱신과 홈 재탐색이 반복되었다. 소스가 계속 변경되고 있는 상황은 확인되지 않았다.
- 해결 — 이번 작업에서 시작한 개발 서버를 종료하고 같은 설정으로 새 프로세스를 실행했다.
- 재검증 — 전체 공개 화면 브라우저 검사가 통과했고 runtime·hydration·console 오류는 0건이었다.
- 배운 점 — 개발 서버의 상태와 실제 production build 결과를 구분해 검사해야 한다. 반복 갱신의 내부 원인은 확정하지 않았으며, 앱 오류를 무시하는 설정은 추가하지 않았다.

## 13. 실제 배포 이후 채울 기록

```text
개인 GitHub 저장소 / 배포 브랜치 / 커밋 SHA
[사용자 배포 후 기록]

Production URL / 최초 배포 일시 / Vercel Build 상태
[사용자 배포 후 기록]

Production 기능 검증 결과와 Backend URL
[배포 URL 전달 후 기록, 민감정보 제외]

홈 문구 변경 파일 / 커밋 SHA / 자동 배포 URL
[최초 배포 성공 후 사용자 지시로 진행]

자동 배포 전후 화면 및 배포 결과
[실제 확인 후 기록]
```

이번 단계의 결과는 로컬 배포 준비다. 실제 Vercel 배포 성공·운영 기능·자동 배포 결과는 아직 미검증이다.
