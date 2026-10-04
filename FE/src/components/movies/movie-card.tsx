import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({
  movie,
}: MovieCardProps) {
  return (
    <article className="relative">
      <div className="relative">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <img
            className="block w-full rounded-[8px]"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>

        <BookmarkButton movieId={movie.id} />
      </div>

      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="text-inherit no-underline"
      >
        <h2 className="mb-1 mt-[10px] text-[16px] text-[#111]">
          {movie.title}
        </h2>
      </Link>

      <p className="m-0 text-[#888]">{movie.releaseDate}</p>
    </article>
  );
}
