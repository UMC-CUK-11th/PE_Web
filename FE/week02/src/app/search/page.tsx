import { SearchPage } from "../../features/search-page";

interface MovieSearchPageProps {
  searchParams: Promise<{ query?: string | string[]; page?: string | string[] }>;
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePage(value: string | string[] | undefined) {
  const page = Number(first(value));
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function MovieSearchPage({ searchParams }: MovieSearchPageProps) {
  const { query, page } = await searchParams;
  return <SearchPage query={first(query)?.trim() ?? ""} currentPage={parsePage(page)} />;
}
