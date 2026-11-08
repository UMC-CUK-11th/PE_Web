# 6주차 필수 미션 구현·검증 기록

## 워크북 기록 위치

다음 4개 Notion 페이지의 미션 기록 토글에 실제 핵심 코드·검증 결과·남은 확인 항목을 입력했다. 개인 학습 경험이나 이해도를 대신 만들어 적지 않았다.

- [5주차 FE](https://app.notion.com/p/c44234d8038b82fe804b01d02e5d79d4)
- [5주차 BE](https://app.notion.com/p/ba7234d8038b836d9026013e97cf379f)
- [6주차 FE](https://app.notion.com/p/d22234d8038b8384a3af010957bfb0de)
- [6주차 BE](https://app.notion.com/p/ffd234d8038b82318c39012f231c28b4)

로컬 구현 커밋: week05 `f85a6d0`, week06 `2067327`. GitHub 업로드는 보류 중이다.

## FE: TanStack Query

- QueryClientProvider와 개발 모드 ReactQueryDevtools를 연결했다.
- 목록·검색·상세의 서버 응답·로딩·오류를 useQuery로 관리한다. 입력창과 현재 페이지는 React 클라이언트 상태로 유지한다.
- query key: 목록 `["movies", "list", {page}]`, 검색 `["movies", "search", {query}]`, 상세 `["movies", "detail", movieId]`.
- 빈 검색어와 유효하지 않은 영화 ID는 enabled로 자동 요청을 막는다. 유효하지 않은 ID 안내를 pending 상태보다 먼저 표시한다.
- 전역 staleTime 60초·gcTime 5분, 상세 staleTime 30초. 페이지 버튼은 실제 page와 query key를 변경한다.
- `queryOptions` 리팩터링과 Suspense/ErrorBoundary 심화는 선택 범위라 진행하지 않았다.
- 순수 fetch 실습 파일은 보존하고, 6주차 앱의 중복 요청을 피하도록 main.tsx의 임시 실행은 제거했다. 5주차 당시 코드는 로컬 `week05` 커밋에 보존했다.

### FE 실제 검증

- `corepack.cmd pnpm@12.4.2 build`: TypeScript 검사·Vite 빌드 성공.
- `corepack.cmd pnpm@12.4.2 lint`: 종료 코드 0. URL 변경 시 검색 입력을 동기화하는 기존 Effect에서 `react(set-state-in-effect)` 경고 1개가 있으며, 린트 오류는 없다.
- `node scripts/verify-query-cache.mjs`: 앱의 실제 QueryClient와 API 함수를 Node/Vite SSR에서 불러와 실제 TMDB 1→2→1페이지 조회를 수행했다. API 함수 호출은 **2회**, 캐시는 **2개**, 돌아온 1페이지는 기존 캐시 객체를 재사용했다.
- `docs/evidence/week06/query-cache.json`에 기록했다. API 함수 호출 횟수는 브라우저 Network의 HTTP 횟수와 구분한다.
- 브라우저 Query 개발자 도구, Network, 직접 접근·새로고침 및 실제 30초 stale 전환은 미검증이다.

## BE: 회원가입·평점 쓰기

- POST /members: 요청 DTO 검증 → 중복 검사 → bcrypt 해시 → 저장 → 비밀번호 없는 DTO로 201 응답.
- 평점 POST/PATCH/DELETE 및 201/200/204 응답을 구현했다. 삭제 204는 본문이 비어 있다.
- 잘못된 입력은 400, 중복은 409, 타인 평점 수정·삭제는 403, 없는 회원·평점은 404로 처리한다.
- 전역 예외 처리에서 동일한 오류 JSON 구조를 사용한다. 소수점 별점이 정수로 조용히 변환되지 않도록 Jackson 설정도 적용했다.
- 평점 복합 UNIQUE를 유지하며, 비밀번호를 응답 DTO에서 제외한다. 기존 GET 응답 계약은 유지한다.
- 이메일·닉네임 오류 code 세분화 및 동시성 제약 재현 캡처는 선택 미션이라 미뤘다.

### BE 실제 검증

- `BE/movie`에서 `gradlew.bat build` 성공.
- H2 격리 DB + MockMvc 통합 테스트 **5개, 실패 0·오류 0·스킵 0**. bcrypt matches, 비밀번호 응답 제외, 검증/중복, 평점 수명주기·소유자·삭제, 없는 회원·잘못된 JSON, CORS를 검증했다. H2 결과는 실제 MySQL 결과와 구분한다.
- 실제 MySQL에 연결한 서버에서 `node scripts/verify-week06.mjs`: **23개 요청 확인 통과**. 실제 요청과 응답은 `docs/evidence/week06/api-responses.json`에 기록했다. 테스트 비밀번호는 기록에서 명시적으로 가렸다.
- 실제 MySQL의 신규 테스트 회원에서 해시 길이 60·bcrypt 접두사 및 rating 복합 UNIQUE 두 컬럼을 확인했다. 해시 원문과 DB 접속 정보는 출력하지 않았다. 결과: `docs/evidence/week06/mysql-invariants.json`.
- 테스트로 만든 평점은 DELETE로 삭제했다. 테스트 회원은 검증용 example.com 계정으로 남아 있다. 기존 시드와 사용자 데이터는 삭제하지 않았다.

## 실제 트러블슈팅 1건

- 이슈: 검색 화면을 useQuery로 전환한 뒤 `TS1128: Declaration or statement expected`, `TS1005: ';' expected`가 발생했다.
- 원인: 기존 useEffect의 cleanup과 중복 handleSubmit·검색 결과 선언 일부가 남아 구문 구조가 깨졌다.
- 해결: 남은 cleanup·중복 선언을 제거하고, 서버 응답과 상태는 searchQuery에서 읽도록 통일했다. 빌드를 다시 실행해 통과했다.
- 배운 점: useEffect 요청을 useQuery로 옮길 때는 요청 함수뿐 아니라 기존 서버 상태와 cleanup도 함께 정리해야 한다. 입력값 동기화 Effect는 계속 필요하므로 유지했다.

## 제출 전 남은 항목

- 브라우저 자동화가 현재 URL 검증 실패로 중단되어 실제 화면 캡처는 만들지 않았다.
- `http://127.0.0.1:5173/api-check.html`은 실제 로컬 서버 요청을 보내는 개발용 도구다. 여기에서 회원가입 성공·검증 실패·평점 등록/수정 및 기타 실패 응답의 URL·상태·JSON을 확인하고 캡처할 수 있다. 과거 결과를 성공 화면처럼 재생하는 도구가 아니다.
- FE Query Devtools/Network 캡처, BE 요청/응답 화면 캡처, GitHub 핵심 코드 링크와 최종 제출이 남아 있다.
- 사용자 요청으로 GitHub 업로드를 보류했다. 로컬 week05/06 구현을 원격 제출 완료로 표시하지 않는다.
- 과제 완성도: 5·6주차 필수 코드와 실행 가능한 검증 기록 준비. 브라우저 검증·캡처 및 제출은 미완료.
- 이해도: 아직 확인하지 않았다. 제출 후 기초부터 별도로 학습한다.

## 핵심 개념 요약

- Query key는 응답을 구분하는 이름이다. page·query·movieId가 다르면 별도 캐시를 사용해야 한다.
- staleTime은 데이터를 최신으로 취급하는 시간이고, gcTime은 관찰자가 없어진 캐시를 삭제하기까지의 대기 시간이다. stale이 되었다고 즉시 삭제되는 것은 아니다.
- @Valid는 Spring이 DTO의 Bean Validation 제약을 적용하도록 연결한다. record·if·stream은 Java 문법/API다.
- @Transactional은 서비스 저장 작업의 트랜잭션 경계를 정한다. 중복 검사와 DB UNIQUE는 각각 사용자 응답과 저장 무결성을 담당한다.
- bcrypt는 복호화하는 암호화가 아니라 비밀번호 검증용 단방향 해시다.
