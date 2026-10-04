import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../pages/movies/movie-list-page";

// / 주소와 영화 목록 화면을 연결한다.
export const Route = createFileRoute("/")({
  component: MovieListPage,
});
