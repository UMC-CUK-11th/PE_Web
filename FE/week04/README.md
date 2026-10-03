# UMCine 4주차

3주차 UMCine 프로젝트에 Zustand 전역 상태와 Web Storage 영속화를 적용한 프로젝트입니다.

## 구현 내용

- 영화 목록, 검색 결과와 상세 화면이 하나의 북마크 store를 공유합니다.
- 북마크 추가와 제거는 `toggleBookmark` action으로 처리합니다.
- Zustand `persist` middleware로 북마크 영화 ID만 `localStorage`에 저장합니다.
- 저장 key는 `umcine-bookmark-store`입니다.
- 새로고침하거나 브라우저를 다시 열어도 북마크 상태가 복원됩니다.

## 실행

```bash
pnpm install
pnpm dev
```

## 검사

```bash
pnpm build
pnpm lint
```
