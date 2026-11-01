# UMCine

TMDB API를 이용해 인기 영화 목록, 검색 결과와 상세 정보를 표시하는 React 프로젝트입니다.

## 실행 준비

1. `.env.example`을 복사해 `.env`를 만듭니다.
2. TMDB 계정의 API Read Access Token을 입력합니다.

```env
VITE_TMDB_ACCESS_TOKEN=YOUR_TMDB_API_READ_ACCESS_TOKEN
```

`.env`는 Git에 포함되지 않습니다. 환경변수를 바꾼 뒤에는 개발 서버를 다시 실행해야 합니다.

```bash
pnpm install
pnpm dev
```

## API 확인

- 인기 영화: `/movie/popular?language=ko-KR&page=1`
- 영화 검색: `/search/movie?language=ko-KR&query=...&page=1`
- 영화 상세: `/movie/{movieId}?language=ko-KR`
- 순수 `fetch` 예제: `src/api/tmdb-fetch.ts`
- 실제 화면용 ky 인스턴스: `src/api/tmdb-client.ts`

브라우저 Network 패널에서 `popular`, `movie?`, 영화 ID 요청을 선택하면 요청 URL, `Authorization` 헤더 사용 여부와 JSON 응답을 확인할 수 있습니다. 토큰 전체 값은 캡처하거나 공유하지 마세요.

## 검증

```bash
pnpm lint
pnpm build
```
