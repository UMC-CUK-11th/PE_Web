import type { Metadata } from "next";
import { Suspense } from "react";
import { MovieDetailPage } from "../../../screens/movies/movie-detail-page";

export const metadata: Metadata = { title: "영화 상세", description: "영화 정보와 내 평점을 확인해요." };
export default function Page({ params }: PageProps<"/movies/[movieId]">) {
  return <Suspense fallback={<p role="status">영화 정보를 불러오는 중이에요.</p>}><Movie params={params} /></Suspense>;
}
async function Movie({ params }: Pick<PageProps<"/movies/[movieId]">, "params">) {
  return <MovieDetailPage movieId={(await params).movieId} />;
}
