import type { Metadata } from "next";
import { MovieDetailPage } from "../../../views/movies/movie-detail-page";

export const metadata: Metadata = { title: "영화 상세" };

export default function Page() {
  return <MovieDetailPage />;
}
