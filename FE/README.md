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

`/signup`은 중복 확인과 회원가입 API를 연결한 화면입니다. `VITE_API_BASE_URL`로 회원 서버 주소를 지정하며, 생략하면 기존 백엔드 주소를 사용합니다. `/login`은 로그인 화면, `/me`는 내 정보 조회·수정 화면입니다. 7주차 범위에 따라 로그인과 내 정보는 화면과 입력 상태만 구현했으며 서버 연결은 다음 주차에 진행합니다.

`.env.local`은 Git에서 제외됩니다. `VITE_` 값은 브라우저 빌드에 포함됩니다.
