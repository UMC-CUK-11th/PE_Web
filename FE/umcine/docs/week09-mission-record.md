# 9주차 필수 미션 기록

기존 UMCine의 화면과 URL을 Next.js 16.4.6 App Router로 옮겼다. 영화 목록·검색·상세, 회원가입·로그인, 내 정보 조회·수정, 즐겨찾기와 평점 흐름을 브라우저에서 확인했다.

| 핵심 코드 | 바뀐 점 |
| --- | --- |
| `src/app/layout.tsx`, `src/app/providers.tsx` | 서버 루트 레이아웃과 메타데이터, 클라이언트 Query Provider |
| `src/app/page.tsx`, `src/app/search/page.tsx` | 서버에서 `searchParams`를 읽고 목록·검색 화면에 전달 |
| `src/app/movies/[movieId]/page.tsx` | App Router의 동적 `params`, 영화 상세 메타데이터 |
| `src/app/(authenticated)/layout.tsx`, `src/components/auth/authenticated-layout.tsx` | 보호 화면 공통 레이아웃과 저장소 복원 후 로그인 확인 |
| `src/screens/movies/search-page.tsx` | 검색어 URL 인코딩, 페이지 이동과 뒤로 가기 |
| `src/stores/auth-store.ts`, `src/query-client.ts` | 브라우저에서 토큰 복원, 로그아웃·계정 변경 시 개인 캐시 삭제 |
| `src/components/movie-card.tsx`, `next.config.ts` | `next/image`와 TMDB 이미지 허용 목록 |
| `tests/e2e/week09.spec.ts` | 직접 접속·새로고침·검색·페이지네이션·이전 주소 복원 확인 |

GitHub 푸시 뒤 위 경로들을 실제 코드 링크로 바꿔 첨부한다.

## 본문 예제

별도 `FE/nextjs-example`을 공식 CLI로 생성했다. `/`의 페이지는 Server Component이고 버튼의 이벤트와 alert는 Client Component에서 실행한다. `/new`는 정적 페이지이며, `/1`과 `/2`는 동적 ID로 공개 Todo API를 서버에서 조회한다. `/media`는 같은 JPEG 파일의 원본 요청과 `next/image` 요청을 비교하며 Geist를 적용한다. `/new`에는 title, description과 Open Graph 정보를 설정했다.

## 최종 확인 및 첨부 자료

- `desktop-01-list.png`, `desktop-02-search.png`, `desktop-03-detail.png` — 목록의 페이지 번호, 검색 조건, 동적 상세 결과.
- `desktop-08-login-success-live-h2.png`, `desktop-09-profile-updated-live-h2.png`, `desktop-10-rating-updated-live-h2.png`, `desktop-11-mypage-live-h2.png` — Spring Boot/H2와 연결한 로그인, 내 정보 수정, 평점과 즐겨찾기 화면.
- `example-02-static.png`, `example-03-todo-1.png`, `example-03-todo-2.png` — 정적 페이지와 요청마다 ID가 달라지는 실제 Todo 결과.
- `example-build-routes.png`, `umcine-build-routes.png` — 실제 빌드 로그의 경로 표. `○`는 정적 생성, `◐`는 정적 셸과 요청 시 서버 콘텐츠를 결합한 부분 사전 렌더링.
- `example-04-image-font.png`, `image-measurement.json` — 실제 원본 JPEG 90,094바이트, 최적화 WebP 6,136바이트, Geist 적용 확인.

회원·즐겨찾기·평점 성공 흐름은 임시 Spring Boot/H2와 연동했다. UMCine 영화 API는 고정 TMDB 응답으로 검증했고, 실패 상황은 테스트에서 모의 처리했다. 별도 예제의 Todo는 공개 API 실제 응답이다.

## 트러블슈팅

- **이슈** — 동적 영화 상세의 빌드 중 `Next.js encountered URL data usePathname() in a Client Component outside of <Suspense>.`가 발생했다.
- **원인** — Cache Components로 정적 셸을 준비하는 동안 헤더가 요청 URL을 읽었다.
- **해결** — 루트 레이아웃에서 헤더를 `Suspense`로 감싸고 같은 높이의 대체 UI를 두었다. 재빌드 후 상세 경로가 `◐`로 표시됐다.
- **배운 점** — Client Component가 들어간 페이지도 서버에서 초기 HTML을 준비한다. 요청에 의존하는 부분에는 렌더링 경계를 마련하고, `localStorage`는 브라우저의 effect에서 복원해야 한다.
- **참고** — [Next.js Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)

## 핵심 키워드와 학습 후기 초안

- Next.js는 라우팅과 함께 서버 렌더링, 메타데이터, 이미지·폰트 기능을 제공한다. 검색 엔진 노출이 중요한 서비스에 유용하고, 단순한 내부 SPA라면 Vite 구성이 운영 요구에 더 잘 맞을 수 있다.
- 기본은 Server Component로 두고 상태·이벤트·브라우저 저장소가 필요한 부분을 Client Component로 분리한다. 페이지 전체에도 `use client`를 붙일 수 있지만, 해당 파일에서 서버 전용 메타데이터를 내보낼 수 없고 클라이언트 경계도 커진다.
- SSG는 빌드 때 미리 생성하고, SSR은 요청 때 서버에서 HTML을 준비한다. ISR은 정적 페이지를 배포 후에도 갱신하는 방식이다. ISSG는 이 점진적 정적 생성 개념을 부르던 표현이며, 이번 예제는 경로별 SSG와 부분 사전 렌더링을 확인했다.
- 학습 후기 초안 — UMCine를 App Router로 옮기면서 URL과 화면 동작을 유지하고, 빌드 결과와 브라우저 테스트로 서버와 클라이언트의 역할을 확인했다.

## 테스트 결과와 실행 환경

- UMCine와 예제 앱의 ESLint 및 Next.js 프로덕션 빌드 통과.
- Playwright Chromium 데스크톱 22개 및 모바일 에뮬레이션 22개, 총 44개 통과. 이 중 4개는 실제 Spring Boot/H2를 사용한 회원가입 및 전체 회원 흐름 테스트다.
- 백엔드 작업 트리에는 이번 시작 시점부터 Favorite 소스 일부가 빠져 있었다. 검증에는 현재 백엔드를 복사하고 week08 임시 저장에 있던 Favorite 클래스들을 검증 전용 복사본에 복원해 구동했다. 로컬의 일반 운영 설정과 MySQL은 그대로다.
- UMCine를 로컬에서 실행할 때는 `FE/umcine/.env.example`을 참고해 `NEXT_PUBLIC_*` 값을 채운다. 회원 기능에는 즐겨찾기 API가 포함된 백엔드가 필요하다.
- Notion 필수 미션 토글에 핵심 코드 링크와 최종 결과를 기록한다. 대표 이미지로 목록·검색·상세, 로그인 후 마이페이지, 빌드 경로 표를 첨부한다. 예제의 Todo와 이미지 비교 화면은 본문 학습 기록에 첨부할 수 있다. 스터디 인증 사진은 스터디에서 촬영한 사진을 추가하고, 완성한 Notion URL을 UMC에 제출한다.
