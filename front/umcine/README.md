# UMCine

영화 목록, 검색, 즐겨찾기와 평점을 제공하는 Next.js App Router 프로젝트입니다.

## 로컬 실행

1. Node.js 20.9 이상과 pnpm을 사용합니다.
2. `.env.example`을 참고해 `.env.local`에 `TMDB_ACCESS_TOKEN`을 설정합니다. 기존 Spring 백엔드 주소와 다르면 `NEXT_PUBLIC_API_BASE_URL`도 지정합니다.
3. Spring 백엔드를 시작한 뒤 다음 명령으로 프런트를 실행합니다.

```sh
pnpm install
pnpm dev
```

[http://localhost:5173](http://localhost:5173)에서 확인합니다. 이 포트는 기존 Spring CORS 설정에 맞춘 값입니다.

```sh
pnpm lint
pnpm build
pnpm start
```

영화 상세는 서버에서 TMDB를 조회합니다. 목록과 검색은 React Query로 같은 출처의 Next.js API를 호출합니다. TMDB 토큰은 서버 환경 변수로 관리합니다.
