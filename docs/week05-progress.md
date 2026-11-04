# 5주차 필수 미션 진행 기록

## 2026-11-02: 순수 fetch로 인기 영화 요청

### 핵심 코드와 변경 이유

- `FE/umcine/src/config/env.ts`: `.env.local`의 API 주소와 토큰을 한 곳에서 읽고 누락을 검사한다.
- `FE/umcine/src/api/movies/models.ts`: TMDB 목록·상세 JSON의 TypeScript 타입을 선언한다. 타입 선언은 실제 JSON을 런타임에 검증하지 않는다.
- `FE/umcine/src/api/movies/get-movies-with-fetch.ts`: 인기 영화 요청에 인증 헤더와 `language`, `page`를 전달한다. `fetch`는 HTTP 오류에서도 응답을 반환하므로 `response.ok`가 거짓이면 오류를 던진다.
- `FE/umcine/src/examples/fetch-movies.ts`: 실습 결과의 페이지·개수·영화 제목을 Console에 표시한다. 토큰은 출력하지 않는다.
- `FE/umcine/src/main.tsx`: 개발 모드에서만 실습 파일을 임시 실행한다. 브라우저 Network 확인이 끝나면 임시 실행 코드를 제거한다.

### 실제 확인 결과

- 실제 요청: `GET https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1`.
- Vite SSR로 실제 요청 함수를 불러와 실행: 정상 토큰으로 HTTP **200**, `page: 1`, `results` **20개** 확인.
- 요청 시에만 잘못된 테스트 토큰을 주입: HTTP **401** 및 함수가 `영화 목록 요청에 실패했어요: 401` 오류를 던지는 것 확인. `.env.local`의 실제 토큰은 변경하지 않았다.
- `FE/umcine`에서 `npm.cmd run build` 성공: TypeScript 검사와 Vite 프로덕션 빌드 통과. 현재 셸에서 pnpm 명령을 찾지 못해 같은 build 스크립트를 npm으로 실행했다. `pnpm build` 실행 여부는 아직 미검증이다.
- Vite 개발 서버 기동 확인: `http://127.0.0.1:5173/`.
- `.env.local`은 기존 `*.local` 규칙으로 Git에서 제외된다.

### 실제 이슈와 해결

- 이슈: 자동 검증의 첫 Node 네트워크 요청이 `TypeError`, `EACCES`로 실패했다.
- 원인: 에이전트 실행 환경의 샌드박스 네트워크 제한.
- 해결: 같은 검증 명령에 네트워크 실행 승인을 받은 뒤 200·401 응답을 확인했다. 앱 요청 코드 수정은 필요하지 않았다.
- 배운 점: 실행 환경의 연결 실패와 API 서버가 돌려주는 HTTP 오류를 구분해야 한다.

### 남은 확인 및 제출 자료

- [ ] 브라우저 Network에서 요청 URL, `language=ko-KR`, `page=1`, 200 응답과 `results` 배열 확인.
- [ ] 브라우저 Console에서 성공 로그 및 영화 목록 확인.
- [ ] 브라우저에서 잘못된 토큰의 오류 확인 후 정상 토큰 복원·개발 서버 재시작.
- [ ] 본인이 직접 확인한 브라우저 결과를 캡처하고 Notion 미션 기록에 반영.
- [ ] Network 실습 확인 후 `main.tsx`의 임시 실행 제거.
- [ ] ky 인스턴스 및 목록·검색·상세 화면 연결, 상태별 UI, TMDB 출처 표기, 직접 접근·새로고침 확인.

브라우저 자동 연결 도구를 사용할 수 없어 브라우저 실행·CORS·Network·Console 상태는 아직 직접 검증하지 못했다. 제출용 캡처는 생성하지 않았다.

### 완성도와 이해도

- 과제 완성도: 환경변수 준비, 응답 타입, 순수 fetch 함수와 실제 서버 응답 검증 완료. 브라우저 실습 및 5주차 전체 필수 미션은 미완료.
- 이해도: 확인 전. 복습 질문: `fetch` 요청을 `try/catch`로 감싸더라도 왜 `response.ok` 검사가 필요한가?

## 2026-11-02: 5주차 필수 구현 및 API 검증

### FE 구현

- ky 2.0.0 공통 클라이언트와 목록·검색·상세 함수를 분리했다.
- 세 영화 화면은 실제 TMDB 응답을 useEffect에서 요청한다. 로딩·오류·빈 결과·성공을 구분하고, 이전 요청 결과가 새 상태를 덮지 않도록 cleanup에서 ignore를 설정한다.
- 빈 검색어는 요청하지 않는다. 잘못된 상세 ID는 요청 전에 안내하고, 존재하지 않는 영화의 404는 별도 문구로 처리한다.
- 포스터·배경 경로가 null이면 이미지 없음 영역을 표시한다. 상세 장르·상영 시간도 API 응답으로 표시한다.
- 북마크는 기존 Zustand persist store를 재사용한다. 로컬 영화 데이터 파일과 기존 도서 프로젝트는 보존했다.
- TMDB 로고·출처 문구를 Footer에 추가했다.
- `/members`의 실제 React 화면에서 자체 BE 조회 API 세 가지를 호출하도록 구현했다.

### BE 구현

- `BE/movie`를 별도로 생성했다. Spring Boot 3.5.0, Java 21, Gradle 8.14.3을 사용한다.
- Member/Rating 엔티티·Repository·DTO·Service·Controller와 전역 CORS 설정을 작성했다.
- MySQL `umc_movie`의 member/rating/favorite 스키마 및 시드(회원 2, 평점 3)를 준비했다. Favorite은 테이블만 생성했다.
- 닉네임/이메일 중복 확인은 `{available: boolean}`, 회원별 평점은 최신순 DTO 배열을 반환한다. 없는 회원은 404이다.
- API 명세와 ERD는 `docs/api-spec.md`에 작성했다.

### 실제 검증 증거

- FE: `corepack.cmd pnpm@12.4.2 build`로 TypeScript 검사와 Vite 빌드 통과.
- BE: `BE/movie`의 `gradlew.bat build` 성공. 이 시점은 테스트 소스가 없으므로 빌드 성공을 단위 테스트 통과라고 표현하지 않는다.
- `node scripts/verify-week05.mjs --cors-disabled`: 13개 확인 항목 통과. CORS 응답 헤더가 없는 실제 응답을 `docs/evidence/week05/cors-before-api.json`에 저장했다.
- 정상 CORS 설정으로 서버 재시작 후 `node scripts/verify-week05.mjs`: 15개 확인 항목 통과. 실제 조회 응답, 허용 origin, preflight, 비허용 origin 차단, TMDB 목록·검색·빈 검색 결과·상세·404 처리를 확인했다.
- 결과: `docs/evidence/week05/api-responses.json`. 실행 환경은 Node + Vite SSR이며 브라우저 실행 증거가 아니다.

### 미검증 및 제출 전 남은 작업

- 브라우저 자동화 도구가 현재 URL을 안전하게 확인할 수 없다는 이유로 조작을 중단했다. 이 턴에서는 다른 방식으로 브라우저 자동화를 우회하지 않는다.
- 브라우저 Network/Console, 직접 접근·새로고침, 실제 React에서 BE API 3개 호출 성공 및 CORS 전후 화면 캡처는 미검증이다.
- 캡처를 만들어내지 않았으며 해당 항목을 완료로 체크하지 않는다.
- 과제 완성도: 5주차 FE/BE 필수 코드와 서버 API 검증 완료, 브라우저 검증·캡처 및 최종 제출은 남아 있다.
- 이해도: 사용자가 기초부터 다시 학습하기로 하여 아직 설명 능력을 확인하지 않았다.
