import type { Metadata } from "next";
import { SearchPage } from "@/features/movies/search-page";

export const metadata: Metadata = { title: "영화 검색" };

export default async function Page({ searchParams }: {
  searchParams: Promise<{ query?: string | string[] }>;
}) {
  const { query } = await searchParams;
  return <SearchPage query={typeof query === "string" ? query : ""} />;
}
