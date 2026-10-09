// 이 파일은 /movies/영화ID 주소를 상세 화면에 연결하는 라우트 설정이다.
// 실제 영화 조회와 화면 렌더링은 pages/movies/movie-detail-page.tsx에서 처리한다.
import { createFileRoute } from "@tanstack/react-router";
import { MovieDetailPage } from "../pages/movies/movie-detail-page";

export const Route = createFileRoute("/movies/$movieId")({
  component: MovieDetailPage,
});
