import { MovieListPage } from "../features/movie-list-page";

interface HomePageProps {
  searchParams: Promise<{ page?: string | string[] }>;
}

function parsePage(value: string | string[] | undefined) {
  const page = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page } = await searchParams;
  return <MovieListPage currentPage={parsePage(page)} />;
}
