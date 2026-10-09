import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex w-full min-w-0 flex-col gap-1 overflow-visible">
      <div className="relative h-[274px] w-full shrink-0 overflow-hidden rounded-[10px] bg-[#f6f7f9] max-[900px]:aspect-[241.6/274] max-[900px]:h-auto max-[600px]:rounded-lg">
        <Link
          className="block h-full w-full"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <img
            className="block h-full w-full rounded-[inherit] object-cover object-center"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>

        <BookmarkButton movieId={movie.id} />
      </div>

      <div className="flex w-full min-w-0 flex-col">
        <Link
          className="group text-inherit no-underline"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <h2 className="m-0 w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-5 font-semibold text-[#17191e] group-hover:underline group-focus-visible:underline max-[600px]:text-[13px] max-[600px]:leading-[18px]">
            {movie.title}
          </h2>
        </Link>
        <p className="m-0 w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-4 font-normal text-[#9ca3af] max-[600px]:text-[11px] max-[600px]:leading-[15px]">
          {movie.releaseDate}
        </p>
      </div>
    </article>
  );
}
