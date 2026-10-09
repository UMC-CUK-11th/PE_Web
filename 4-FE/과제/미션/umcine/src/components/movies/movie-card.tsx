import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <article>
      <div className="relative aspect-[240/274] overflow-hidden rounded-lg bg-slate-200">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          aria-label={`${movie.title} 상세 보기`}
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="h-full w-full object-cover"
          />
        </Link>
        <BookmarkButton movieId={movie.id} title={movie.title} overlay />
      </div>
      <h2 className="mt-3 mb-1.5 text-[15px] leading-snug font-bold wrap-anywhere">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h2>
      <time
        className="text-[13px] text-[#6a7081]"
        dateTime={movie.releaseDate.replaceAll(".", "-")}
      >
        {movie.releaseDate}
      </time>
    </article>
  );
}
