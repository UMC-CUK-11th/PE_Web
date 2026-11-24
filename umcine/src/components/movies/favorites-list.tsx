import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useFavorites } from "../../hooks/use-favorites";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "./bookmark-button";

export function FavoritesList() {
  const query = useFavorites();
  const [page, setPage] = useState(1);
  if (query.isLoading) return <p role="status">즐겨찾기를 불러오는 중이에요.</p>;
  if (query.isError) return <div role="alert"><p>즐겨찾기를 불러오지 못했어요.</p>
    <button type="button" onClick={() => query.refetch()}>다시 시도</button></div>;
  if (!query.data?.length) return <p>아직 즐겨찾기한 영화가 없어요.</p>;
  const totalPages = Math.ceil(query.data.length / 6);
  const currentPage = Math.min(page, totalPages);
  const favorites = query.data.slice((currentPage - 1) * 6, currentPage * 6);
  return <>
    <div className="profile-movie-grid">{favorites.map((favorite) =>
      <FavoriteCard key={favorite.favoriteId} movieId={favorite.movieId} />)}</div>
    <nav className="profile-pagination" aria-label="즐겨찾기 페이지">
      <button type="button" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} aria-label="이전 페이지">‹</button>
      <span aria-live="polite">{currentPage} / {totalPages}</span>
      <button type="button" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)} aria-label="다음 페이지">›</button>
    </nav>
  </>;
}

function FavoriteCard({ movieId }: { movieId: number }) {
  const movie = useQuery({ queryKey: ["movies", "detail", movieId], queryFn: () => getMovieDetail(movieId) });
  const poster = movie.data ? getTmdbPosterUrl(movie.data.poster_path) : null;
  return <article className="profile-movie-card">
    <div className="relative">
      <Link href={`/movies/${movieId}`}>
        {poster ? <img src={poster} alt={`${movie.data?.title} 포스터`} />
          : <div className="flex min-h-48 items-center justify-center bg-gray-100">{movie.isLoading ? "불러오는 중" : "이미지 없음"}</div>}
      </Link>
      <BookmarkButton movieId={movieId} />
    </div>
    <Link href={`/movies/${movieId}`}>
      <h3>{movie.data?.title ?? `영화 ${movieId}`}</h3>
    </Link>
    <p>{movie.data?.release_date ?? (movie.isError ? "영화 정보를 불러오지 못했어요." : "")}</p>
  </article>;
}
