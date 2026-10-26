# 5주차 미션 기록

## 필수 미션

기존에는 src/data/movies.ts의 배열을 가져와서 목록을 보여주고, filter와 find로 검색과 상세 정보를 찾았다. 이번에는 기존 화면을 유지하면서 TMDB에서 데이터를 받아오도록 변경했다.

먼저 Promise의 상태와 then/catch, async/await 예제를 작성했다. 출력 순서와 두 문법으로 같은 값을 받는 것을 확인했다. 실습 파일은 src/examples에 남겼고, 최종 앱의 main.tsx에는 임시 import를 넣지 않았다.

순수 fetch 요청은 get-movies-with-fetch.ts에 작성했다. Authorization header에 토큰을 넣고 language와 page를 query로 전달한다. fetch는 HTTP 오류에서도 응답을 반환하므로 response.ok를 확인해서 오류를 발생시켰다.

그다음 ky 인스턴스에 공통 baseUrl과 인증 header를 모았다. getMovies, searchMovies, getMovieDetail로 요청을 나누고 각각 목록, 검색, 상세 화면에 연결했다. 공통 API 타입은 models.ts에 작성했다.

로딩, 오류, 빈 결과와 성공 화면을 구분했다. 빈 검색어와 잘못된 영화 ID는 요청하지 않도록 했다. 이전 요청이 늦게 도착해서 새 화면을 덮어쓰지 않도록 useMovieRequest의 정리 함수에서 ignore를 설정했다. 이 정리 함수는 요청 자체를 취소하지는 않는다.

포스터와 배경 경로를 이미지 URL로 변환하고 경로가 없거나 이미지 로딩이 실패하면 같은 영역에 이미지 없음을 표시했다. 상영 시간이 null인 경우도 별도로 안내한다. 기존 TMDB 로고를 공통 footer에 넣고 출처 문구를 표시했다.

### 핵심 코드
- src/api/movies/get-movies-with-fetch.ts: 순수 fetch 요청 및 HTTP 오류 검사
- src/api/tmdb-client.ts: ky 공통 설정
- src/api/movies/models.ts: 목록·상세 응답 타입
- src/api/movies/get-movies.ts, search-movies.ts, get-movie-detail.ts: API 함수
- src/hooks/use-movie-request.ts: 요청 상태·이전 응답 무시·재시도
- src/pages/movies/: 실제 화면 연결
- src/routes/__root.tsx: TMDB 출처 표시

### 확인 결과
- pnpm build: 성공
- pnpm lint: 성공
- Promise 예제: 1 → 2 → 3 출력, 두 문법 모두 인셉션 출력 확인
- 브라우저: 토큰 누락 안내, 빈 검색어 안내, 잘못된 영화 ID 안내 확인
- 검색·잘못된 ID 상세 URL 직접 접근 및 새로고침: 확인
- 위 브라우저 확인 범위에서 Console error/warn: 없음
- node scripts/verify-api.mjs: 모의 응답 테스트 통과
  - fetch/ky 요청 주소·인증 header·검색어·페이지 query
  - fetch 401 실패 처리와 ky 상세 404 안내
  - adapter 변환, 이미지 경로 null, 상영 시간 null 및 분 변환, 페이지 유효성

실제 TMDB API로 인기 영화, 검색, 상세 요청의 성공 응답을 확인했다. 브라우저 Network에서 순수 fetch의 popular 요청과 영화 JSON 응답을 확인했고, 목록·검색·상세 화면에서도 실제 영화 데이터를 확인했다. 목록·검색·상세 URL 직접 접근 및 새로고침, 빈 검색 결과와 존재하지 않는 영화의 오류 안내를 확인했다. 로딩 UI와 TMDB 출처 표기도 구현되어 있다. 제공된 디자인 원본 파일은 전달되지 않아 프로젝트에 있던 TMDB 로고 자산을 사용했다.

## 선택 미션

1. 다시 시도 버튼
오류 화면에서 다시 시도를 누르면 현재 페이지·검색어·영화 ID로 요청을 다시 실행하도록 했다.

2. 페이지 번호를 URL로 관리
목록과 검색 페이지의 page search param을 TMDB 요청 query에 연결했다. 검색어가 바뀌면 1페이지로 이동하고 페이지 값은 양의 정수로 검증한다. TMDB의 페이지 제한에 맞춰 최대 500까지만 사용한다.

3. adapter 함수
toMovieCard에서 TMDB의 snake_case 응답을 기존 카드의 camelCase 형태로 변환한다. poster_path는 전체 이미지 URL로 바꾸며, 북마크 여부는 API 타입에 넣지 않고 기존 Zustand store에서 영화 ID로 계산한다.

선택 미션 코드: pagination.tsx, routes/index.tsx, routes/search.tsx, movie-adapter.ts, use-movie-request.ts.
실제 API로 목록과 검색 페이지 이동, 영화 상세 이동을 확인했다. 네트워크 오류 복구 후 재시도와 북마크 상태는 별도로 캡처하지 않았다.

## 실행과 남은 확인

1. FE/.env.local의 VITE_TMDB_ACCESS_TOKEN에 본인의 API Read Access Token을 입력한다. 파일은 Git에서 제외되어 있다.
2. FE에서 pnpm dev를 실행한다. 이미 실행 중이면 종료 후 재시작한다.
3. /practice.html에서 Promise 상태 → 문법 비교 → fetch 순서로 실행한다. fetch는 Network에서 /3/movie/popular, language=ko-KR, page=1, Status와 results를 확인한다.
4. 토큰을 잘못된 값으로 바꾸고 재시작해 401 오류를 확인한 다음 원래 값으로 복원하고 재시작한다.
5. /, /search?query=인셉션&page=1, 목록에서 선택한 /movies/영화ID를 직접 열고 새로고침한다.
6. Network 속도를 낮춰 로딩을 확인하고, 결과 없는 검색어·없는 영화 ID·이미지 없는 영화를 확인한다.
7. 네트워크 실패 후 복구해 다시 시도를 확인하고, 페이지 이동·뒤로가기·북마크·카드 크기 설정을 확인한다.
8. Network에 CORS 오류가 있다면 주소와 서버 응답 header를 확인한다. 브라우저 보안 설정으로 우회하지 않는다.
9. Network의 popular 요청과 응답, 목록·검색·상세, 빈 결과·오류·로딩 상태, TMDB 출처 표기의 캡처를 미션 제출물에 첨부한다. 정상 화면에서 Console 오류가 없는지 확인하고 `pnpm build` 결과 캡처도 첨부한다.

VITE_ 값은 브라우저에 포함되므로 .env.local로 분리해도 비밀로 숨겨지는 것은 아니다.
