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

`/signup`은 중복 확인과 회원가입, `/login`은 로그인 API를 연결한 화면입니다. `VITE_API_BASE_URL`로 회원 서버 주소를 지정하며, 생략하면 기존 백엔드 주소를 사용합니다.

8주차에는 `(authenticated)/_auth` Route Group과 공통 레이아웃으로 `/my`(마이페이지), `/me`(내 정보), `/edit-profile`(닉네임 수정)을 묶었습니다. 로그인하지 않으면 로그인 화면으로 이동합니다. 토큰은 Zustand persist로 저장하며, 회원 정보·즐겨찾기·평점은 TanStack Query로 관리합니다.

영화 목록·검색·상세의 북마크 버튼은 서버 즐겨찾기에 연결되어 있습니다. 상세 화면 하단에서 평점을 등록·수정·삭제할 수 있고, 처음 등록할 때 '즐겨찾기에도 함께 저장'을 선택하면 영화 기록 API로 두 데이터를 함께 저장합니다. 마이페이지에서 내 즐겨찾기와 평점을 확인할 수 있습니다.

`.env.local`은 Git에서 제외됩니다. `VITE_` 값은 브라우저 빌드에 포함됩니다.
