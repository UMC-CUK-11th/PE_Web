// 이 파일은 / 주소를 MovieListPage에 연결하는 라우트 설정이다.
// 화면 내용은 pages/movies/movie-list-page.tsx에 두어 URL 정의와 분리한다.
import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../pages/movies/movie-list-page";

export const Route = createFileRoute("/")({
  component: MovieListPage,
});
