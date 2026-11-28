import { Suspense } from "react";
import { MovieListPage } from "../screens/movies/movie-list-page";
import { parsePage } from "../utils/movies/parse-page";

export default function Page({ searchParams }: PageProps<"/">) {
  return <Suspense fallback={<p role="status">영화 목록을 불러오는 중이에요.</p>}><MovieList searchParams={searchParams} /></Suspense>;
}
async function MovieList({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  return <MovieListPage page={parsePage((await searchParams).page)} />;
}
