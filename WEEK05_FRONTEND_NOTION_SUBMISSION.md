# UMC 11기 Product Engineering 5주차 — Frontend

사용 스택: React / TypeScript / Vite / TanStack Router / Zustand / Tailwind CSS / ky / pnpm

기존 UMCine의 로컬 영화 배열을 제거하고, TMDB 인기 영화·검색·상세 API에 연결했다. 기존 디자인, 북마크 공유, 카드 크기 설정은 유지했다. 영화 화면은 TMDB를 직접 호출하므로 이번 프론트 미션은 별도 NestJS 서버의 DB 연결 여부와 독립적으로 동작한다.

작성 상태: 코드 구현과 실제 TMDB 요청 검증을 완료했다. 아래 [캡처 추가] 위치에는 본인이 직접 촬영한 화면을 첨부한다. 테스트 데이터로 검증한 항목은 실제 TMDB 결과와 구분하여 기록했다.

# 💪 미션 기록

## 필수 미션 1. 환경 변수와 TMDB 응답 타입 구성

TMDB 주소와 Read Access Token을 환경 변수로 분리했다. 실제 값은 로컬 .env에서 사용하며 .gitignore로 제외했다. 기존 .env.local의 빈 TMDB 값이 .env를 덮어쓰지 않도록 정리했다. 아래는 공개 가능한 예시다.

```dotenv
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_ACCESS_TOKEN=
VITE_BACKEND_API_BASE_URL=http://localhost:3000
```

env.ts에서는 요청에 필요한 설정을 읽을 때 값이 있는지 확인한다. 토큰 미설정 때문에 앱 전체가 중단되는 대신 요청 화면에서 오류를 처리할 수 있게 했다.

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

서버 응답과 비교하기 쉽도록 snake_case를 유지했다. 목록과 검색은 genre_ids를 포함하는 TmdbMovieListItem, 상세는 genres/runtime/tagline을 포함하는 TmdbMovieDetail을 사용한다. 북마크 여부는 서버 응답 타입에 넣지 않고 영화 id를 이용해 Zustand에서 계산한다.

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

TypeScript 타입과 .json<T>()는 개발 시 타입 검사에 사용되며 실제 JSON을 런타임에 검증하는 것은 아니다. 실제 응답은 Network에서도 확인한다. VITE_ 변수는 브라우저에서 확인할 수 있으므로 실제 토큰은 노션 코드나 캡처에 포함하지 않는다. [Vite 환경 변수 문서](https://vite.dev/guide/env-and-mode)

## 필수 미션 2. 순수 fetch로 인기 영화 요청

ky를 사용하기 전의 요청 흐름을 확인하기 위해 순수 fetch 함수를 작성했다. URLSearchParams로 language와 page를 만들고 Authorization header에 Bearer 토큰을 전달한다. fetch는 4xx/5xx 상태만으로 reject하지 않으므로 response.ok를 검사해 HTTP 오류를 처리했다.

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

실제 요청 검증에서는 인기 영화 API가 200을 반환했고 영화 배열을 확인했다. 실습 함수는 최종 화면에서 자동 실행하지 않는다.

### 캡처할 내용

개발 서버의 /api-test를 연 뒤 DevTools Console에서 아래 코드를 실행한다. 이 화면은 자동으로 TMDB 목록을 요청하지 않아 순수 fetch 요청을 구분하기 쉽다. 백엔드 폼 버튼은 누르지 않아도 된다.

```javascript
import('/src/api/movies/get-movies-with-fetch.ts')
  .then((module) => module.getMoviesWithFetch(1))
  .then((response) => console.log(response.results))
  .catch((error) => console.error(error));
```

Network의 Fetch/XHR에서 movie/popular 요청을 선택하고 GET, status 200, language=ko-KR, page=1, Response의 results를 확인한다. 이 방법은 Vite 개발 서버용이며 main.tsx에 임시 import를 추가하지 않아도 된다.

**[캡처 1: 순수 fetch 요청 URL·200·query·Response results 추가]**

## 필수 미션 3. ky 공통 클라이언트와 API 함수 분리

base URL과 Authorization header가 반복되지 않도록 ky 공통 인스턴스를 분리했다. 첫 요청 시 인스턴스를 만들고 재사용한다. baseUrl 끝에는 /를 붙이고 상대 요청 경로는 / 없이 시작한다.

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

### 인기 영화 API

GET movie/popular에 language=ko-KR과 page를 전달한다. signal은 이전 요청 취소에 사용한다.

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

### 영화 검색 API

GET search/movie에 query, language, include_adult=false, page를 전달한다.

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

### 영화 상세 API

GET movie/{movieId}에 한국어 설정을 전달하고 상세 응답 타입으로 JSON을 읽는다.

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

## 필수 미션 4. 영화 목록 화면 연결

기존 로컬 movies import를 제거하고 getMovies의 응답을 사용했다. response.results로 MovieGrid를 표시하고, response.page와 total_pages로 페이지 버튼을 구성했다. 카드에서는 목록 응답에 없는 runtime/상세 genres 대신 vote_average와 vote_count를 표시했다.

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

페이지가 바뀌면 currentPage가 API query에 반영된다. 페이지 버튼은 최대 5개를 보여주고 TMDB 요청 가능 범위를 고려해 500페이지로 제한했다. 현재 페이지는 React 상태로 관리하며 URL의 ?page= 형태로 저장하는 선택 미션은 구현하지 않았다.

**[캡처 2: 인기 영화 목록 화면 추가]**

**[캡처 3: 2페이지 화면 또는 Network의 page=2 요청 추가]**

## 필수 미션 5. 검색 URL과 검색 API 연결

TanStack Router의 URL search param에서 query를 읽는다. 검색 폼을 제출하면 URL query를 변경하고, 검색 결과는 실제 search/movie API로 가져온다. 빈 검색어이면 결과 컴포넌트를 렌더링하지 않아 API 요청을 생략한다.

검색어 처리와 폼 제출 부분:

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

검색 결과 요청 부분:

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

검색어가 바뀌면 이전 요청을 취소하며, /search?query=스파이더맨 직접 접근과 새로고침을 지원한다. 실제 TMDB 검색 요청 및 새로고침 후 정상 응답을 검증했다.

**[캡처 4: 검색 URL·실제 결과·Network 응답 추가]**

**[캡처 5: 검색 결과가 없는 화면 추가]**

## 필수 미션 6. 영화 상세 API 연결

영화 ID를 숫자로 변환한 뒤 양의 정수인지 검사한다. 잘못된 값은 API 호출 전에 차단한다.

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

상세 요청 및 상태 처리:

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

잘못된 ID, 실제 404, 기타 오류를 구분한다. 404 판별은 ky의 isHTTPError를 사용한다.

```ts
import { isHTTPError } from "ky";

export function getMovieDetailErrorMessage(error: unknown): string {
  if (isHTTPError(error) && error.response.status === 404)
    return "영화를 찾을 수 없어요.";
  return "영화 정보를 불러오지 못했어요.";
}
```

상세 화면에는 제목·원제·개봉일·장르·상영 시간·태그라인·줄거리·포스터·배경·평점을 표시한다. runtime의 분 값을 시간/분 형식으로 변환한다. 실제 영화 ID 기반 상세 페이지, 새로고침과 북마크 유지가 검증되었다.

**[캡처 6: 실제 영화 상세 화면과 URL 추가]**

**[캡처 7: /movies/abc의 잘못된 영화 번호 화면 추가]**

## 필수 미션 7. 로딩·오류·빈 결과·성공 구분

| 상태 | 화면 처리 |
| --- | --- |
| Loading | 영화를 불러오는 중이에요… |
| Error | 오류 문구와 다시 시도 버튼 |
| Empty | 목록 또는 검색 결과 없음 안내 |
| Success | 실제 영화 카드 / 상세 정보 |
| 검색어 없음 | 찾고 싶은 영화를 검색해보세요 안내 |
| 잘못된 영화 ID | 올바르지 않은 영화 번호예요. |
| 상세 404 | 영화를 찾을 수 없어요. |

AbortController cleanup과 취소 여부 확인으로 이전 응답이 현재 결과를 덮어쓰지 않도록 했다. currentPage/query/movieId를 key로 사용하는 결과 컴포넌트에서 초기 로딩 상태를 얻어 effect 시작 시 불필요한 동기 setState를 피했다.

느린 이전 검색 응답의 덮어쓰기 방지, 404, 오류·재시도는 테스트 응답을 사용하는 브라우저 검증에서도 확인했다. 실제 TMDB 검증에서는 목록·페이지 변경·검색·상세·새로고침·잘못된 ID의 요청 생략을 확인했다.

## 필수 미션 8. 이미지 URL·fallback·TMDB 출처

TMDB의 이미지 경로에 포스터/배경 base URL을 붙였다. 경로가 null이면 null을 반환하고 화면에서 이미지 없음 fallback을 표시한다.

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

공통 루트 footer에 기존 TMDB 로고와 출처 문구를 표시했다.

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

**[캡처 8: 페이지 하단 TMDB 로고·출처 문구 추가]**

## 필수 미션 9. 기존 Zustand 기능 유지 및 최종 검증

목록·검색·상세에서 같은 BookmarkButton과 ID 기반 Zustand store를 사용한다. 북마크와 카드 크기는 localStorage에 저장된다. 기존 sessionStorage 북마크는 localStorage 값이 없을 때 한 번 옮기도록 했다. API 응답에 isBookmarked를 추가하지 않았다.

기존 로컬 영화 ID와 실제 TMDB ID는 서로 다른 체계이므로 과거 ID를 특정 TMDB 영화로 임의 변환하지 않았다.

실제 TMDB 검증 결과:

| 검증 항목 | 확인 결과 |
| --- | --- |
| 인기 영화 목록 | GET movie/popular 200 |
| 페이지 변경 | page=2 요청 200 및 다른 목록 |
| 스파이더맨 검색 | GET search/movie 200 |
| 검색 직접 URL / 새로고침 | 정상 |
| 실제 영화 ID 상세 | GET movie/{id} 200 |
| 상세 새로고침 / 북마크 유지 | 정상 |
| 순수 fetch 실습 함수 | 실제 인기 영화 요청 200 |
| 잘못된 ID | 오류 문구 표시, 상세 API 요청 생략 |
| 정상 검증 시 처리되지 않은 JS / Console 오류 | 0건 |

최종 확인 명령:

```powershell
pnpm lint
pnpm build
```

lint와 TypeScript/Vite build를 검증했다. Console 정상 상태는 의도적으로 만든 오류 요청 시점과 구분해 확인한다. ky 자동 재시도 또는 React 개발 모드 때문에 요청이 여러 번 보일 수 있으므로 query와 응답을 함께 본다.

**[캡처 9: Console 정상 상태 / lint·build 성공 로그 추가]**

## 선택 미션. 다시 시도 버튼

실패 화면에서 마지막 요청을 다시 실행하도록 구현했다. 버튼을 누르면 오류를 비우고 로딩 상태로 바꾼 뒤 attempt를 증가시킨다. effect가 같은 page/query/movieId로 재실행된다.

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

동작 확인 절차:

1. 정상 목록을 연다.
2. DevTools Network의 Offline을 선택한다.
3. 다른 페이지 버튼을 눌러 오류 화면이 나올 때까지 기다린다.
4. Online / No throttling으로 복원한다.
5. 다시 시도 버튼을 눌러 마지막 페이지 요청이 성공하는지 확인한다.

**[캡처 10: 오류·다시 시도 버튼과 복구 후 정상 화면 추가]**

선택 미션 중 page의 URL search param 관리와 API→별도 UI 타입 adapter는 구현하지 않았다.

# 🎯 핵심 키워드

- API / endpoint: 프로그램 간 데이터를 주고받는 약속과 요청 경로다. 인기 영화는 GET /movie/popular로 요청한다.
- HTTP method / status: 이번 조회에는 GET을 사용했다. 200은 성공, 401은 인증 실패, 404는 대상 리소스를 찾지 못한 응답이다.
- Promise: 요청 결과가 아직 정해지지 않은 pending에서 성공 시 fulfilled, 실패 시 rejected가 된다.
- then/catch/finally: 성공 데이터 저장, 실패 문구 처리, 로딩 종료에 각각 연결했다.
- async/await: 같은 Promise 흐름을 순서대로 읽도록 작성하는 문법이다. await는 현재 async 함수의 다음 실행을 미루며 브라우저 전체를 멈추지 않는다.
- fetch와 HTTP 오류: HTTP 오류도 Response를 받기 때문에 response.ok 검사로 직접 처리했다.
- ky: fetch 기반으로 공통 URL/header, searchParams, json<T>() 등 반복 설정을 줄인다. Axios는 일반적으로 response.data와 interceptors를 사용하지만 이번 프로젝트에는 추가하지 않았다.
- UI 상태: 대기·실패·빈 응답·성공을 구분해 사용자가 현재 상황을 이해할 수 있게 한다.
- API 타입과 UI 타입: 현재는 TMDB 응답 타입을 UI에 직접 적용했다. 서버 필드와 화면 모델을 독립시키고 싶다면 이후 adapter를 둘 수 있다.
- CORS: 브라우저가 다른 Origin의 응답을 JS에 제공해도 되는지 서버 응답 header를 확인하는 방식이다. 프런트에서 서버의 허용 정책을 임의로 만들 수는 없다. [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

# 📢 학습 후기

이번 주차에는 하드코딩한 영화 배열을 실제 서버 데이터로 교체했다. 단순히 요청 함수를 만드는 것뿐 아니라 응답이 오기 전, 실패했을 때, 정상 응답에 결과가 없을 때를 각각 화면으로 표현하도록 구성했다.

순수 fetch에서는 URL·인증 header·HTTP 오류·JSON 변환을 직접 다룬 뒤, ky로 반복되는 설정을 모았다. 기존 북마크와 UI 설정은 클라이언트 상태로 유지하고 TMDB 응답과 섞지 않았다. 요청 결과를 화면에 연결할 때는 타입뿐 아니라 실제 Network 응답을 확인하고, 이전 요청의 cleanup도 고려해야 한다는 점을 정리했다.

※ 학습 후기는 본인이 직접 실행하며 느낀 점을 덧붙여 수정한다.

# ⚡ 트러블 슈팅

## 1. 기존 App.tsx의 남은 import 때문에 타입 검사 실패

- 이슈: 이전 컴포넌트와 로컬 Movie 타입을 참조하는 코드가 남아 빌드 검사에 영향을 주었다.
- 문제: 실제 진입점은 Router인데, 사용하지 않는 옛 App.tsx도 src의 타입 검사에 포함되었다.
- 해결: 현재 MovieListPage를 재사용하는 호환 export로 정리하고 로컬 데이터 참조를 제거했다.
- 결과: TypeScript와 build 통과.

## 2. 페이지 버튼의 기존 스타일이 표시되지 않음

- 이슈: Pagination이 기존 CSS 클래스에 의존하지만 실제 Router 진입점에서 해당 스타일이 로드되지 않았다.
- 문제: 이전 App.css가 현재 main.tsx 경로에서 사용되지 않았다.
- 해결: 필요한 기존 pagination 스타일을 index.css에 반영했다.
- 결과: 페이지 버튼의 기존 스타일을 유지했다.

## 3. effect의 불필요한 동기 상태 변경과 이전 응답 덮어쓰기 예방

- 고려 사항: effect 시작 직후 상태 변경을 반복하면 Hooks lint와 불필요한 렌더링 문제가 생길 수 있다. 늦은 이전 응답도 현재 화면을 덮어쓸 수 있다.
- 적용: 결과 컴포넌트 key로 초기 상태를 분리하고, Promise 결과에서 상태를 갱신하며 AbortController cleanup을 사용했다.
- 검증: lint 통과, 테스트 응답에서 빠른 검색어 변경 시 현재 결과 유지 확인.
- 이 항목은 예방 설계이며 이번 작업에서 동일 lint 오류가 실제 발생했다고 기록하지 않는다.

# 캡처 순서와 제출 전 체크

| 순서 | 화면/동작 | 노션에 넣을 위치 |
| --- | --- | --- |
| 1 | 순수 fetch 실행 후 Network | 필수 미션 2 |
| 2 | 인기 영화 목록 | 필수 미션 4 |
| 3 | 페이지 2 / page=2 | 필수 미션 4 |
| 4 | 스파이더맨 검색과 URL | 필수 미션 5 |
| 5 | 빈 검색 결과 | 필수 미션 5 |
| 6 | 영화 상세와 URL | 필수 미션 6 |
| 7 | 잘못된 영화 ID | 필수 미션 6 |
| 8 | 하단 TMDB 출처 | 필수 미션 8 |
| 9 | 정상 Console / lint·build | 필수 미션 9 |
| 10 | 요청 실패 → 다시 시도 → 성공 | 선택 미션 |

- [x] 목록·검색·상세 TMDB 연결 구현
- [x] 실제 TMDB 요청과 URL 새로고침 검증
- [x] 로딩·오류·빈 결과·성공 처리 구현
- [x] 북마크·카드 크기 설정 유지
- [x] TMDB 출처 표시
- [x] 다시 시도 구현
- [ ] 본인의 캡처 첨부
- [ ] 순수 fetch의 Network 증빙 첨부
- [ ] 본인 학습 후기·스터디 인증샷 추가

Network 캡처는 Query/Response를 중심으로 촬영하고 Authorization 토큰이 보이면 가린다. 실제 .env 파일은 제출하지 않는다.
