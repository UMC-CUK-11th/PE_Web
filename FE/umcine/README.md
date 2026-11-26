# UMCine — Next.js App Router

Next.js App Router와 TypeScript로 영화 목록·검색·상세, 인증, 즐겨찾기와 평점을 제공합니다. 패키지 관리는 pnpm을 사용합니다.

```powershell
pnpm install --frozen-lockfile
```

`.env.example`을 참고해 로컬 `.env.local`의 서버 전용 `TMDB_ACCESS_TOKEN`을 입력하세요. 실제 환경 파일은 Git에서 제외됩니다. TMDB 토큰이 비어 있으면 영화 요청 화면에 설정 오류를 표시합니다. 환경 파일 변경 후 개발 서버를 재시작하세요.

```powershell
pnpm dev
pnpm lint
pnpm build
```

`http://localhost:5173`에서 영화 목록, `/search?query=스파이더맨`에서 검색, `/movies/550`에서 상세를 확인합니다. `/api-test`는 Spring Boot 영화 서버의 세 API를 직접 호출하는 확인 화면입니다. 백엔드 실행/DB 준비 방법은 [백엔드 프로젝트](../../BE/movie-spring)를 참고하세요. 백엔드 주소는 `NEXT_PUBLIC_BACKEND_API_BASE_URL`로 설정하며 기본값은 `http://localhost:3000`입니다.



App Router 진입점은 `src/app`, 상호작용 화면은 `src/screens`에 있습니다.
루트 레이아웃은 서버에서 렌더링하고, Query Provider와 인증 가드는 Client Component로 구성합니다.
로그인 정보는 브라우저 저장소 복원이 끝난 뒤 확인합니다.

`pnpm typecheck`로 TypeScript 검사를 실행할 수 있습니다.
production 서버는 `pnpm build` 후 `pnpm start`로 같은 5173 포트에서 실행합니다.

## Vercel 배포 준비

실제 배포 설정, 환경 변수의 적용 환경, 로컬 검증 결과와 배포 후 체크리스트는
[10주차 배포 준비 기록](../../WEEK10_FRONTEND_DEPLOYMENT_PREPARATION.md)에 정리했습니다.

브라우저의 영화 요청은 `/api/tmdb`를 거칩니다. TMDB 토큰은 이 Route Handler에서만 읽습니다.
Vercel의 `NEXT_PUBLIC_BACKEND_API_BASE_URL`에는 배포한 Spring Boot의 HTTPS 주소를 입력해야 합니다.
