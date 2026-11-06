# 6주차 제출 준비

이 파일은 노션에 옮길 기록 초안과 제출 체크리스트입니다. 화면 검증 항목은 직접 확인한 뒤 체크하고, 학습 후기는 본인의 경험에 맞게 수정하세요.

## 제출 체크리스트

- [ ] 스터디 인증샷 첨부 (스터디 리더 대표 1장)
- [ ] 아래 핵심 키워드 정리를 읽고 자신의 말로 정리
- [ ] 필수 미션 토글에 구현 내용, 핵심 코드, 최종 확인 결과 기록
- [ ] 선택 미션 토글에 queryOptions 리팩터링 기록
- [ ] 학습 후기 작성
- [ ] 실제 문제가 있었다면 트러블 슈팅 기록
- [ ] 코드 GitHub 업로드 후 저장소 또는 PR 링크를 미션 기록에 첨부
- [ ] 아래 화면 확인을 수행하고 스크린샷 첨부
- [ ] 개인 노션 미션 페이지의 공유 권한을 확인하고 링크 복사
- [ ] 미션 기록이 포함된 **노션 페이지 URL**을 https://umc.ai.kr/ 에 제출

워크북에서 제출 대상으로 명시한 것은 노션 페이지 URL입니다. GitHub 링크만 제출하지 마세요. 스크린샷은 확인 결과를 전달하기 좋은 증빙입니다. CodeRabbit 피드백, 블로그 챌린지, Discord 지식in 활동, Suspense/ErrorBoundary 심화는 선택 활동입니다.

## 필수 미션 기록 초안

### 구현 내용

- `src/main.tsx`: QueryClientProvider로 앱을 감싸고 개발 환경에 ReactQueryDevtools 연결
- 공통 staleTime 60초, gcTime 5분 설정
- 목록, 검색, 상세의 useEffect 요청과 서버 응답용 useState를 useQuery로 교체
- 요청 실패 시 기존 다시 시도 버튼에서 refetch 호출
- 기존 UI, URL 페이지네이션, Zustand 북마크와 카드 크기 설정 유지
- 검색어 앞뒤 공백 제거, 빈 검색어 요청 차단
- 양의 정수가 아닌 영화 ID는 요청하지 않고 오류 안내
- 상세 조회 staleTime을 30초로 개별 설정

### 핵심 코드

`src/main.tsx`

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000, gcTime: 5 * 60 * 1000 },
  },
});
```

`src/api/movies/movie-query-options.ts`

```tsx
// 각 요청을 구분하는 query key
["movies", "list", { page }]
["movies", "search", { query: normalizedQuery, page }]
["movies", "detail", movieId]

// 검색 요청 조건
enabled: normalizedQuery.length > 0

// 상세 요청 조건과 개별 캐시 설정
enabled: Number.isInteger(movieId) && movieId > 0
staleTime: 30 * 1000
```

페이지에서는 `useQuery(movieListOptions(page))`, `useQuery(movieSearchOptions(normalizedQuery, page))`, `useQuery(movieDetailOptions(parsedMovieId))`로 연결했습니다. 목록·상세는 isPending, 조건부 검색은 isLoading을 사용하고, isError와 응답 결과로 오류·빈 결과·성공 화면을 구분합니다.

### 최종 확인 결과 — 확인 후 작성

자동 검사 완료: `npm run build` 통과 (TypeScript 검사 및 Vite 프로덕션 빌드), `npm run lint` 통과. 브라우저에서의 실제 TMDB 응답, 캐시 재사용 및 화면 캡처는 아직 확인하지 않았습니다.

개발 서버: `npm run dev`. 화면 이동은 앱 링크와 페이지 버튼으로 수행하세요. 새로고침하면 메모리 캐시가 초기화되므로 캐시 재사용 실험 중 새로고침하지 마세요.

1. **목록**: `/?page=1`에서 영화 카드 표시 확인. F12 → Network → Fetch/XHR에서 `movie/popular` 필터. 1 → 2 → 1페이지를 1분 안에 이동. 1페이지로 돌아올 때 새 목록 요청이 발생하지 않는지 확인.
2. **Query 도구**: 화면의 TanStack Query 버튼을 열고 목록 1·2페이지 키가 별도 캐시인지 확인. 키와 fresh 상태가 보이도록 캡처.
3. **검색**: `/search`에서 빈 상태 확인. 검색어를 공백만 넣고 제출했을 때 `search/movie` 요청이 없는지 확인. ‘스파이더맨’과 다른 검색어를 번갈아 검색하고 결과 및 별도 query key 확인. 검색 페이지를 바꾸면 page도 키에 포함되는지 확인.
4. **빈 결과**: 무작위 문자열을 검색해 ‘검색 결과가 없어요’ 표시 확인.
5. **상세**: 영화 카드를 눌러 상세 표시. Query 도구에서 해당 detail query가 30초 후 stale로 바뀌는지 확인. stale이 됐다는 이유만으로 즉시 요청이 발생하는 것은 아님.
6. **잘못된 ID**: `/movies/abc`, `/movies/0`, `/movies/-1`, `/movies/1.5`에서 잘못된 번호 안내와 요청 차단 확인. 유효한 양의 정수이지만 존재하지 않는 ID는 서버의 404 안내 확인.
7. **오류·재시도**: Chrome Network request blocking에서 `*api.themoviedb.org*` 차단 후 아직 조회하지 않은 목록 페이지로 이동. 재시도가 끝나면 오류 문구 확인. 차단 해제 후 ‘다시 시도’로 복구 확인. API 도메인을 별도로 설정했다면 그 도메인 사용. 단순 Offline 설정은 Query 요청이 paused가 되어 오류 검증과 다를 수 있음.
8. **로딩**: Network를 Slow 3G로 설정하고 아직 조회하지 않은 페이지·검색·상세에서 로딩 확인. 검증 후 제한 해제.
9. **회귀 확인**: 북마크 및 카드 크기 변경, 검색 페이지네이션, 상세의 별점 동작 확인.

기록 예시: `목록 1→2→1 재방문: [확인 결과], 검색어별 캐시: [확인 결과], 상세 30초 stale: [확인 결과]`. 실제 확인하지 않은 결과를 완료로 적지 마세요.

## 선택 미션 기록 초안

`src/api/movies/movie-query-options.ts`에 `movieListOptions`, `movieSearchOptions`, `movieDetailOptions`를 만들었습니다. queryOptions로 query key, query function, enabled와 상세 staleTime을 묶어 페이지의 설정 중복을 줄였습니다.

## 핵심 키워드 정리 참고

### 클라이언트 상태와 서버 상태

URL의 페이지 번호, 입력 중인 검색어, 제출 전 별점, 카드 크기는 클라이언트 상태입니다. TMDB에서 가져온 영화 목록과 상세는 서버 상태입니다. TanStack Query는 서버 데이터의 요청 상태와 캐시를 관리하고, 입력값이나 UI 설정은 기존 React 상태와 Zustand로 관리합니다.

### query key와 요청 상태

목록·검색·상세에 같은 키를 쓰면 다른 형식의 응답이 같은 캐시를 공유해 잘못된 데이터가 표시될 수 있습니다. 목록은 page, 검색은 정규화한 query와 page, 상세는 movieId를 포함해야 요청별로 응답을 구분할 수 있습니다.

캐시가 없는 enabled:false query는 아직 조회가 성공하거나 실패하지 않았으므로 isPending이 true일 수 있습니다. 실제 요청 중은 아니므로 isFetching은 false이고, isLoading = isPending && isFetching도 false입니다. 따라서 검색어가 비어 있는 경우의 안내를 먼저 표시합니다.

### 캐시 수명과 재조회

staleTime은 마지막으로 데이터를 성공적으로 받아 갱신한 시점부터 최신으로 취급하는 시간입니다. 만료되면 stale이 되지만 캐시는 남습니다. 기본 조건에서 화면 재진입, 창 포커스 복귀, 네트워크 재연결 등의 계기로 재조회할 수 있습니다.

gcTime은 query를 사용하는 컴포넌트가 없어져 비활성 상태가 된 뒤 캐시를 제거하기까지의 시간입니다. 활성 상태에서는 5분이 지났다는 이유만으로 캐시가 삭제되지 않습니다.

공통값은 서비스 대부분의 데이터가 허용하는 최신성 기준으로 정하고, 개별값은 해당 데이터의 변경 빈도와 최신성 요구에 맞게 조절합니다. 이번 실습은 공통 60초, 상세 30초를 사용했습니다. 개별 설정이 공통 기본값보다 우선합니다.

공식 자료: [Query Options](https://tanstack.com/query/latest/docs/framework/react/guides/query-options), [Important Defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults), [Disabling Queries](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries)

## 학습 후기 작성 도움

아래 질문에 각 한 문장씩 답하면 짧은 후기가 됩니다.

- useEffect 방식과 비교해 줄어든 코드는 무엇인가?
- query key에 검색어와 페이지를 넣는 이유는 무엇인가?
- 캐시 실험에서 직접 확인한 요청 횟수 차이는 무엇인가?
- 아직 헷갈리는 점 또는 더 공부할 점은 무엇인가?

## 선택 활동

- CodeRabbit으로 GitHub 코드 피드백 받기 (제공된 자료에는 세부 설정 방법이 없어 별도 안내 확인)
- 블로그: TanStack Query 사용 이유, query key, staleTime/gcTime 중 한 주제를 자신의 말로 작성하고 워크북 노션 폼에 URL 제출 (자료 기준 주 1회, 상점 +3)
- Discord 지식in 질문 또는 답변 (자료 기준 각각 +1, 주차 최대 +2)
- Suspense와 ErrorBoundary 심화 학습
