# UMCine

영화 목록과 검색, 상세 화면, 로그인과 프로필을 제공하는 Next.js App Router 프로젝트.

```sh
pnpm install
pnpm dev
```

[http://localhost:5173](http://localhost:5173)에서 확인할 수 있습니다. Spring API의 기본 주소는 `http://localhost:8080`입니다.

로컬 환경 변수는 `.env.local`에 설정합니다.

- `NEXT_PUBLIC_API_BASE_URL`은 Spring API 주소입니다.
- `NEXT_PUBLIC_TMDB_API_BASE_URL`과 `NEXT_PUBLIC_TMDB_ACCESS_TOKEN`은 브라우저에서 사용하는 TMDB 설정입니다.
- 기존 `VITE_*` 환경 변수도 같은 이름의 `NEXT_PUBLIC_*` 값이 없으면 사용합니다.

`pnpm lint`로 코드를 검사하고, `pnpm build`와 `pnpm start`로 프로덕션 서버를 실행합니다.
