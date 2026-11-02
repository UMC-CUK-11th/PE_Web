import { getMoviesWithFetch } from "../api/movies/get-movies-with-fetch";

getMoviesWithFetch(1)
  .then((response) => {
    console.info("TMDB 인기 영화 요청 성공", {
      page: response.page,
      count: response.results.length,
    });
    console.table(
      response.results.map(({ id, title }) => ({ id, title })),
    );
  })
  .catch((error: unknown) => {
    console.error(
      error instanceof Error ? error.message : "영화 목록 요청에 실패했어요.",
    );
  });
