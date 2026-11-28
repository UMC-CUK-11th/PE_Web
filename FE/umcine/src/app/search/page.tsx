import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "../../screens/movies/search-page";
import { parsePage } from "../../utils/movies/parse-page";

export const metadata: Metadata = { title: "영화 검색" };
export default function Page({ searchParams }: PageProps<"/search">) {
  return <Suspense fallback={<p role="status">검색을 준비 중이에요.</p>}><Search searchParams={searchParams} /></Suspense>;
}
async function Search({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const { query, page } = await searchParams;
  return <SearchPage query={typeof query === "string" ? query : ""} page={parsePage(page)} />;
}
