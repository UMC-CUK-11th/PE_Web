# UMCine 프론트엔드

TMDB 영화 목록·검색·상세와 백엔드의 닉네임·이메일 중복 확인, 회원별 평점 조회 화면입니다.

## 실행

`FE` 폴더의 `.env.example`을 `.env.local`로 복사하고 TMDB API Read Access Token을 설정합니다. 백엔드 기본 주소는 `http://localhost:8080`입니다.

```bash
pnpm install
pnpm dev
```

환경 변수 변경 후 개발 서버를 다시 시작합니다. 백엔드 CORS 설정에 맞춰 `http://localhost:5173`으로 접속합니다.

## 확인

```bash
pnpm build
pnpm lint
```

`/`는 영화 목록, `/search`는 영화 검색, `/movies/{movieId}`는 상세, `/members`는 백엔드의 세 API를 호출하는 화면입니다.

`.env.local`은 Git에서 제외됩니다. `VITE_` 값은 브라우저 빌드에 포함됩니다.
