import type { Metadata } from "next";
import { MovieListPage } from "@/features/movies/movie-list-page";

export const metadata: Metadata = { title: "영화 목록" };

export default function Page() {
  return <MovieListPage />;
}
