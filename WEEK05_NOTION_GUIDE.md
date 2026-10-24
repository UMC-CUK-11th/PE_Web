# Week 05 노션 기록 가이드 — 프론트엔드 / 백엔드

첨부한 두 워크북의 제목에 맞춰 현재 코드를 연결한 문서입니다. 아래 코드 블록은 별도 표시한 학습용 예제를 제외하고 현재 저장소에서 직접 가져왔습니다. 2026-10-25 기준 작성했습니다.

코드 구현과 실제 서비스를 연결해 확인하는 것은 구분합니다. 이전 작업에서 lint/build와 테스트 저장소를 이용한 백엔드 테스트 7개가 통과했습니다. 이후 2026-10-25에 실제 TMDB 토큰으로 목록·검색·상세·페이지 변경·새로고침·북마크·순수 fetch를 확인했고 요청 7건 모두 200, Console/pageerror 0건이었습니다. 실제 MySQL 검증은 남아 있습니다. 현재 TMDB 토큰 입력 파일은 FE/umcine/.env입니다. 아래의 이전 .env.local 안내는 이 .env 파일을 사용하면 됩니다. 스크린샷과 응답 요약은 Git에서 제외된 .verification/tmdb-live-* 파일에 있습니다.

## 1. 이번에 한 작업부터 이해하기

### 프론트엔드: 영화 데이터의 출처 변경

이전에는 src/data/movie.ts에 직접 적어둔 영화 배열을 화면에서 읽었습니다. 지금은 화면이 API 함수를 호출하고, 그 함수가 TMDB에서 JSON을 받아옵니다. 디자인과 Zustand 북마크·카드 크기 설정은 유지했습니다.

인기 영화 화면 → getMovies → TMDB /movie/popular → response.results → MovieGrid → MovieCard

검색 화면 → searchMovies → TMDB /search/movie → response.results → 검색 카드

상세 화면 → getMovieDetail → TMDB /movie/{id} → 영화 상세 정보

### 백엔드: 우리 서비스가 관리할 회원·평점 데이터 조회

기존 BE/study는 보존하고 BE/movie를 새로 만들었습니다. 우리 서버는 MySQL에서 회원과 평점을 읽습니다. 영화 제목/포스터/줄거리를 DB에 복사하지 않고 TMDB 영화 ID만 저장합니다.

브라우저 /api-test 또는 Postman → Controller → Service → TypeORM Repository → MySQL → DTO → JSON 응답

영화 목록 화면은 TMDB를 직접 호출합니다. /api-test는 우리가 만든 NestJS 서버를 호출합니다. 북마크는 현재 Zustand/localStorage 기능이며, 백엔드 Favorite API와 연결한 상태가 아닙니다. 회원가입·로그인·평점 작성·즐겨찾기 API도 이번 구현 범위에 없습니다.

## 2. 노션에 어디에 적으면 되나요?

### 프론트 워크북

| 노션 항목 | 넣을 내용 |
| --- | --- |
| 학습 내용 1~7 | 직접 이해한 설명이나 짧은 메모. 예제 전부를 다시 붙일 필요는 없음 |
| 🎯 핵심 키워드 | 이 문서의 개념 설명을 읽고 자신의 말로 정리 |
| 📢 학습 후기 | 실제로 실행하고 느낀 점·어려웠던 점 |
| 💪 미션 기록 → 필수 미션 | 아래 F1~F7 핵심 코드 + 실제 실행 캡처 |
| 💪 미션 기록 → 선택 미션 | F8 다시 시도 코드 + 실패→재시도→성공 캡처 |
| ⚡ 트러블 슈팅 | 실제 있었던 오류, 원인, 수정 내용 |

프론트 워크북은 '핵심 코드와 최종 확인 결과만' 기록하도록 안내합니다. 모든 JSX, 설치 로그, generated routeTree까지 붙이지 않아도 됩니다.

### 백엔드 워크북

| 노션 항목 | 넣을 내용 |
| --- | --- |
| 📑 본문 들어가기 전 → 2. ERD 설계하기 | Member 1:N Rating, Member 1:N Favorite 구조와 schema SQL |
| 📑 본문 들어가기 전 → 3. 새 프로젝트 생성하기 | BE/movie 별도 프로젝트 구조·npm 사용·DB 환경 구성 |
| 📑 본문 들어가기 전 → 4. API 명세 작성하기 | 아래 B3의 API 명세 표와 응답 필드 |
| 🔖 본문 → 2. [실습 0] CORS 에러 | CORS_ENABLED=false로 재현한 브라우저 Console 캡처 |
| 🔖 본문 → 3~8 | Entity / Repository / DTO / 세 API 구현에 대응 |
| 🔖 본문 → 9. CORS 설정 적용 | configure-app.ts, main.ts와 CORS 적용 후 캡처 |
| ✅ 실습 체크리스트 | 실제 DB·Postman·브라우저 확인한 뒤 체크 |
| ☑️ 실습 인증 | DB·Postman·CORS 전후 캡처 모음 |
| 💪 미션 기록 → 미션 기록 | 프로젝트 준비부터 코드·실행·결과까지 아래 B1~B8 순서로 정리 |
| 선택 미션 기록 | 닉네임/이메일 서버 유효성 검증과 400 응답 |
| ⚡ 트러블 슈팅 | 실제 오류의 이슈→문제→해결 |

같은 캡처를 두 곳에 반복할 필요는 없습니다. 미션 기록 안에 세부 제목을 만들고, 실습 인증에는 해당 기록 링크를 붙이는 방식으로 정리할 수 있습니다.

## 3. 먼저 실행 환경 준비하기

### 3-1. 현재 작업 폴더

문서/ChatGPT/UMC11th의 week05 브랜치가 작업 대상입니다. 바탕 화면의 예전 PE_Web checkout에서 실행하면 이번 코드를 보지 못합니다.

PowerShell에서:

```powershell
Set-Location 'C:\Users\proce\OneDrive\문서\ChatGPT\UMC11th'
git branch --show-current
```

예상 브랜치: week05. 아래 cd 명령은 별도 표시가 없으면 이 저장소 루트에서 시작합니다.

### 3-2. 프런트 환경 파일

FE/umcine/.env.local의 VITE_TMDB_ACCESS_TOKEN에 TMDB API Read Access Token을 직접 넣습니다. API Key와 혼동하지 마세요. 환경 파일 변경 후 pnpm dev를 재시작합니다.

노션에는 실제 .env.local 대신 아래 예시만 붙입니다.

코드 위치: [FE/umcine/.env.example](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/.env.example)

```dotenv
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_ACCESS_TOKEN=
VITE_BACKEND_API_BASE_URL=http://localhost:3000
```

VITE_ 값은 브라우저에서 사용되므로 빌드 결과/요청에서 확인할 수 있습니다. Git 제외와 브라우저에서의 비밀 보장은 별개입니다. 실제 토큰과 DB 비밀번호는 노션 코드·스크린샷에도 넣지 않습니다. Network 캡처는 Query/Response 위주로 하고 Authorization 값이 보이면 가립니다. [Vite 환경 변수 문서](https://vite.dev/guide/env-and-mode)

### 3-3. MySQL 준비

BE/movie/.env에 본인의 MySQL 계정과 비밀번호를 입력합니다. DB_NAME은 umc_movie로 맞춥니다. 노션에는 .env.example만 붙입니다.

코드 위치: [BE/movie/.env.example](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/BE/movie/.env.example)

```dotenv
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=
DB_NAME=umc_movie
PORT=3000
# false: CORS 오류 재현 실습. 기본값은 true.
CORS_ENABLED=true
```

MySQL Workbench에서 로컬 연결을 열고 다음 순서로 실행합니다.

1. BE/movie/sql/schema.sql을 열어 실행합니다.
2. BE/movie/sql/seed.sql을 열어 실행합니다.
3. 아래 조회로 생성과 삽입 결과를 확인합니다.

기존에 같은 테이블/seed가 있으면 먼저 상태를 확인하세요. schema/seed를 매번 재실행하는 과정은 아닙니다. 기존 DB를 삭제할 필요도 없습니다.

```sql
USE umc_movie;
SHOW TABLES;
SELECT member_id, email, nickname FROM member;
SELECT rating_id, member_id, movie_id, score, comment FROM rating ORDER BY rating_id DESC;
SHOW CREATE TABLE rating;
SHOW CREATE TABLE favorite;
```

새 DB에 제공한 seed를 한 번 넣었다면 회원은 수현/민서 두 명, 평점은 세 개입니다. 비밀번호 컬럼을 SELECT하여 캡처할 필요는 없습니다. favorite는 테이블이 있고 행이 0개여도 정상입니다.

### 3-4. 서버 두 개 실행

터미널 A:

```powershell
Set-Location 'C:\Users\proce\OneDrive\문서\ChatGPT\UMC11th\BE\movie'
npm run start:dev
```

터미널 B:

```powershell
Set-Location 'C:\Users\proce\OneDrive\문서\ChatGPT\UMC11th\FE\umcine'
pnpm dev
```

의존성이 없는 새 환경에서만 먼저 백엔드 npm ci, 프런트 pnpm install --frozen-lockfile을 실행합니다. 패키지 매니저를 서로 바꾸지 않습니다. 기존 BE/study 서버가 3000 포트를 쓰고 있으면 정지합니다.

브라우저는 http://localhost:5173을 사용합니다. Vite가 다른 포트로 올라갔다면 5173 포트 사용 프로세스를 확인하세요. 127.0.0.1:5173은 현재 CORS에 허용한 localhost:5173과 다른 Origin입니다.

## 4. 프론트 필수 미션에 넣을 코드와 설명

### F1. 환경 변수와 응답 타입 — 학습 내용 3.1 / 3.2

붙일 설명 초안:

> TMDB 주소와 Read Access Token을 환경 변수로 분리했다. 토큰을 요청 시점에 확인하도록 구성해, 토큰 미설정 시 앱 전체가 중단되는 대신 오류 UI가 나타나게 했다. 목록/검색과 상세 응답은 필드가 달라 공통 타입과 각 응답 타입을 나누고 TMDB의 snake_case를 유지했다. 북마크 여부는 API 타입에 추가하지 않았다.

코드 위치: [FE/umcine/src/config/env.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/config/env.ts)

```ts
// Validate at request time so /api-test remains usable without a TMDB token.
export const env = {
  get tmdbApiBaseUrl(): string {
    const value = import.meta.env.VITE_TMDB_API_BASE_URL;
    if (!value) throw new Error("TMDB 환경 변수가 필요해요.");
    return value.replace(/\/+$/, "");
  },
  get tmdbAccessToken(): string {
    const value = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
    if (!value) throw new Error("TMDB 환경 변수가 필요해요.");
    return value;
  },
};
```

코드 위치: [FE/umcine/src/api/movies/models.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/api/movies/models.ts)

```ts
export interface TmdbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

export interface TmdbMovieListItem extends TmdbMovie {
  genre_ids: number[];
}

export interface TmdbMovieListResponse {
  page: number;
  results: TmdbMovieListItem[];
  total_pages: number;
  total_results: number;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbMovieDetail extends TmdbMovie {
  genres: TmdbGenre[];
  runtime: number | null;
  tagline: string;
}
```

### F2. 순수 fetch 요청 — 학습 내용 4.1 / 4.2

붙일 설명 초안:

> 인기 영화 endpoint에 language와 page query를 전달하고 Authorization header에 Bearer 토큰을 넣었다. fetch는 HTTP 4xx/5xx 자체만으로 reject하지 않으므로 response.ok를 직접 확인해 오류를 발생시켰다. 반환 타입은 Promise<TmdbMovieListResponse>로 지정했다.

코드 위치: [FE/umcine/src/api/movies/get-movies-with-fetch.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/api/movies/get-movies-with-fetch.ts)

```ts
import { env } from "../../config/env";
import type { TmdbMovieListResponse } from "./models";

export async function getMoviesWithFetch(
  page = 1,
): Promise<TmdbMovieListResponse> {
  const params = new URLSearchParams({ language: "ko-KR", page: String(page) });
  const response = await fetch(
    `${env.tmdbApiBaseUrl}/movie/popular?${params}`,
    {
      headers: { Authorization: `Bearer ${env.tmdbAccessToken}` },
    },
  );
  if (!response.ok) throw new Error(`인기 영화 요청 실패 (${response.status})`);
  return response.json() as Promise<TmdbMovieListResponse>;
}
```

**직접 해야 할 동작:**

1. 프런트 개발 서버를 실행하고 브라우저에서 /api-test를 엽니다. 이 화면은 자동 TMDB 목록 요청을 하지 않아 fetch 실습 요청을 구별하기 쉽습니다.
2. F12 → Network → Fetch/XHR 필터를 선택합니다.
3. Console에서 아래 JavaScript를 실행합니다. Vite 개발 서버에서만 사용하는 코드입니다.

```javascript
import('/src/api/movies/get-movies-with-fetch.ts')
  .then((module) => module.getMoviesWithFetch(1))
  .then((response) => console.log(response.results))
  .catch((error) => console.error(error));
```

4. Network에서 movie/popular 요청을 선택합니다. GET, status 200, query language=ko-KR&page=1, Response의 results를 확인합니다.
5. Console의 영화 배열도 확인합니다. Network의 Initiator를 보면 fetch 함수에서 시작한 요청임을 구분할 수 있습니다.

**캡처 F-01:** fetch 요청의 URL/GET/200/query와 Response results. 토큰은 가립니다.

이 방법은 기존 함수를 직접 실행하므로 main.tsx를 바꿀 필요가 없습니다. 워크북 방식대로 examples/fetch-movies.ts를 만들고 임시 import해도 되지만, 현재 저장소에는 이 examples 파일이 없습니다. main.tsx에 임시 import를 넣었다면 확인 후 반드시 제거합니다.

### F3. ky 공통 클라이언트와 API 함수 — 학습 내용 5.2 / 5.3

붙일 설명 초안:

> 반복되는 base URL과 인증 header를 ky 공통 인스턴스로 모았다. 필요한 순간 한 번 만들고 재사용한다. endpoint별 함수는 searchParams와 .json<T>()를 사용하며, 화면 컴포넌트가 요청 URL을 직접 조립하지 않게 했다. signal은 화면 이동 시 이전 요청을 취소하기 위해 받는다.

코드 위치: [FE/umcine/src/api/tmdb-client.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/api/tmdb-client.ts)

```ts
import ky from "ky";
import { env } from "../config/env";

let tmdbClient: ReturnType<typeof ky.create> | undefined;

// Lazy initialization lets pages render configuration errors instead of crashing.
export function getTmdbClient() {
  tmdbClient ??= ky.create({
    baseUrl: `${env.tmdbApiBaseUrl}/`,
    headers: { Authorization: `Bearer ${env.tmdbAccessToken}` },
  });
  return tmdbClient;
}
```

코드 위치: [FE/umcine/src/api/movies/get-movies.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/api/movies/get-movies.ts)

```ts
import { getTmdbClient } from "../tmdb-client";
import type { TmdbMovieListResponse } from "./models";

export async function getMovies({
  page = 1,
  signal,
}: { page?: number; signal?: AbortSignal } = {}) {
  return getTmdbClient()
    .get("movie/popular", {
      searchParams: { language: "ko-KR", page },
      signal,
    })
    .json<TmdbMovieListResponse>();
}
```

코드 위치: [FE/umcine/src/api/movies/search-movies.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/api/movies/search-movies.ts)

```ts
import { getTmdbClient } from "../tmdb-client";
import type { TmdbMovieListResponse } from "./models";

export async function searchMovies({
  query,
  page = 1,
  signal,
}: {
  query: string;
  page?: number;
  signal?: AbortSignal;
}) {
  return getTmdbClient()
    .get("search/movie", {
      searchParams: { query, language: "ko-KR", include_adult: false, page },
      signal,
    })
    .json<TmdbMovieListResponse>();
}
```

코드 위치: [FE/umcine/src/api/movies/get-movie-detail.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/api/movies/get-movie-detail.ts)

```ts
import { getTmdbClient } from "../tmdb-client";
import type { TmdbMovieDetail } from "./models";

export async function getMovieDetail(movieId: number, signal?: AbortSignal) {
  return getTmdbClient()
    .get(`movie/${movieId}`, {
      searchParams: { language: "ko-KR" },
      signal,
    })
    .json<TmdbMovieDetail>();
}
```

baseUrl은 /로 끝나고 get의 상대 경로는 / 없이 시작합니다. .json<T>()는 개발 시 타입 검사에 도움을 주지만 서버 JSON의 런타임 검증기는 아닙니다.

### F4. 영화 목록과 네 가지 UI 상태 — 학습 내용 6.1

붙일 설명 초안:

> 기존 로컬 배열 import를 제거하고 getMovies 결과를 사용했다. 요청 중에는 로딩, 실패하면 오류, results가 비면 빈 결과, 성공하면 MovieGrid를 표시한다. page 응답과 total_pages를 Pagination에 넘긴다. 컴포넌트 정리 시 요청을 취소하고 취소된 응답은 반영하지 않는다.

아래 파일은 짧으므로 전체를 붙여도 됩니다. 실제 페이지는 pages/movies 아래 파일입니다. components/movies/movie-list-page.tsx는 호환용 재export이므로 핵심 코드로 붙이지 않습니다.

코드 위치: [FE/umcine/src/pages/movies/movie-list-page.tsx](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/pages/movies/movie-list-page.tsx)

```tsx
import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListResponse } from "../../api/movies/models";
import RequestStatus from "../../components/movies/request-status";

import CardSizeControl from "../../components/movies/card-size-control";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="min-h-screen bg-zinc-50 pb-20 pt-8">
      <CardSizeControl />

      <MovieListResults
        key={currentPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}

function MovieListResults({
  currentPage,
  onPageChange,
}: {
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const [data, setData] = useState<TmdbMovieListResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    getMovies({ page: currentPage, signal: controller.signal })
      .then((response) => {
        if (!controller.signal.aborted) setData(response);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setErrorMessage(
            error instanceof Error &&
              error.message === "TMDB 환경 변수가 필요해요."
              ? error.message
              : "영화 목록을 불러오지 못했어요.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [currentPage, attempt]);
  function retry() {
    setErrorMessage("");
    setIsLoading(true);
    setAttempt((value) => value + 1);
  }
  if (isLoading || errorMessage)
    return (
      <RequestStatus loading={isLoading} error={errorMessage} onRetry={retry} />
    );
  if (!data?.results.length)
    return (
      <p role="status" className="p-10 text-center">
        표시할 영화가 없어요.
      </p>
    );
  return (
    <>
      <MovieGrid movies={data.results} />
      <Pagination
        currentPage={data.page}
        totalPages={data.total_pages}
        onPageChange={onPageChange}
      />
    </>
  );
}
```

코드를 읽는 순서:

1. currentPage는 사용자가 보고 있는 페이지 번호입니다.
2. getMovies의 Promise 결과가 .then에서 data에 저장됩니다.
3. .catch는 실패 문구, .finally는 로딩 종료를 처리합니다.
4. key={currentPage}로 페이지별 결과 컴포넌트를 새로 만들어 초기 로딩 상태를 얻습니다.
5. cleanup의 abort와 signal.aborted 검사로 이전 응답의 덮어쓰기를 방지합니다.

**캡처 F-02:** /의 실제 영화 카드와 TMDB 출처 footer.
**캡처 F-03:** 2페이지를 클릭한 뒤 page=2 요청과 다른 목록. 현재 page는 React state이며 URL에 ?page=2를 저장하는 기능은 구현하지 않았습니다.

### F5. 포스터와 이미지 없음 — 학습 내용 6.2

붙일 설명 초안:

> TMDB의 poster_path/backdrop_path는 완성된 URL이 아니므로 이미지 base URL을 붙였다. null이면 null을 반환하고 공통 MovieImage에서 이미지 없음 UI를 보여준다. 이미지 파일 로딩 실패도 같은 fallback으로 처리한다.

코드 위치: [FE/umcine/src/utils/movies/tmdb-image.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/utils/movies/tmdb-image.ts)

```ts
const TMDB_POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";

export function getTmdbPosterUrl(path: string | null): string | null {
  return path ? `${TMDB_POSTER_BASE_URL}${path}` : null;
}

export function getTmdbBackdropUrl(path: string | null): string | null {
  return path ? `${TMDB_BACKDROP_BASE_URL}${path}` : null;
}
```

코드 위치: [FE/umcine/src/components/movies/movie-image.tsx](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/components/movies/movie-image.tsx)

```tsx
import { useState } from "react";

export default function MovieImage({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={`${alt || "영화"}: 이미지 없음`}
        className={`flex items-center justify-center bg-zinc-200 text-sm text-zinc-500 ${className ?? ""}`}
      >
        이미지 없음
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailedSrc(src)}
    />
  );
}
```

MovieCard는 TmdbMovieListItem 타입을 받고 getTmdbPosterUrl(movie.poster_path)를 MovieImage에 전달합니다. 목록에 없는 runtime/상세 장르 대신 vote_average/vote_count를 표시했습니다.

확인: 포스터 없는 영화가 검색 결과에 있다면 그 카드를 캡처합니다. 없으면 null fallback은 코드 및 기존 테스트 검증 항목으로 기록하고, 실제 영화에서 확인한 것처럼 적지 않습니다.

### F6. 검색과 상세 — 학습 내용 6.3

검색에서는 아래 두 부분을 붙이면 충분합니다. 긴 카드 JSX 전체를 붙이지 않아도 됩니다.

코드 위치: [FE/umcine/src/pages/movies/search-page.tsx](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/pages/movies/search-page.tsx:14)

```tsx
  const { query } = useSearch({
    from: "/search",
  });

  const navigate = useNavigate({
    from: "/search",
  });

  const normalizedQuery = query?.trim().toLowerCase() ?? "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const nextQuery = String(formData.get("query") ?? "").trim();

    navigate({
      search: nextQuery
        ? {
            query: nextQuery,
          }
        : {},
    });
  }
```

코드 위치: [FE/umcine/src/pages/movies/search-page.tsx](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/pages/movies/search-page.tsx:154)

```tsx
  const [data, setData] = useState<TmdbMovieListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    searchMovies({ query, page, signal: controller.signal })
      .then((response) => {
        if (!controller.signal.aborted) setData(response);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [query, page, attempt]);
```

붙일 설명 초안:

> URL의 query를 읽고 빈 검색어에는 요청하지 않는다. 검색 폼을 제출하면 TanStack Router로 query를 바꾸고, 실제 search/movie API를 호출한다. 검색어가 바뀌면 이전 요청을 취소한다. 직접 URL 진입과 새로고침에서도 URL의 검색어를 다시 읽는다.

상세에서는 ID 검증·요청·오류 구분 부분을 붙입니다.

코드 위치: [FE/umcine/src/pages/movies/movie-detail-page.tsx](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/pages/movies/movie-detail-page.tsx:15)

```tsx
export function MovieDetailPage() {
  const { movieId } = useParams({
    from: "/movies/$movieId",
  });

  const id = Number(movieId);
  if (!Number.isInteger(id) || id <= 0)
    return (
      <main className="p-12 text-center" role="alert">
        올바르지 않은 영화 번호예요.
      </main>
    );
  return <MovieDetail key={id} movieId={id} />;
}
```

코드 위치: [FE/umcine/src/pages/movies/movie-detail-page.tsx](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/pages/movies/movie-detail-page.tsx:30)

```tsx
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    getMovieDetail(movieId, controller.signal)
      .then((response) => {
        if (!controller.signal.aborted) setMovie(response);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setErrorMessage(getMovieDetailErrorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [movieId, attempt]);
  function retry() {
    setErrorMessage("");
    setIsLoading(true);
    setAttempt((value) => value + 1);
  }
  if (isLoading || errorMessage)
    return (
      <RequestStatus loading={isLoading} error={errorMessage} onRetry={retry} />
    );
```

코드 위치: [FE/umcine/src/utils/movies/get-movie-detail-error-message.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/utils/movies/get-movie-detail-error-message.ts)

```ts
import { isHTTPError } from "ky";

export function getMovieDetailErrorMessage(error: unknown): string {
  if (isHTTPError(error) && error.response.status === 404)
    return "영화를 찾을 수 없어요.";
  return "영화 정보를 불러오지 못했어요.";
}
```

붙일 설명 초안:

> 영화 ID를 숫자로 바꾼 뒤 양의 정수인지 검사한다. 잘못된 ID는 요청 전에 차단하며, 서버 404는 '영화를 찾을 수 없어요.'로 구분한다. 정상 응답의 장르·줄거리·포스터·러닝타임을 표시하고 분 단위 시간을 읽기 쉬운 형식으로 변환한다.

직접 해볼 동작:

| 입력/조작 | 확인할 내용 |
| --- | --- |
| /search | 검색어 안내, search/movie 요청 없음 |
| /search?query=스파이더맨 직접 열기 | 실제 검색 결과, Network query |
| 검색 결과에서 새로고침 | 같은 검색어로 다시 조회 |
| 결과 카드 상세 링크 클릭 | 실제 movieId를 포함한 /movies/{id}와 상세 응답 |
| 해당 상세 주소 직접 열고 새로고침 | 정상 조회 |
| /movies/abc, /movies/-1, /movies/0 | 잘못된 영화 번호 문구, movie/{id} API 호출 없음 |
| /movies/999999999 | 서버가 404를 반환하는지 먼저 확인 후 전용 문구 확인 |
| 긴 임의 검색어로 검색 | results가 []일 때 빈 결과 UI |

**캡처 F-04:** 검색 URL·결과와 Network 응답.
**캡처 F-05:** 상세 URL·화면과 Network 응답.
**캡처 F-06:** 잘못된 ID/404/빈 검색 결과 중 대표 오류 화면.

주소 표시줄의 문서 요청 /movies/abc 자체와 TMDB로 보내는 API 요청은 구분합니다. Network에서 TMDB host 또는 Fetch/XHR로 필터링하여 ID 검증 때문에 API 호출이 생략되었는지 확인합니다.

### F7. 출처·기존 기능·최종 검증

TMDB 출처 코드는 공통 루트 footer에 있습니다.

코드 위치: [FE/umcine/src/routes/__root.tsx](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/routes/__root.tsx:9)

```tsx
      <footer className="border-t border-zinc-200 bg-white px-5 py-6 text-center text-xs text-zinc-500">
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3"
        >
          <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="w-20" />
          영화 정보 제공: TMDB
        </a>
        <p className="mt-2">
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </footer>
```

노션에 붙일 설명 초안:

> TMDB의 snake_case 응답을 카드에서 사용하도록 수정하고, 기존 상세 링크와 Zustand 북마크를 유지했다. 북마크와 카드 크기는 localStorage에 저장된다. 기존 세션 북마크는 localStorage 값이 없을 때 한 번 옮기도록 구성했다. 로컬 배열과 Movie 타입은 모든 참조를 바꾼 후 제거했다.

북마크 저장 관련 코드는 FE/umcine/src/stores/bookmark-store.ts입니다. card-size-control.tsx와 ui-preference-store.ts는 기존 코드를 유지했습니다. API 응답의 id를 store에 저장하며 북마크 상태를 TMDB 응답에 섞지 않았습니다.

직접 해볼 동작:

1. 목록에서 영화 한 개를 북마크합니다.
2. 같은 영화를 검색하고 북마크 표시가 유지되는지 봅니다.
3. 상세 페이지의 버튼도 해제 상태인지 확인합니다.
4. 새로고침 후 북마크와 카드 크기 설정이 유지되는지 봅니다.
5. DevTools Console에서 정상 요청 시 처리되지 않은 JavaScript 오류가 없는지 확인합니다. 의도적으로 만든 401/404/CORS 오류 캡처와 구분합니다.

프런트 폴더에서:

```powershell
pnpm lint
pnpm build
```

**캡처 F-07:** 북마크/카드 크기 유지 대표 화면 또는 짧은 영상.
**캡처 F-08:** 실제 pnpm lint와 pnpm build 성공 로그.

### F8. 선택 미션: 다시 시도

선택 미션 토글에는 RequestStatus 코드와 목록 페이지의 retry 함수·attempt 의존성을 붙입니다.

코드 위치: [FE/umcine/src/components/movies/request-status.tsx](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/components/movies/request-status.tsx)

```tsx
export default function RequestStatus({
  loading,
  error,
  onRetry,
}: {
  loading?: boolean;
  error?: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="mx-auto my-10 max-w-3xl rounded-2xl bg-white p-10 text-center"
      role={error ? "alert" : "status"}
    >
      <p>{loading ? "영화를 불러오는 중이에요…" : error}</p>
      {error && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-xl bg-zinc-950 px-5 py-3 text-white"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
```

코드 위치: [FE/umcine/src/pages/movies/movie-list-page.tsx](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/pages/movies/movie-list-page.tsx:57)

```tsx
  function retry() {
    setErrorMessage("");
    setIsLoading(true);
    setAttempt((value) => value + 1);
  }
  if (isLoading || errorMessage)
    return (
      <RequestStatus loading={isLoading} error={errorMessage} onRetry={retry} />
    );
```

붙일 설명 초안:

> 요청 실패 시 다시 시도 버튼을 제공했다. 버튼을 누르면 오류를 비우고 로딩 상태로 전환한 뒤 attempt 값을 증가시켜 같은 페이지·검색어·영화 ID의 요청을 다시 실행한다.

실제 동작 확인:

1. 한 번 정상 목록을 연 뒤 DevTools Network에서 Offline을 선택합니다.
2. 다른 페이지 버튼을 눌러 실패 UI가 나올 때까지 기다립니다. ky의 재시도로 조금 걸릴 수 있습니다.
3. 다시 Online/No throttling으로 복원합니다.
4. 앱의 다시 시도 버튼을 눌러 마지막 요청이 성공하는 것을 확인합니다.

**캡처 F-09:** 오류 화면과 복구 후 정상 화면. 토큰을 바꾸는 실습은 필수 fetch 오류 확인에 사용할 수 있지만, 다시 시도 버튼 인증은 Offline/Online이 편합니다.

현재 선택 미션 상태:

- 다시 시도: 구현함.
- page를 URL search param으로 관리: 구현하지 않음. page API 전달 기능과 다름.
- API→별도 UI Movie 타입 adapter: 구현하지 않음. TMDB 타입을 UI에 직접 사용함.

## 5. 백엔드 미션에 넣을 코드와 설명

### B1. ERD와 테이블 — 본문 들어가기 전 2

노션에는 Member 1:N Rating, Member 1:N Favorite 관계를 그림 또는 텍스트로 표시합니다. rating/favorite의 member_id만 FK이고 movie_id는 TMDB 외부 식별자입니다. 아래 SQL을 붙이고 Workbench 생성·조회 캡처를 추가합니다.

**캡처 B-01:** umc_movie의 member/rating/favorite 테이블 목록과 seed 조회 결과.

코드 위치: [BE/movie/sql/schema.sql](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/BE/movie/sql/schema.sql)

```sql
CREATE DATABASE IF NOT EXISTS umc_movie CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE umc_movie;

CREATE TABLE member (
    member_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(254) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE rating (
    rating_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    score TINYINT NOT NULL,
    comment TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES member(member_id),
    UNIQUE KEY uk_rating_member_movie (member_id, movie_id)
);

CREATE TABLE favorite (
    favorite_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES member(member_id),
    UNIQUE KEY uk_favorite_member_movie (member_id, movie_id)
);
```

코드 위치: [BE/movie/sql/seed.sql](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/BE/movie/sql/seed.sql)

```sql
USE umc_movie;

-- Development-only dummy hashes. These are not usable credentials.
INSERT INTO member (email, password, nickname) VALUES
('noco@umc.com', '$2a$10$dummyEncodedPasswordValue', '수현'),
('minseo@umc.com', '$2a$10$dummyEncodedPasswordValue', '민서');

INSERT INTO rating (member_id, movie_id, score, comment) VALUES
(1, 550, 5, '최고의 영화!'),
(1, 155, 4, '다시 봐도 명작'),
(2, 550, 3, '호불호가 갈릴 것 같아요');
```

붙일 설명 초안:

> 한 회원은 여러 영화에 평점과 즐겨찾기를 남길 수 있다. 같은 회원이 같은 영화에 중복 평점/즐겨찾기를 넣지 못하도록 (member_id, movie_id) 복합 UNIQUE를 설정했다. 영화 상세 데이터는 TMDB에서 조회하므로 Movie 테이블은 두지 않았다. Favorite API는 아직 만들지 않고 이후 주차를 위한 테이블만 준비했다.

### B2. 새 NestJS 프로젝트·DB·Repository 등록 — 본문 들어가기 전 3 / 본문 4

붙일 설명 초안:

> 3~4주차 BE/study와 별개로 BE/movie를 만들고 npm을 사용했다. controller/service/repository/entity/dto Layer 구조로 구성했다. ConfigService로 MySQL 환경 변수를 읽고 synchronize:false로 설정해 SQL로 스키마를 관리한다. app.module.ts에서 Entity·Controller·Service를 직접 등록했다.

프로젝트 트리는 기존 WEEK05.md의 BE/movie 구조를 붙이면 됩니다. 다음 AppModule 코드가 DB 연결과 Repository 등록의 핵심입니다.

코드 위치: [BE/movie/src/app.module.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/BE/movie/src/app.module.ts)

```ts
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Member } from "./entity/member.entity.js";
import { Rating } from "./entity/rating.entity.js";
import { MemberController } from "./controller/member.controller.js";
import { RatingController } from "./controller/rating.controller.js";
import { MemberService } from "./service/member.service.js";
import { RatingService } from "./service/rating.service.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "mysql" as const,
        host: config.get<string>("DB_HOST", "127.0.0.1"),
        port: Number(config.get<string>("DB_PORT", "3307")),
        username: config.get<string>("DB_USER", "root"),
        password: config.get<string>("DB_PASSWORD", ""),
        database: config.get<string>("DB_NAME", "umc_movie"),
        autoLoadEntities: true,
        synchronize: false,
        supportBigNumbers: true,
        bigNumberStrings: true,
      }),
    }),
    TypeOrmModule.forFeature([Member, Rating]),
  ],
  controllers: [MemberController, RatingController],
  providers: [MemberService, RatingService],
})
export class AppModule {}
```

TypeOrmModule.forFeature([Member, Rating])는 해당 엔티티 Repository를 주입받도록 등록하는 부분입니다. Service의 @InjectRepository(Member)/@InjectRepository(Rating)이 실제 Repository를 받습니다. repository 폴더에 직접 만든 클래스를 넣지는 않았습니다. .gitkeep만 있는 것은 누락이 아닙니다.

### B3. API 명세 — 본문 들어가기 전 4

아래 표를 노션 표로 붙이고 응답 예시를 이어서 붙입니다. 세 API 모두 인증이 없는 조회 요청이며 Request Body는 없습니다.

| 이름 | Method + URL | Request | 200 응답 | 오류 |
| --- | --- | --- | --- | --- |
| 닉네임 중복 체크 | GET /members/nickname/{nickname} | Path nickname: string, 2~12자 | { available: boolean } | 형식 오류 400 |
| 이메일 중복 체크 | GET /members/email/{email} | Path email: string, 이메일 형식 | { available: boolean } | 형식 오류 400 |
| 유저별 평점 조회 | GET /members/{memberId}/ratings | Path memberId: 양의 안전한 정수 | RatingResponseDto[] | ID 오류 400 / 유저 없음 404 |

평점 응답 필드:

| 필드 | JSON 타입 | 의미 |
| --- | --- | --- |
| ratingId | number | 우리 DB의 평점 ID |
| movieId | number | TMDB의 영화 ID |
| score | number | 저장한 평점 |
| comment | string 또는 null | 코멘트 |
| createdAt | string | 생성일시 |
| updatedAt | string | 수정일시 |

```json
{ "available": false }
```

평점 JSON은 아래 모양입니다. 날짜를 포함해 제출할 실제 응답은 본인의 Postman에서 복사합니다.

```json
[
  {
    "ratingId": 2,
    "movieId": 155,
    "score": 4,
    "comment": "다시 봐도 명작",
    "createdAt": "실제 응답의 날짜",
    "updatedAt": "실제 응답의 날짜"
  }
]
```

### B4. Entity — 본문 3

BaseTimeEntity는 공통 시간 컬럼, Member는 회원, Rating은 회원이 남긴 평점입니다. 세 파일을 코드 블록으로 붙이면 됩니다.

코드 위치: [BE/movie/src/entity/base-time.entity.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/BE/movie/src/entity/base-time.entity.ts)

```ts
import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseTimeEntity {
  @CreateDateColumn({ name: "created_at", type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "datetime" })
  updatedAt!: Date;
}
```

코드 위치: [BE/movie/src/entity/member.entity.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/BE/movie/src/entity/member.entity.ts)

```ts
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseTimeEntity } from "./base-time.entity.js";

@Entity("member")
export class Member extends BaseTimeEntity {
  // mysql2 returns BIGINT as strings to preserve precision.
  @PrimaryGeneratedColumn({ name: "member_id", type: "bigint" })
  memberId!: string;

  @Column({ length: 254, unique: true })
  email!: string;

  @Column({ length: 60, select: false })
  password!: string;

  @Column({ length: 50, unique: true })
  nickname!: string;
}
```

코드 위치: [BE/movie/src/entity/rating.entity.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/BE/movie/src/entity/rating.entity.ts)

```ts
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { BaseTimeEntity } from "./base-time.entity.js";
import { Member } from "./member.entity.js";

@Entity("rating")
@Unique("uk_rating_member_movie", ["member", "movieId"])
export class Rating extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: "rating_id", type: "bigint" })
  ratingId!: string;

  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn({ name: "member_id" })
  member!: Member;

  // External TMDB identifier; deliberately not a foreign key.
  @Column({ name: "movie_id", type: "bigint" })
  movieId!: string;

  @Column({ type: "tinyint" })
  score!: number;

  @Column({ type: "text", nullable: true })
  comment!: string | null;
}
```

설명할 부분: @Entity는 테이블, @Column은 컬럼, @PrimaryGeneratedColumn은 자동 증가 PK를 연결합니다. Rating의 @ManyToOne과 @JoinColumn은 member_id FK 관계를 연결합니다. movieId에는 관계 데코레이터가 없습니다. DB BIGINT는 정밀도 보존을 위해 문자열로 읽고 DTO에서 안전한 숫자인지 확인합니다.

### B5. DTO — 본문 5

붙일 설명 초안:

> Entity를 그대로 반환하지 않고 공개할 필드만 DTO에 담았다. CheckResponseDto는 available, RatingResponseDto는 평점 정보만 노출한다. 평점에 연결된 Member나 password는 포함하지 않는다. from 메서드가 Entity를 응답 DTO로 바꾼다.

코드 위치: [BE/movie/src/dto/check-response.dto.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/BE/movie/src/dto/check-response.dto.ts)

```ts
export class CheckResponseDto {
  available!: boolean;
}
```

코드 위치: [BE/movie/src/dto/rating-response.dto.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/BE/movie/src/dto/rating-response.dto.ts)

```ts
import { InternalServerErrorException } from "@nestjs/common";
import { Rating } from "../entity/rating.entity.js";

function toSafeId(value: string): number {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new InternalServerErrorException(
      "식별자가 지원 범위를 벗어났습니다.",
    );
  }
  return id;
}

export class RatingResponseDto {
  ratingId!: number;
  movieId!: number;
  score!: number;
  comment!: string | null;
  createdAt!: Date;
  updatedAt!: Date;

  static from(rating: Rating): RatingResponseDto {
    return Object.assign(new RatingResponseDto(), {
      ratingId: toSafeId(rating.ratingId),
      movieId: toSafeId(rating.movieId),
      score: rating.score,
      comment: rating.comment,
      createdAt: rating.createdAt,
      updatedAt: rating.updatedAt,
    });
  }
}
```

### B6. 세 API의 Controller / Service — 본문 6 / 7 / 8

회원 Controller와 Service는 닉네임/이메일 두 API를 함께 담고 있습니다.

코드 위치: [BE/movie/src/controller/member.controller.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/BE/movie/src/controller/member.controller.ts)

```ts
import { Controller, Get, Param } from "@nestjs/common";
import { MemberService } from "../service/member.service.js";
import { EmailParamsDto, NicknameParamsDto } from "../dto/check-params.dto.js";

@Controller("members")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get("nickname/:nickname")
  checkNickname(@Param() params: NicknameParamsDto) {
    return this.memberService.checkNickname(params.nickname);
  }

  @Get("email/:email")
  checkEmail(@Param() params: EmailParamsDto) {
    return this.memberService.checkEmail(params.email);
  }
}
```

코드 위치: [BE/movie/src/service/member.service.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/BE/movie/src/service/member.service.ts)

```ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Member } from "../entity/member.entity.js";
import { CheckResponseDto } from "../dto/check-response.dto.js";

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async checkNickname(nickname: string): Promise<CheckResponseDto> {
    const exists = await this.memberRepository.exists({ where: { nickname } });
    return { available: !exists };
  }

  async checkEmail(email: string): Promise<CheckResponseDto> {
    const exists = await this.memberRepository.exists({ where: { email } });
    return { available: !exists };
  }
}
```

설명 초안:

> Controller가 URL의 nickname/email을 받고 Service에 전달한다. Service는 Repository.exists로 DB에 같은 값이 있는지 확인한다. 존재하면 이미 사용 중이므로 available은 false, 없으면 true를 반환한다.

평점 API:

코드 위치: [BE/movie/src/controller/rating.controller.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/BE/movie/src/controller/rating.controller.ts)

```ts
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { RatingService } from "../service/rating.service.js";

@Controller("members")
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(":memberId/ratings")
  findByMember(@Param("memberId", ParseIntPipe) memberId: number) {
    if (!Number.isSafeInteger(memberId) || memberId <= 0) {
      throw new BadRequestException("올바르지 않은 유저 번호입니다.");
    }
    return this.ratingService.findByMember(memberId);
  }
}
```

코드 위치: [BE/movie/src/service/rating.service.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/BE/movie/src/service/rating.service.ts)

```ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Member } from "../entity/member.entity.js";
import { Rating } from "../entity/rating.entity.js";
import { RatingResponseDto } from "../dto/rating-response.dto.js";

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async findByMember(memberId: number): Promise<RatingResponseDto[]> {
    const id = String(memberId);
    if (!(await this.memberRepository.exists({ where: { memberId: id } }))) {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }
    const ratings = await this.ratingRepository.find({
      where: { member: { memberId: id } },
      order: { ratingId: "DESC" },
    });
    return ratings.map(RatingResponseDto.from);
  }
}
```

설명 초안:

> ParseIntPipe로 URL의 회원 ID를 숫자로 받고 양의 안전한 정수인지 검사한다. 회원이 없으면 404를 반환한다. 회원이 있으면 해당 회원의 평점만 ratingId DESC로 조회하고 DTO로 변환한다. 회원이 있지만 평점이 없을 때는 빈 배열을 반환한다.

**Postman 인증 순서:**

Postman에서 새 HTTP Request → GET → 아래 전체 URL 입력 → Send → URL·status·응답 JSON이 함께 보이게 캡처합니다. Nickname의 한글은 Postman이 URL encoding해서 보낼 수 있습니다.

| 캡처 | URL | 새 DB에 제공한 seed를 넣었을 때 예상 |
| --- | --- | --- |
| B-02 | http://localhost:3000/members/nickname/수현 | 200, available:false |
| B-03 | http://localhost:3000/members/nickname/꿀범 | 200, available:true |
| B-04 | http://localhost:3000/members/email/noco@umc.com | 200, available:false |
| B-05 | http://localhost:3000/members/email/new@umc.com | 200, available:true |
| B-06 | http://localhost:3000/members/1/ratings | 200, ratingId 2 → 1 |
| B-07 | http://localhost:3000/members/999/ratings | 해당 회원이 실제 없으면 404 |

자동 테스트의 가상 회원 3번은 실제 seed에 없습니다. 실제 DB에서 /members/3/ratings가 []라고 가정하면 안 됩니다. 평점 없는 회원의 []를 별도로 인증하려면 본인 개발 DB에서 평점 없는 회원이 실제 존재하는지 확인한 뒤 그 ID를 사용합니다.

### B7. CORS 적용 전후 — 본문 1 / 2 / 9

핵심 코드는 main.ts와 configure-app.ts 두 파일입니다. main.ts가 설정 함수를 실제 적용하므로 두 파일을 함께 설명합니다.

코드 위치: [BE/movie/src/main.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/BE/movie/src/main.ts)

```ts
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module.js";
import { configureApp } from "./configure-app.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  configureApp(app, config.get<string>("CORS_ENABLED", "true") !== "false");
  await app.listen(Number(config.get<string>("PORT", "3000")));
}
void bootstrap();
```

코드 위치: [BE/movie/src/configure-app.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/BE/movie/src/configure-app.ts)

```ts
import { type INestApplication, ValidationPipe } from "@nestjs/common";

export function configureApp(app: INestApplication, corsEnabled = true) {
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  if (corsEnabled) {
    app.enableCors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PATCH", "DELETE"],
    });
  }
}
```

**실습 A — CORS 적용 전:**

1. BE/movie/.env에서 CORS_ENABLED=false로 바꿉니다.
2. 백엔드 터미널에서 Ctrl+C 후 npm run start:dev로 재시작합니다. .env는 src 변경 감시만으로 재시작되지 않을 수 있으므로 명시적으로 재시작합니다.
3. 브라우저 http://localhost:5173/api-test를 엽니다.
4. F12 → Console/Network를 엽니다.
5. 닉네임 수현으로 중복 확인을 누릅니다.
6. 브라우저 Console의 CORS 차단 메시지와 화면의 연결 실패 문구를 확인합니다.

**캡처 B-08:** CORS 적용 전 Console 오류. 서버 중지/DB 연결 실패로 생긴 ERR_CONNECTION_REFUSED는 CORS 인증이 아닙니다. 서버가 정상으로 응답하는지는 같은 URL을 Postman으로 먼저 확인합니다.

**실습 B — CORS 적용 후:**

1. CORS_ENABLED=true로 복원합니다.
2. 백엔드를 재시작하고 /api-test를 새로고침합니다.
3. 수현 / noco@umc.com / Member ID 1을 세 폼에 넣고 각각 버튼을 누릅니다.
4. 닉네임 중복, 이메일 중복, 평점 목록이 실제 서버 응답으로 표시되는지 확인합니다.
5. Network에서 각 요청 status 200과 Response JSON을 확인합니다.
6. Response Headers의 Access-Control-Allow-Origin: http://localhost:5173도 확인합니다.

**캡처 B-09:** CORS 후 응답과 허용 Origin header.
**캡처 B-10:** /api-test에서 세 API 결과가 함께 보이는 화면. 가능하면 결과별 Network 응답도 각각 남깁니다.

붙일 설명 초안:

> 프런트 localhost:5173과 백엔드 localhost:3000은 포트가 달라 cross-origin이다. 서버가 응답해도 CORS 허용 header가 없으면 브라우저가 JavaScript에 응답을 제공하지 않아 화면에서 읽지 못한다. 백엔드에 localhost:5173을 허용한 뒤 같은 화면에서 응답을 읽을 수 있었다.

Postman은 브라우저의 SOP/CORS 정책을 적용하지 않으므로 Postman 성공만으로 CORS 성공을 증명할 수 없습니다. 또한 단순 GET은 OPTIONS preflight가 없을 수 있습니다. OPTIONS가 보여야만 성공하는 것은 아닙니다. [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

워크북의 별도 mock-frontend/index.html은 추가하지 않았습니다. 이번에는 실제 UMCine의 /api-test가 동일한 실습 역할을 합니다. mock-frontend가 있다고 기록할 필요가 없습니다.

### B8. 실제 프론트 연결 — 필수 미션

아래 API 함수 파일 전체와 ApiTestPage의 폼 요청 부분을 붙이면 됩니다. UI 장식용 className까지 전부 붙일 필요는 없습니다.

코드 위치: [FE/umcine/src/api/members.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/api/members.ts)

```ts
import ky from "ky";

const backendClient = ky.create({
  baseUrl: `${(import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:3000").replace(/\/+$/, "")}/`,
  retry: 0,
});

export interface CheckResponse {
  available: boolean;
}
export interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export function checkNickname(nickname: string) {
  return backendClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckResponse>();
}
export function checkEmail(email: string) {
  return backendClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckResponse>();
}
export function getMemberRatings(memberId: number) {
  return backendClient
    .get(`members/${memberId}/ratings`)
    .json<RatingResponse[]>();
}
```

코드 위치: [FE/umcine/src/pages/api-test-page.tsx](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/FE/umcine/src/pages/api-test-page.tsx:28)

```tsx
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(
      new FormData(event.currentTarget).get("value") ?? "",
    ).trim();
    setLoading(true);
    setResult("");
    try {
      const data = await (kind === "nickname"
        ? checkNickname(value)
        : checkEmail(value));
      setResult(data.available ? "사용 가능" : "중복");
    } catch (error) {
      setResult(await backendError(error));
    } finally {
      setLoading(false);
    }
  }
```

평점 조회는 같은 파일의 RatingsForm에서 getMemberRatings(memberId)를 호출하는 부분을 붙입니다. Route 등록은 FE/umcine/src/routes/api-test.tsx에 있습니다.

설명 초안:

> 기존 영화 화면과 별개인 /api-test에서 닉네임·이메일 중복 확인과 평점 조회를 실행하도록 했다. 입력값을 API 함수에 전달하고 받은 available/평점 배열을 화면에 표시한다. backendClient는 localhost:3000으로 요청하므로 실제 브라우저의 cross-origin 요청을 확인할 수 있다.

### B9. 선택 미션: 닉네임 / 이메일 Validation

입력 DTO와 configure-app.ts의 ValidationPipe 부분을 선택 미션에 넣습니다.

코드 위치: [BE/movie/src/dto/check-params.dto.ts](C:/Users/proce/OneDrive/문서/ChatGPT/UMC11th/BE/movie/src/dto/check-params.dto.ts)

```ts
import { IsEmail, IsString, Length } from "class-validator";

export class NicknameParamsDto {
  @IsString()
  @Length(2, 12)
  nickname!: string;
}

export class EmailParamsDto {
  @IsEmail()
  @Length(3, 254)
  email!: string;
}
```

설명 초안:

> 닉네임은 2~12자, 이메일은 유효한 형식인지 DTO와 ValidationPipe로 먼저 확인한다. 검증에 실패하면 Controller가 Service의 중복 조회를 실행하기 전에 400을 반환한다.

Postman에서 다음을 각각 확인합니다.

| 요청 | 예상 |
| --- | --- |
| GET http://localhost:3000/members/nickname/a | 400 |
| GET http://localhost:3000/members/nickname/abcdefghijklmnop | 400 |
| GET http://localhost:3000/members/email/not-an-email | 400 |

**캡처 B-11:** 잘못된 nickname/email의 400과 message.

웹 폼에는 HTML minLength/type=email 검증도 있으므로 잘못된 입력은 요청 자체가 안 나갈 수 있습니다. 서버 검증을 인증하려면 Postman을 사용합니다.

선택 미션 상태:

- 닉네임/이메일 검증: 구현함.
- 평점 API의 page/size 페이지네이션: 구현하지 않음.
- CORS를 특정 Origin만 허용: 구현함. 다만 '*'와 비교한 캡처 및 3문장 설명까지 해야 워크북의 해당 선택 실습 전체 기록이 됩니다. 현재 가이드의 기본 인증은 CORS 비활성/활성 비교이며 '*' 비교를 실행한 것으로 기록하지 않습니다.

### B10. 백엔드 최종 검증

백엔드 폴더에서:

```powershell
npm run build
npm test
```

**캡처 B-12:** 빌드 성공과 테스트 7개 pass. npm test는 테스트용 Repository이므로 실제 MySQL 확인 캡처 B-01과 Postman/웹 캡처를 대체하지 않습니다.

## 6. 핵심 키워드에 적을 내용

아래는 개념을 이해하기 위한 초안입니다. 복사만 하기보다 실제 실행에서 확인한 내용을 한 문장씩 덧붙이세요.

### 프론트 핵심 키워드

| 키워드 | 우리 코드에 연결한 설명 |
| --- | --- |
| API / endpoint | 데이터를 요청하는 약속과 그 요청 경로. getMovies가 movie/popular로 인기 영화를 요청한다 |
| HTTP method / status | GET은 조회 목적, 200은 성공, 401은 인증 실패, 404는 리소스를 찾지 못한 응답이다 |
| Promise | 요청을 시작할 때는 pending, 값이 도착하면 fulfilled, 실패로 끝나면 rejected가 된다 |
| then/catch/finally | 성공 데이터를 저장하고, 오류 문구를 표시하고, 끝나면 로딩 상태를 해제한다 |
| async/await | 같은 Promise 흐름을 순서대로 읽도록 쓰는 문법이다. await는 현재 async 함수의 다음 실행을 미룬다 |
| fetch의 HTTP 오류 | 404여도 Response를 받는 것 자체는 성공할 수 있어 response.ok 검사가 필요하다 |
| ky | 반복되는 URL/header를 모으고 searchParams와 json<T>를 사용할 수 있게 한다 |
| ky와 Axios | ky는 json<T>()의 결과로 JSON을 읽고 hooks를 사용한다. Axios는 response.data와 interceptors를 사용한다. 우리 프로젝트는 ky만 설치했다 |
| UI 상태 | 기다리는 중/요청 실패/정상 응답이지만 결과 없음/성공을 구분해야 사용자가 상황을 알 수 있다 |
| API 타입 / UI 타입 | 현재는 TMDB 타입을 직접 사용한다. 화면이 다른 필드명을 원하거나 서버 변경 영향을 제한하고 싶을 때 adapter로 분리할 수 있다 |

별도 Promise 예제 파일은 현재 만들지 않았습니다. 학습 내용 2.1/2.2를 직접 실습하려면 워크북 예제를 Console용 JavaScript로 실행하거나 임시 examples 파일을 만들면 됩니다. 실제 프로젝트에서는 목록 페이지가 then/catch/finally를, API 함수가 async/await를 보여줍니다. 이것을 설명 코드로 연결할 수 있습니다.

### 백엔드 핵심 키워드

- SOP: 브라우저가 다른 출처의 데이터를 JavaScript에서 읽는 것을 제한하는 기본 정책이다.
- CORS: 서버 응답 header로 허용한 Origin의 프런트 코드가 응답을 읽을 수 있게 한다. 인증·인가 자체를 대신하지 않는다.
- Same-Origin: protocol, host, port가 같아야 한다. localhost:5173과 localhost:3000은 다르다.
- Same-Site: 보통 scheme과 등록 가능 도메인을 기준으로 판단하고 port를 구분하지 않는다. 따라서 위의 두 HTTP localhost 주소는 cross-origin이면서 same-site일 수 있다. localhost는 일반적인 example.com 형태의 등록 도메인과는 구분해서 이해한다.
- 쿠키 SameSite: cross-site 상황에서 쿠키 전송을 제한하는 속성이다. Strict는 엄격하게, Lax는 일부 최상위 안전한 탐색 등을 허용하며, None은 cross-site 전송을 허용하고 Secure가 요구된다. 이번 프로젝트에는 아직 쿠키 로그인 기능이 없다.
- 복합 UNIQUE: member_id 또는 movie_id 하나씩이 아닌 둘의 조합이 중복되지 않게 한다. 회원은 다른 영화에 평점을 남길 수 있지만 같은 영화의 평점은 하나만 가진다.
- API Key 위치: 숨겨야 할 값은 백엔드에서 관리해야 한다. VITE_ 토큰을 Git에서 제외해도 브라우저 요청/번들에는 나타나므로 비밀이 되지 않는다. 이번 주차는 워크북에 따라 TMDB 읽기 토큰을 브라우저에서 사용한다.

참고: [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS), [MDN Site](https://developer.mozilla.org/en-US/docs/Glossary/Site), [MDN SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#samesitesamesite-value), [Vite 환경 변수](https://vite.dev/guide/env-and-mode).

## 7. 트러블 슈팅에 넣을 수 있는 실제 사례

다음은 이전 구현 과정에서 실제 발생하고 수정한 항목입니다. 본인이 새로 겪었다고 쓰기보다는 '구현 과정에서 발생한 오류를 코드와 로그를 보며 정리했다'처럼 사실대로 기록하고, 설명할 수 있는 항목을 고르세요.

### 사례 1. 기존 App.tsx 참조 오류

- 이슈: TypeScript 검사에서 이전 컴포넌트/로컬 Movie import 경로가 남아 오류가 발생했다.
- 문제: 실제 진입점은 TanStack Router인데 사용하지 않는 옛 App.tsx가 src 타입 검사 대상에 포함되어 있었다.
- 해결: 현재 MovieListPage를 호환 export하도록 정리하고 로컬 Movie 참조를 제거했다.
- 결과: pnpm build 통과.

### 사례 2. 백엔드 TS1479

- 이슈: 새 NestJS 프로젝트에서 ESM 패키지를 CommonJS 방식으로 불러오려다 TS1479가 발생했다.
- 문제: Nest 12와 새 프로젝트 module 설정이 맞지 않았다.
- 해결: package.json에 type:module을 적용하고 상대 import에 .js 확장자를 맞췄다.
- 결과: npm run build 통과.

### 사례 3. 404 응답의 상세 문구가 안 보임

- 이슈: /api-test에서 없는 회원을 조회하면 '존재하지 않는 유저입니다.' 대신 일반 404 문구만 보였다.
- 문제: Ky 2는 오류 응답 body를 error.data로 파싱하는 과정에서 소비하므로 response.clone().json()으로 다시 읽을 수 없었다.
- 해결: backendError에서 error.data의 message를 사용했다.
- 결과: 브라우저 검증에서 404의 서버 메시지 표시를 확인했다.

수정 코드는 FE/umcine/src/pages/api-test-page.tsx의 backendError 함수에 있습니다.

### 사례 4. useEffect의 이전 응답 처리

이 항목은 이번에 실제 발생한 lint 오류라기보다 이전 주차 문제를 고려해 예방적으로 설계한 내용입니다. '이번에 lint 에러가 발생했다'고 적지 않고, 'effect 시작 시 동기 setState를 피하고 cleanup을 추가했다'는 개선 설명으로 기록합니다.

## 8. 제출 전 마지막 확인

### 프론트 필수 미션

- [ ] 실제 토큰으로 순수 fetch 인기 영화 200 응답을 직접 확인했다.
- [ ] ky 목록/검색/상세가 실제 TMDB 데이터로 표시된다.
- [ ] 직접 URL 입력과 새로고침을 확인했다.
- [ ] 로딩/오류/빈 결과/성공을 구분했다.
- [ ] TMDB 출처가 보인다.
- [ ] 정상 동작의 Console을 확인하고 pnpm lint/build 성공을 캡처했다.
- [ ] 선택 미션의 다시 시도 전후를 확인했다.

### 백엔드 필수 미션

- [ ] 실제 MySQL에 세 테이블과 seed가 있다.
- [ ] 실제 서버에 Postman으로 세 API를 모두 호출했다.
- [ ] CORS false/true 전후를 같은 브라우저 화면에서 확인했다.
- [ ] /api-test에서 닉네임/이메일/평점 세 결과가 모두 보인다.
- [ ] 선택 Validation의 400을 Postman으로 확인했다.
- [ ] npm run build 성공을 캡처했다.

본인의 스터디 인증샷·학습 후기·실제 화면 인증은 코드만으로 대신할 수 없습니다. 실제 실행 후 결과를 채운 뒤 Notion 페이지 링크를 워크북에 안내된 제출 경로에 제출하세요. 현재 코드 작업은 아직 커밋/원격 push하지 않은 상태이므로 GitHub 코드 링크를 제출하려면 별도로 커밋/PR/push 절차가 필요합니다.
