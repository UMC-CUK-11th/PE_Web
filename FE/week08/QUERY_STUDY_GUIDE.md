# 6주차 TanStack Query: 코드가 이어지는 순서와 문법

이 문서는 6주차 워크북의 코드 블록 7개(설치 명령부터 `staleTime` 예시까지)를 실제 week06 프로젝트에 연결해서 읽는 설명이다. 워크북의 `{/* 기존 UI */}`는 실행할 코드가 아니라 **이미 만들어 둔 화면을 그 자리에 유지하라**는 표시다. 따라서 아래 설명은 실제 화면의 마크업을 유지한 구현을 기준으로 한다.

## 0. 전체 흐름부터 보기

```text
브라우저에서 /search?query=스파이더맨 열기
    ↓
TanStack Router가 SearchPage 선택
    ↓
SearchPage 안의 useQuery가 검색어를 확인
    ↓
searchMovies가 TMDB에 요청
    ↓
TanStack Query가 응답·로딩·오류·캐시를 관리
    ↓
SearchPage가 응답으로 영화 목록을 그림
```

**역할 구분:** Router는 URL에 맞는 *화면*을 고른다. `searchMovies` 같은 API 함수는 서버에 *요청*한다. TanStack Query는 요청의 *결과와 상태*를 관리한다. React 컴포넌트는 그 상태에 맞게 *화면을 그린다*.

서버가 원본을 관리하는 영화 목록·검색 결과·영화 상세 정보는 **서버 상태**다. 사용자가 선택한 페이지 번호나 아직 제출하지 않은 검색창의 글자는 **화면에서 관리하는 상태**다. **캐시**는 이미 받은 서버 응답을 잠시 기억해 두는 공간이다.

## 1. 패키지 설치 명령

```bash
pnpm add @tanstack/react-query
pnpm add -D @tanstack/react-query-devtools
```

**각주**

1. `pnpm`은 프로젝트의 패키지 관리자다. `add`는 패키지를 설치하고 `package.json`에 기록한다.
2. `@tanstack/react-query`는 `useQuery`, `QueryClient`, `QueryClientProvider`를 제공한다.
3. `-D`는 개발할 때 사용하는 도구로 기록한다는 옵션이다. Devtools는 요청과 캐시를 관찰하는 도구다.
4. 명령은 `package.json`이 있는 `C:\Users\PC23-11\umc_front\PE_Web\FE\week06`에서 실행한다. 현재 이 프로젝트에는 두 패키지가 이미 설치되어 있다.

## 2. 모든 화면에서 Query를 쓰도록 연결하기: `src/main.tsx`

실제 파일: [src/main.tsx](src/main.tsx)

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // [1]
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // [2]

const ONE_MINUTE = 60 * 1000; // [3]
const queryClient = new QueryClient({ // [4]
  defaultOptions: { queries: { staleTime: ONE_MINUTE } },
});

createRoot(document.getElementById("root")!).render( // [5]
  <StrictMode>
    <QueryClientProvider client={queryClient}> {/* [6] */}
      <RouterProvider router={router} /> {/* [7] */}
      <ReactQueryDevtools initialIsOpen={false} /> {/* [8] */}
    </QueryClientProvider>
  </StrictMode>,
);
```

**각주**

1. `import { A, B } from "패키지"`는 그 패키지가 내보낸 `A`, `B`를 이 파일에서 쓰겠다는 뜻이다. `QueryClient`는 요청 결과를 관리할 객체를 만드는 **클래스**, `QueryClientProvider`는 그 객체를 안쪽 화면에 전달하는 **React 컴포넌트**다.
2. Devtools는 브라우저 화면에 열고 닫을 수 있는 TanStack Query 패널을 붙인다. 브라우저 F12의 **Network 탭과는 다른 도구**다.
3. 시간 단위는 밀리초다. `1000`밀리초가 1초이므로 `60 * 1000`은 1분이다. `const`는 값을 담는 변수를 선언한다.
4. `new QueryClient(...)`에서 `new`는 클래스로 객체 하나를 만든다는 문법이다. `{ defaultOptions: ... }`는 설정값을 담은 객체다. 안쪽의 `queries`는 모든 조회에 적용되는 기본 설정이다.
5. `document.getElementById("root")`는 `index.html`의 `<div id="root"></div>`를 찾는다. 뒤의 `!`는 TypeScript에 “이 값은 여기서 존재한다”고 알려 준다. `render(...)`는 그 요소 안에 React 화면을 표시한다.
6. `client={queryClient}`에서 왼쪽 `client`는 컴포넌트가 받는 **속성 이름(prop)**, 오른쪽 `queryClient`는 우리가 만든 **변수**다. 여는 태그와 닫는 태그 사이의 모든 화면이 이 QueryClient를 사용할 수 있다.
7. `RouterProvider`는 기존 URL 라우팅을 그대로 담당한다. Provider 안에 있으므로 Router가 보여 주는 목록·검색·상세 화면도 `useQuery`를 사용할 수 있다.
8. `initialIsOpen={false}`는 패널을 처음에는 접어 두라는 뜻이다. `{false}`는 문자열이 아닌 JavaScript의 불리언 값이다.

기존 코드의 `createRouter`, `routeTree`, `import "./index.css"`는 그대로 둔다. `routeTree`는 URL과 화면을 연결한 정보이고, `index.css`는 화면의 스타일을 적용한다. Query 연결은 이 기존 기능을 감싸서 추가한 것이다.

## 3. 조회의 공통 문법: `useQuery`

```tsx
const movieQuery = useQuery({
  queryKey: ["movies", "detail", movieId], // [1]
  queryFn: () => getMovieDetail(movieId),   // [2]
});
```

**각주**

1. `queryKey`는 캐시의 이름표다. 배열 `[...]`의 각 원소를 합쳐 데이터를 구별한다. `"movies"`, `"detail"`은 개발자가 정한 이름이며 API 주소가 아니다. `movieId`가 달라지면 다른 영화의 데이터로 구별된다.
2. `queryFn`은 데이터를 가져올 **함수**다. `() => getMovieDetail(movieId)`는 “필요할 때 이 요청을 실행해 줘”라는 뜻이다. `getMovieDetail(movieId)`만 적으면 함수를 넘기는 대신 지금 즉시 호출하게 되므로 다르다.
3. `useQuery(...)`가 돌려준 `movieQuery`는 영화 객체 자체가 아니다. `data`, `isPending`, `isLoading`, `isError`, `isSuccess`, `error` 등을 가진 **결과 객체**다.
4. `queryKey`가 바뀌면 Query는 새 이름표의 캐시를 확인하고 필요할 때 `queryFn`을 실행한다. 이미 받은 결과가 캐시에 있고 최신으로 취급되는 동안에는 재사용할 수 있다.

## 4. 목록: 페이지 번호는 남기고 요청 관리는 옮기기

실제 파일: [src/pages/movies/movie-list-page.tsx](src/pages/movies/movie-list-page.tsx)

```tsx
const [currentPage, setCurrentPage] = useState(1); // [1]

const moviesQuery = useQuery({
  queryKey: ["movies", "list", { page: currentPage }], // [2]
  queryFn: () => getMovies({ page: currentPage }),      // [3]
});

const movies = moviesQuery.data?.results ?? [];       // [4]
const totalPages = moviesQuery.data?.total_pages ?? 0; // [5]
```

**각주**

1. `useState(1)`은 첫 페이지 번호 `1`을 기억한다. `[현재값, 값을바꾸는함수]`는 `useState`가 돌려준 배열을 두 변수로 나누는 **배열 구조 분해**다. 사용자가 페이지 버튼을 누르면 `setCurrentPage(2)`처럼 호출한다.
2. `{ page: currentPage }`는 속성 `page`에 현재 페이지 값을 넣은 **객체**다. 페이지가 바뀌면 캐시 이름표도 바뀐다. 워크북은 이 변수를 `page`라고 부르지만 실제 프로젝트의 `currentPage`와 역할이 같다.
3. `getMovies`는 이미 있는 [src/api/movies/get-movies.ts](src/api/movies/get-movies.ts)의 함수다. TMDB 인기 영화 목록을 요청한다. `queryFn`이 호출될 때 현재 페이지를 넘긴다.
4. `data`는 API 응답 전체다. 그 안의 `results`가 영화 배열이다. `?.`는 `data`가 아직 없으면 속성을 읽지 않고 넘어가는 문법이다. `?? []`는 왼쪽 값이 없을 때 빈 배열을 쓰라는 뜻이다.
5. 같은 방식으로 응답의 `total_pages`를 읽는다. 아직 응답이 없으면 `0`을 쓴다.

**기존 코드와 연결:** 이전에는 `useEffect`가 요청을 실행하고 `setMovies`, `setTotalPages`, `setIsLoading`, `setErrorMessage`를 각각 호출했다. 이제 그 요청 결과와 상태를 `moviesQuery`에서 읽는다. `<MovieGrid movies={movies} />`와 `<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />`는 기존 UI 그대로다. `onPageChange`는 Pagination에 전달하는 함수다. 버튼을 누르면 Pagination이 이 함수를 호출해 페이지 번호를 바꾼다. 워크북의 `handlePageChange`는 이 함수를 한 번 감싼 형태라 현재 코드에는 필요하지 않다.

**상태 분기 읽는 순서:** `isPending`이면 로딩 문구, 그렇지 않고 `isError`이면 오류 문구, 그렇지 않고 `movies.length === 0`이면 빈 결과 문구, 나머지는 영화 카드와 페이지 버튼을 보여 준다. JSX의 `조건 ? A : B`는 조건이 참이면 `A`, 거짓이면 `B`를 표시하는 **삼항 연산자**다. 여러 개를 이어 썼기 때문에 위에서 아래로 읽으면 된다. `movies.length`는 배열에 들어 있는 영화 개수다.

## 5. 검색: 입력창과 URL 검색어를 구별하기

실제 파일: [src/pages/movies/search-page.tsx](src/pages/movies/search-page.tsx)

```tsx
const { query } = useSearch({ from: "/search" }); // [1]
const normalizedQuery = query?.trim() ?? "";       // [2]

const searchQuery = useQuery({
  queryKey: ["movies", "search", { query: normalizedQuery }], // [3]
  queryFn: () => searchMovies({ query: normalizedQuery }),     // [4]
  enabled: normalizedQuery.length > 0,                       // [5]
});

const movies = searchQuery.data?.results ?? []; // [6]
```

**각주**

1. `useSearch`는 TanStack **Router**가 제공하는 훅이다. `/search?query=스파이더맨`이라는 URL에서 `query` 값을 읽는다. `{ query }`는 반환 객체에서 `query` 속성을 꺼내는 **객체 구조 분해**다.
2. `trim()`은 글자 앞뒤의 공백을 지운다. `query?.trim()`은 URL 검색어가 있을 때만 실행한다. URL 검색어가 없으면 `?? ""`로 빈 문자열을 쓴다. 따라서 공백만 입력한 경우도 빈 검색어가 된다.
3. 검색어를 이름표에 포함해야 `스파이더맨` 결과와 `배트맨` 결과가 서로 섞이지 않는다.
4. `searchMovies`는 [src/api/movies/search-movies.ts](src/api/movies/search-movies.ts)의 기존 요청 함수다. 검색어를 서버에 전달한다.
5. `enabled`는 **자동 요청을 허용하는지** 정하는 불리언 값이다. 검색어 길이가 0보다 클 때만 `true`가 되어 요청한다. 빈 검색어 화면에서는 요청하지 않는다.
6. 응답에서 영화 배열을 꺼낸다. 아직 응답이 없다면 빈 배열을 쓴다.

실제 프로젝트는 `SearchPage`가 URL의 `query`를 읽고 `SearchContent`에 넘긴다. `<SearchContent key={query ?? ""} query={query} />`의 `key`가 바뀌면 입력창의 상태가 새 검색어에 맞게 시작된다. `SearchContent`의 `searchText`는 **입력창에 현재 적힌 글자**이고, `normalizedQuery`는 **URL에 확정되어 실제 검색 요청에 쓰이는 글자**다. 검색 버튼을 누르면 `navigate({ search: ... })`가 URL을 바꾼다. URL이 바뀌면 Query의 이름표도 바뀐다.

검색에서는 `!normalizedQuery`를 가장 먼저 검사해서 “검색어를 입력해 주세요”를 보여 준다. 그 다음 `searchQuery.isLoading`이면 로딩, `isError`이면 오류, 결과 배열이 비었으면 “검색 결과가 없어요”, 나머지는 기존 검색 결과 카드 UI를 보여 준다. `isPending`은 요청을 하지 않는 비활성 Query에서도 참일 수 있다. `isLoading`은 **데이터가 없고 실제 첫 요청 중**인 상태이므로 이 화면에 맞다.

## 6. 상세: 영화 번호가 맞을 때만 요청하기

실제 파일: [src/pages/movies/movie-detail-page.tsx](src/pages/movies/movie-detail-page.tsx)

```tsx
const { movieId } = useParams({ from: "/movies/$movieId" }); // [1]
const parsedMovieId = Number(movieId);                     // [2]
const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0; // [3]

const movieDetailQuery = useQuery({
  queryKey: ["movies", "detail", parsedMovieId], // [4]
  queryFn: () => getMovieDetail(parsedMovieId),   // [5]
  enabled: isValidMovieId,                        // [6]
  staleTime: 30 * 1000,                           // [7]
});
const movie = movieDetailQuery.data;              // [8]
```

**각주**

1. `/movies/$movieId`의 `$movieId`는 URL에서 바뀌는 자리다. `/movies/123`이면 `movieId`는 문자열 `"123"`이 된다. `useParams`는 TanStack Router 훅이다.
2. `Number(...)`는 문자열을 숫자로 바꾼다. `"abc"`는 유효한 숫자가 아니므로 `NaN`이 된다.
3. `Number.isInteger(...)`는 정수인지 검사한다. `&&`는 양쪽 조건이 모두 참이어야 참이다. 따라서 `1`, `123` 같은 양의 정수만 유효하다.
4. 영화 번호를 캐시 이름표에 넣어 영화별 상세 데이터를 구별한다.
5. `getMovieDetail`은 [src/api/movies/get-movie-detail.ts](src/api/movies/get-movie-detail.ts)의 기존 요청 함수다.
6. 번호가 잘못되었으면 요청을 실행하지 않는다. 화면에서는 유효하지 않은 번호 안내를 로딩 안내보다 먼저 확인한다.
7. 워크북 4장의 미니 실습을 실제 영화 상세 Query에 적용했다. 상세 데이터만 30초 동안 최신으로 취급한다. 목록·검색의 공통 기본값은 1분이다.
8. 성공한 응답은 `movieDetailQuery.data`에 있다. 아래 기존 상세 UI는 이 `movie`의 제목·포스터·장르 등을 읽는다. 로딩·오류 분기를 먼저 통과한 뒤 사용한다.

상세 요청이 실패하면 기존 `getMovieDetailErrorMessage(movieDetailQuery.error)`로 오류 문구를 만든다. 이 함수는 404일 때 “영화를 찾을 수 없어요”, 다른 오류일 때 “영화 정보를 불러오지 못했어요”를 돌려준다. 기존 포스터·배경 이미지·북마크 UI는 유지했다.

## 7. 캐시 시간: `staleTime`과 `gcTime`

```tsx
const ONE_MINUTE = 60 * 1000;
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: ONE_MINUTE } },
});
```

**각주**

1. `staleTime`은 받은 데이터를 **얼마 동안 최신으로 취급할지** 정한다. 현재 공통 기본값은 1분이다. 최신인 동안 같은 Query를 다시 열면 캐시를 재사용한다.
2. 시간이 지나 **stale(오래됨)**이 되어도 데이터가 즉시 삭제되거나 즉시 재요청되는 것은 아니다. 화면을 다시 열거나 브라우저 창에 다시 포커스를 주는 등의 상황에서 재조회할 수 있다.
3. `gcTime`은 해당 Query를 사용하는 화면이 없어져 **inactive**가 된 뒤, 캐시를 메모리에서 제거하기까지의 시간이다. 브라우저 기본값은 5분이다. `staleTime`과 `gcTime`은 서로 다른 설정이다.
4. 각 `useQuery` 안에서 `staleTime`을 적으면 공통 기본값 대신 그 Query의 값을 적용한다. 워크북의 `personDetailQuery`는 **문법 설명용 가상 예시**다. 이 프로젝트에는 `getPersonDetail` 함수가 없으므로 붙여 넣지 않는다. 같은 원리를 실제 영화 상세 Query의 `staleTime: 30 * 1000`에 적용했다.

## 8. 실제로 확인하는 순서

1. `C:\Users\PC23-11\umc_front\PE_Web\FE\week06`에서 `pnpm dev`를 실행한다. 터미널에 나온 로컬 주소를 연다. `.env.local`의 TMDB 토큰이 올바르게 설정되어 있어야 실데이터가 보인다.
2. `/`에서 영화 목록과 페이지 버튼을 확인한다. 오른쪽 아래 TanStack 아이콘을 누르면 `['movies', 'list', {page: 1}]`에 해당하는 Query가 보인다.
3. 1 → 2 → 1페이지로 이동한다. 브라우저 F12의 **Network → Fetch/XHR**에서 `movie/popular` 요청을 관찰한다. 1분 안에 1페이지로 돌아오면 새 요청 없이 캐시가 재사용되는지 확인한다.
4. `/search`에서는 안내 문구가 보이고 검색 API 요청은 없어야 한다. 검색어를 제출하면 `['movies', 'search', {query: ...}]` Query가 생긴다. 다른 검색어는 다른 Query다.
5. 영화 카드를 눌러 `/movies/번호` 상세를 연다. `['movies', 'detail', 번호]` Query를 확인한다. `/movies/abc`는 요청 없이 잘못된 번호 안내가 보여야 한다.
6. TanStack Query 패널은 **캐시와 상태**를 보여 주고, F12 Network 탭은 **실제 HTTP 요청**을 보여 준다. 둘을 함께 보면 캐시 재사용 여부를 확인할 수 있다.

## 9. 자주 헷갈리는 문법 한눈에 보기

| 문법 | 읽는 법 |
| --- | --- |
| `import { useQuery } from "@tanstack/react-query"` | 패키지가 내보낸 함수를 가져온다. |
| `const x = ...` | 값을 담는 변수를 선언한다. |
| `new QueryClient()` | 클래스에서 객체 하나를 만든다. |
| `() => getMovies({ page })` | 나중에 실행할 함수를 만든다. |
| `{ page: currentPage }` | `page`라는 속성에 `currentPage` 값을 넣은 객체다. |
| `const { query } = ...` | 반환된 객체에서 `query` 속성을 꺼낸다. |
| `const [page, setPage] = useState(1)` | 반환된 배열을 현재값과 변경 함수로 나눈다. |
| `data?.results` | `data`가 있을 때만 `results`를 읽는다. |
| `value ?? []` | `value`가 `null` 또는 `undefined`이면 빈 배열을 쓴다. |
| `a && b` | 두 조건이 모두 참이면 참이다. |
| `condition ? A : B` | 조건이 참이면 A, 거짓이면 B다. |
| `<Component prop={value} />` | 컴포넌트에 `prop`이라는 이름으로 JavaScript 값을 전달한다. |
| `movies.map((movie) => ...)` | 영화 배열을 하나씩 읽어 화면 요소로 바꾼다. |

**현재 확인 결과:** 목록·검색·상세 화면은 모두 `useQuery`를 사용한다. QueryClientProvider가 연결되어 있고, 목록·검색은 기본 `staleTime` 1분, 상세는 30초다. `pnpm build`와 `pnpm lint`가 통과했다. TMDB 실데이터와 브라우저 Network 화면은 개발 서버에서 직접 확인해야 한다.
