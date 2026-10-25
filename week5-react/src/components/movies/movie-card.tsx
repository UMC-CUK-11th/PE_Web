import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

interface MovieCardProps {
  movie: TmdbMovieListItem & { isBookmarked: boolean };
  onToggleBookmark: (id: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <article className="min-w-0">
      <div className="relative aspect-[0.78] overflow-hidden rounded-[10px] bg-[#e5e7eb]">
        {posterUrl ? (
          <img
            className="block h-full w-full object-cover"
            src={posterUrl}
            alt={`${movie.title} 포스터`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[13px] text-[#969ba3]">
            이미지 없음
          </div>
        )}

        <button
          className={`absolute top-2 right-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border p-[5px] ${
            movie.isBookmarked
              ? "border-[#2878f0] bg-[#2878f0]"
              : "border-white bg-[#191919]"
          }`}
          type="button"
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={`${movie.title} 북마크`}
        >
          <img
            className="block h-4 w-4 brightness-0 invert"
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <h2 className="mt-[10px] mb-1 text-[14px] leading-[1.3] font-bold">
        {movie.title}
      </h2>

      <p className="m-0 text-[12px] text-[#969ba3]">
        {movie.release_date || "개봉일 정보 없음"}
      </p>
    </article>
  );
}

export default MovieCard;
