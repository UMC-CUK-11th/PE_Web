import { Link } from "react-router-dom";
import type { Movie } from "../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative aspect-[7/8] overflow-hidden rounded-[10px] bg-[#e9ebee]">
        <Link className="block size-full" to={`/movies/${movie.id}`} aria-label={`${movie.title} 상세 보기`}>
          <img className="block size-full object-cover object-[center_28%]" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        </Link>
        <BookmarkButton className="absolute right-2.5 top-2.5" movieId={movie.id} movieTitle={movie.title} />
      </div>
      <h2 className="mt-2 mb-[3px] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold leading-[1.35] tracking-[-0.35px] text-[#202124]">
        <Link className="text-inherit no-underline" to={`/movies/${movie.id}`}>{movie.title}</Link>
      </h2>
      <time className="block text-xs leading-[1.35] text-[#9ba1aa]" dateTime={movie.releaseDate.replaceAll(".", "-")}>
        {movie.releaseDate}
      </time>
    </article>
  );
}
