import type { TmdbMovieListResponse } from "./models";

type GetMoviesWithFetchResponse = TmdbMovieListResponse;

const pendingRequests = new Map<number, Promise<GetMoviesWithFetchResponse>>();

function getMoviesWithFetch(page = 1): Promise<GetMoviesWithFetchResponse> {
  const pendingRequest = pendingRequests.get(page);
  if (pendingRequest) return pendingRequest;

  const request = (async () => {
    const searchParams = new URLSearchParams({
      page: String(page),
    });

    const response = await fetch(`/api/movies/popular?${searchParams}`);

    if (!response.ok) {
      throw new Error(`영화 목록 요청에 실패했어요: ${response.status}`);
    }

    return response.json() as Promise<GetMoviesWithFetchResponse>;
  })().finally(() => {
    pendingRequests.delete(page);
  });

  pendingRequests.set(page, request);
  return request;
}

export { getMoviesWithFetch, type GetMoviesWithFetchResponse };
