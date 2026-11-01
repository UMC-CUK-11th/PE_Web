# UMCine 5주차

TMDB API를 사용해 영화 목록, 검색, 상세 정보를 표시하는 5주차 프론트엔드 프로젝트입니다.

## 구현 내용

- 브라우저 `fetch`로 인기 영화 요청을 확인하는 예제를 포함합니다.
- 공통 TMDB 주소와 인증 헤더를 ky 인스턴스에 설정합니다.
- 목록, 검색, 상세 화면에서 서버 데이터를 읽고 로딩·오류·빈 결과를 구분합니다.
- TMDB 포스터·배경 이미지 URL을 생성하고 이미지가 없으면 대체 영역을 표시합니다.
- 화면 하단에 TMDB 출처를 표기합니다.
- 영화 목록, 검색 결과와 상세 화면이 하나의 북마크 store를 공유합니다.
- 북마크 추가와 제거는 `toggleBookmark` action으로 처리합니다.
- Zustand `persist` middleware로 북마크 영화 ID만 `localStorage`에 저장합니다.
- 저장 key는 `umcine-bookmark-store`입니다.
- 새로고침하거나 브라우저를 다시 열어도 북마크 상태가 복원됩니다.

## 실행

프로젝트 루트에 `.env.local`을 만들고 TMDB API Read Access Token을 설정합니다. 이 파일은 Git에 포함하지 않습니다.

```text
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_ACCESS_TOKEN=발급받은_API_READ_ACCESS_TOKEN
```

```bash
pnpm install
pnpm dev
```

`fetch` 요청을 Network 패널에서 확인할 때만 `src/main.tsx`에 `import "./examples/fetch-movies";`를 임시로 추가하고, 확인 후 삭제합니다.

## 검사

```bash
pnpm build
pnpm lint
```
