import { SearchPage } from "../../screens/movies/search-page";

export default async function Page({ searchParams }: PageProps<"/search">) {
  const { query } = await searchParams;
  return <SearchPage query={typeof query === "string" ? query : ""} />;
}
