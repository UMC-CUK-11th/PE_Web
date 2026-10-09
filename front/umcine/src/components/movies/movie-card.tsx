import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative aspect-[0.88] overflow-hidden rounded-lg bg-[#dfe2e8]">
        <Link className="block h-full w-full" params={{ movieId: String(movie.id) }} to="/movies/$movieId">
          <img className="block h-full w-full object-cover" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        </Link>
        <BookmarkButton movie={movie} />
      </div>
      <Link className="block overflow-hidden text-inherit no-underline" params={{ movieId: String(movie.id) }} to="/movies/$movieId">
        <h2 className="mt-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-[11px] leading-[1.2] font-bold tracking-[-0.3px] text-[#222731]" title={movie.title}>{movie.title}</h2>
      </Link>
      <div className="mt-0.5 flex items-center gap-1 text-[9px] leading-[1.2] text-[#7b818c]">
        <time dateTime={movie.releaseDate.replaceAll(".", "-")}>{movie.releaseDate}</time>
      </div>
    </article>
  );
}
