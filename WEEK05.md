# UMC 11기 Product Engineering — Week 05 구현 보고

작업 브랜치: `week05` (시작 커밋: `f4fd2c9`). 작업 위치는 `문서/ChatGPT/UMC11th`입니다. 바탕 화면의 기존 checkout과 `BE/study`는 수정하지 않았습니다. 커밋/원격 push는 수행하지 않았습니다.

2026-10-25에 프런트 `.env`에 사용자 제공 TMDB 토큰을 적용하고 실제 브라우저에서 목록·페이지 변경·검색·상세·새로고침·북마크·순수 fetch를 검증했습니다. 관련 요청 7건이 모두 200이었고 Console/pageerror는 0건입니다. 실제 MySQL 연결 검증은 아직 남아 있습니다. 토큰은 Git에서 제외되며 이 문서에 기록하지 않습니다.

## Frontend

### 1. 생성한 파일

`FE/umcine/` 기준:

```text
.env.example
.env.local                        # 로컬 전용, Git 제외
src/config/env.ts
src/api/tmdb-client.ts
src/api/members.ts
src/api/movies/models.ts
src/api/movies/get-movies-with-fetch.ts
src/api/movies/get-movies.ts
src/api/movies/search-movies.ts
src/api/movies/get-movie-detail.ts
src/utils/movies/tmdb-image.ts
src/utils/movies/get-movie-detail-error-message.ts
src/components/movies/movie-image.tsx
src/components/movies/request-status.tsx
src/pages/api-test-page.tsx
src/routes/api-test.tsx
```

### 2. 수정한 파일

```text
.gitignore                        # 저장소 루트
FE/umcine/package.json            # ky 2.2 추가
FE/umcine/pnpm-lock.yaml
FE/umcine/src/App.tsx
FE/umcine/src/components/layout/header.tsx
FE/umcine/src/components/movies/movie-card.tsx
FE/umcine/src/components/movies/movie-grid.tsx
FE/umcine/src/components/movies/movie-list-page.tsx
FE/umcine/src/components/movies/pagination.tsx
FE/umcine/src/index.css
FE/umcine/src/pages/movies/movie-list-page.tsx
FE/umcine/src/pages/movies/search-page.tsx
FE/umcine/src/pages/movies/movie-detail-page.tsx
FE/umcine/src/routeTree.gen.ts      # TanStack Router 플러그인 자동 생성
FE/umcine/src/routes/__root.tsx
FE/umcine/src/stores/bookmark-store.ts
```

### 3. 삭제한 파일

- `FE/umcine/src/data/movie.ts`
- `FE/umcine/src/types/movie.ts`

기존 참조를 검색하고 API 타입 및 기존 페이지 재사용으로 전환한 뒤 삭제했습니다. 예전 로컬 포스터 자산은 보존했습니다.

### 4. TMDB API 구조

환경 설정 → 지연 초기화하는 공통 ky 클라이언트 → API 함수 → 화면 순서입니다. 토큰이 없을 때도 앱 전체가 중단되지 않고 오류 UI와 `/api-test`를 사용할 수 있도록 환경 변수는 요청 시 검증합니다. API 타입은 snake_case를 유지하며 북마크 상태는 추가하지 않았습니다.

| 함수 | 요청 | 파라미터 |
| --- | --- | --- |
| `getMovies({ page })` | `GET movie/popular` | language=ko-KR, page |
| `searchMovies({ query, page })` | `GET search/movie` | query, language=ko-KR, include_adult=false, page |
| `getMovieDetail(movieId)` | `GET movie/{movieId}` | language=ko-KR |
| `getMoviesWithFetch(page)` | `GET movie/popular` | language=ko-KR, page |

Bearer 토큰은 환경 변수에서 가져옵니다. ky 클라이언트의 baseUrl 끝에 `/`를 붙이고 요청 경로 앞에는 `/`를 붙이지 않습니다. 순수 fetch 함수는 `response.ok`를 검사하고 반환 타입을 지정했으며, 화면 진입 시 자동 실행되지 않습니다.

### 5. 목록 API 연결

실제 인기 영화 API 응답의 results/page/total_pages를 사용합니다. 현재 페이지를 바꾸면 요청 page가 바뀝니다. 페이지 버튼은 최대 5개이고 TMDB 요청 가능 범위인 500페이지로 제한합니다. 카드 크기 설정과 기존 grid/card 디자인을 유지했습니다. 상세에만 존재하는 장르/runtime은 목록에서 사용하지 않고 평점/평가 수를 표시합니다.

### 6. 검색 API 연결

기존 TanStack Router search param과 검색 form을 유지했습니다. `/search?query=스파이더맨` 직접 진입/새로고침을 지원하고, 빈 검색어는 요청하지 않습니다. 검색 결과에도 실제 페이지 요청을 연결했습니다. 기존 검색 화면의 카드 구성과 상세 링크/북마크를 유지했습니다.

### 7. 상세 API 연결

양의 정수 ID만 요청합니다. 잘못된 값은 `올바르지 않은 영화 번호예요.`, 404는 `영화를 찾을 수 없어요.`, 그 외 요청 실패는 `영화 정보를 불러오지 못했어요.`로 구분합니다. title/original_title/release_date/genres/runtime/tagline/overview/이미지/평점을 표시합니다. runtime 135분은 `2시간 15분`으로 변환합니다.

### 8. 로딩 / 오류 / 빈 결과 처리

목록과 검색은 loading/error/empty/success를 구분합니다. 검색어 없음은 별도 상태입니다. 모든 영화 요청에 AbortController cleanup과 응답 반영 전 취소 여부 확인을 적용했습니다. 페이지/검색어/영화 ID가 바뀔 때 결과 컴포넌트의 key를 바꿔 로딩 상태를 초기화하므로 effect 시작 시 동기 setState가 필요하지 않습니다.

API 오류 화면의 `다시 시도`는 마지막 page/query/id 요청을 다시 실행합니다. poster/backdrop이 null이거나 이미지 로딩에 실패하면 `이미지 없음`을 표시합니다. 공통 footer에 기존 TMDB 로고와 출처 문구를 추가했습니다.

### 9. 기존 Zustand 기능 유지 여부

목록/검색/상세에서 기존 BookmarkButton과 같은 ID 기반 store를 사용합니다. 기존 저장소가 실제로는 sessionStorage를 사용하고 있어 localStorage로 변경했고, localStorage 값이 없을 때 sessionStorage 저장값을 한 번 옮깁니다. 저장 키와 ID 배열은 유지합니다. 기존 로컬 데이터의 ID와 실제 TMDB ID는 서로 다른 체계이므로 예전 북마크를 특정 TMDB 영화로 임의 변환하지 않습니다.

UI preference store는 수정하지 않았습니다. 카드 크기 localStorage persist를 유지합니다.

### 10. lint 결과

`pnpm lint` 통과. 규칙을 끄거나 작성 코드에 any로 우회하지 않았습니다. `routeTree.gen.ts`의 기존 disable/any 표기는 Router 플러그인이 생성하는 내용입니다.

### 11. build 결과

`pnpm build` 통과. TypeScript 검사와 Vite production build를 완료했습니다.

## Backend

### 1. 새 BE/movie 프로젝트 구조

```text
BE/movie/
├─ .env                           # 로컬 전용, Git 제외
├─ .env.example
├─ README.md
├─ package.json / package-lock.json
├─ nest-cli.json
├─ tsconfig.json / tsconfig.build.json
├─ sql/schema.sql / seed.sql
├─ src/
│  ├─ controller/member.controller.ts / rating.controller.ts
│  ├─ service/member.service.ts / rating.service.ts
│  ├─ repository/.gitkeep
│  ├─ entity/base-time.entity.ts / member.entity.ts / rating.entity.ts
│  ├─ dto/check-params.dto.ts / check-response.dto.ts / rating-response.dto.ts
│  ├─ configure-app.ts
│  ├─ app.module.ts
│  └─ main.ts
└─ test/api.test.mjs / test-app.mjs
```

기존 백엔드와 같은 Nest 12 계열 및 npm을 사용하고 Layer 구조를 적용했습니다. 도메인 Feature Module을 추가하지 않았습니다.

### 2. 생성한 Entity

BaseTimeEntity의 createdAt/updatedAt을 Member와 Rating이 상속합니다. Member에는 길이/unique 제약, Rating에는 Member 관계와 (member, movieId) unique를 적용했습니다. movieId는 일반 BIGINT 컬럼입니다. Favorite는 SQL 테이블만 만들었습니다.

### 3. 생성한 DTO

CheckResponseDto, RatingResponseDto 및 선택 미션의 NicknameParamsDto/EmailParamsDto를 추가했습니다. 평점 Entity를 그대로 반환하지 않습니다. BIGINT의 정밀도 손실을 막기 위해 DB 값은 문자열로 읽고, DTO 반환 시 안전한 정수 범위인지 확인합니다.

### 4. Controller / Service

MemberController/MemberService는 Repository.exists로 중복 여부를 확인하고 available을 반대로 반환합니다. RatingController/RatingService는 ParseIntPipe 적용 후 Member 존재를 먼저 확인하고 ratingId 내림차순으로 조회합니다. 평점 없는 유저의 `[]`와 존재하지 않는 유저의 404를 구분합니다.

### 5. DB 연결 구조

ConfigModule/ConfigService → TypeOrmModule.forRootAsync → MySQL `umc_movie`입니다. 환경 파일에서 접속 정보를 읽으며 synchronize는 false입니다. app.module.ts에 Member/Rating과 두 Controller/Service를 직접 등록했습니다. SQL에 세 테이블과 개발용 dummy hash seed를 준비했습니다. 실제 DB에는 아직 SQL을 실행하지 않았습니다.

### 6. 구현한 API 목록

| Method | URL | 결과 |
| --- | --- | --- |
| GET | `/members/nickname/:nickname` | `{ available }`, 잘못된 길이는 400 |
| GET | `/members/email/:email` | `{ available }`, 잘못된 형식은 400 |
| GET | `/members/:memberId/ratings` | DTO 배열 / 404 / 잘못된 ID 400 |

### 7. CORS 설정

main.ts가 configureApp을 호출해 `origin: http://localhost:5173`, methods GET/POST/PATCH/DELETE를 적용합니다. CORS_ENABLED=false로 재시작하면 CORS 오류 실습이 가능합니다. 기본값은 true입니다.

### 8. 실제 Frontend 연결 방법

1. `FE/umcine/.env.local`에 TMDB 토큰을 입력합니다.
2. `BE/movie/.env`에 DB 계정/비밀번호를 입력합니다.
3. 새 개발 DB에 schema.sql, seed.sql 순서로 최초 한 번 적용합니다.
4. `BE/movie`에서 `npm run start:dev`, `FE/umcine`에서 `pnpm dev`를 실행합니다.
5. 브라우저에서 `http://localhost:5173/api-test`를 열고 세 폼을 제출합니다.
6. 영화 목록/검색/상세를 열어 Network에서 실제 TMDB의 200 응답을 확인합니다.

환경 파일 변경 후 개발 서버를 재시작합니다. 실제 Secret을 채팅이나 공개 예시 파일에 넣지 않습니다. VITE_ 값은 브라우저 번들에서 사용하므로 TMDB 읽기 전용 접근 토큰만 사용합니다.

상세 실행 방법과 seed 기대 응답은 `BE/movie/README.md`에 정리했습니다.

### 9. npm run build 결과

`npm run build` 통과. `npm test`의 HTTP/API/Validation/CORS/Entity metadata 테스트 7개도 통과했습니다. 테스트용 Repository를 사용하므로 실제 MySQL 통합 검증은 별도입니다.

## 브라우저 검증 결과

`scripts/verify-week05.mjs`를 설치된 Chrome과 Playwright로 실행했습니다. TMDB 응답은 브라우저에서 가로채어 테스트 데이터를 제공하고, 서버는 실제 Nest Controller/Service에 테스트용 Repository만 주입했습니다. 이 대체 동작은 테스트 스크립트에서만 사용합니다.

| 항목 | 결과 |
| --- | --- |
| 환경 변수 미설정 시 앱 전체 중단 없이 오류 UI | 통과 |
| 목록, 페이지 변경 시 요청 page 반영 | 통과 |
| 검색 URL 직접 진입 / 새로고침 | 통과 |
| 상세 링크 / 직접 진입 / 새로고침 | 통과 |
| 잘못된 ID의 요청 생략, 404 메시지 | 통과 |
| null 이미지 fallback | 통과 |
| 목록/검색/상세 북마크 공유 및 새로고침 유지 | 통과 |
| 카드 크기 설정 persist | 통과 |
| 검색어 없음/빈 결과/로딩/오류/재시도 | 통과 |
| 느린 이전 검색 응답이 새 결과를 덮어쓰지 않음 | 통과 |
| 390px 화면에서 가로 overflow 없음 | 통과 |
| 브라우저에서 세 Nest API 호출 및 응답 표시 | 통과 (테스트 저장소) |
| CORS 비활성화 시 브라우저가 응답을 차단 | 재현 완료 (의도된 실습 오류) |
| 정상 시나리오의 처리되지 않은 pageerror | 0개 |
| 실제 TMDB 인증 및 목록/검색/상세/fetch | 2026-10-25 실서버 검증 통과 |
| 실제 MySQL 접속 / seed SQL 실행 | DB 설정 후 검증 예정 |

재실행하려면 Vite를 5173 포트에 띄우고, Playwright가 설치된 환경에서 저장소 루트에서 `node scripts/verify-week05.mjs`를 실행합니다. 서버 테스트 저장소가 3000 포트를 사용하므로 실제 백엔드는 정지합니다. 모듈이 프로젝트 밖에 설치되어 있으면 PLAYWRIGHT_MODULE/PLAYWRIGHT_TEST_MODULE에 해당 모듈의 file URL을 지정할 수 있습니다. 스크립트는 사용자 환경 파일을 변경하지 않습니다.

## 문제 → 원인 → 수정 → 결과

- 기존 App.tsx 타입 검사 실패 → 이전 경로의 삭제된 컴포넌트와 로컬 Movie 참조 잔존 → 현재 MovieListPage 호환 export로 정리 → 타입/빌드 통과.
- 중복 목록 페이지에 로컬 데이터 import 잔존 → 사용하지 않는 복사본 → 실제 페이지 재export로 통합 → 기존 import 경로 유지, 로컬 참조 제거.
- 백엔드 초기 TS1479 → Nest 12가 ESM인데 새 프로젝트가 CommonJS → 기존 백엔드와 같은 ESM과 상대 import .js 적용 → 빌드 통과.
- API 테스트 UI에서 서버 404 메시지 누락 → Ky 2가 error.data를 채우면서 response body 소비 → error.data 사용 → 브라우저에서 404 메시지 표시 검증 통과.
- 페이지 버튼 스타일 누락 → 기존 App.css가 실제 Router 진입점에서 로드되지 않음 → 기존 pagination CSS를 index.css로 이동 → 브라우저 표시 확인.
- 의존성 검사에서 Multer 취약점 발견 → Nest의 하위 의존성 → 같은 메이저 수정 버전 override → npm install audit 결과 취약점 0개.
- 시스템 Node 엔진 경고 → 현재 22.19.0이 최신 Nest CLI 하위 패키지의 권장 범위보다 낮음 → 전역 Node를 임의 변경하지 않고 README에 22.22.3+/24 LTS 안내 → 현재 환경의 빌드/테스트는 통과.

## 2026-10-25 현재 PC의 백엔드 연결 준비

- 최신 실행 대상은 Windows 호스트의 127.0.0.1:3307 / root / umc_movie입니다. TypeORM 기본값과 `.env.example`, 연결 점검 스크립트 및 실행 문서를 3307로 통일했습니다.
- 실제 비밀번호는 사용자가 `.env`에 직접 관리합니다. 저장된 비밀번호는 수정하거나 출력하지 않았으며, 실제 환경 파일은 Git에서 제외됩니다.
- `schema.sql`과 `seed.sql`에 세 테이블과 개발 seed가 준비되어 있습니다. 실제 DB에는 아직 적용하지 않았습니다.
- Entity/DTO/Repository/세 API/404/CORS 구현을 다시 점검했고 `npm test`를 통해 빌드와 HTTP 테스트 7개가 통과했습니다.
- Chrome에서 테스트 저장소를 이용한 실제 프런트의 세 API 호출과 CORS 비활성/활성 동작을 재검증했습니다. 실제 MySQL 통합 검증과는 구분합니다.
- `npm run db:check`를 추가했습니다. 환경 파일에서만 접속 정보를 읽고, 연결·DB·테이블 존재를 읽기 전용으로 확인합니다. 비밀번호 미입력 시 연결을 시도하지 않고 안내만 출력합니다.
- `BE/movie/postman/week05-movie.postman_collection.json`에 실제 서버 검증용 요청 10개를 준비했습니다.
- 사용자의 최신 요청에 따라 Codex의 실제 DB 연결 재시도는 중단했습니다. MySQL 외부 개방이나 새 인스턴스 생성은 수행하지 않았습니다.
- Windows 로컬 터미널에서 사용자가 진행할 순서: DB/테이블 누락 시 SQL 적용 → `npm run db:check` → `npm run start:dev`로 TypeORM 연결 확인 → Postman/API 및 `/api-test` 검증. 구체적인 명령과 예상 응답은 `BE/movie/README.md`에 있습니다.

## 참고한 공식 자료

- [TMDB 인기 영화 API](https://developer.themoviedb.org/reference/movie-popular-list)
- [Ky 공식 README](https://github.com/sindresorhus/ky#readme) 및 설치된 ky 2.2.0 타입/오류 처리 문서.

API의 인기 영화 경로와 파라미터는 TMDB 문서를, baseUrl과 오류 처리 방식은 설치된 Ky 버전을 기준으로 확인했습니다.
