import ky from "ky";
import type { TmdbMovieDetail } from "./models";

type GetMovieDetailResponse = TmdbMovieDetail;

function getMovieDetail(movieId: number) {
  return ky
    .get(`/api/movies/${movieId}`)
    .json<GetMovieDetailResponse>();
}

export { getMovieDetail, type GetMovieDetailResponse };
