import type { Metadata } from "next";
import { SearchPage } from "../../screens/movies/search-page";

export const metadata: Metadata = { title: "영화 검색" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string | string[] }>;
}) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query : "";
  return <SearchPage query={query} />;
}
