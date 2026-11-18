import type { TmdbMovieListItem } from "../../api/movies/models";
import { Link } from "@tanstack/react-router";
import { BookmarkButton } from "../bookmark-button";

interface MovieGridProps {
  movies: TmdbMovieListItem[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <ul className="mx-auto mt-6 grid grid-cols-[minmax(0,1fr)] min-[662px]:grid-cols-[repeat(2,241px)] min-[923px]:grid-cols-[repeat(3,241px)] min-[1184px]:grid-cols-[repeat(4,241px)] min-[1445px]:grid-cols-[repeat(5,241px)] justify-center justify-items-center gap-x-5 gap-y-[18px] p-0 list-none">
      {movies.map((movie) => (
        <li key={movie.id} className="relative">
          {/* 포스터 + 북마크 */}
          <div className="relative">
            {/* 포스터 이미지 */}
            <Link
              to="/movies/$movieId"
              params={{ movieId: String(movie.id) }}
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : undefined
                }
                alt={movie.original_title}
                className="w-[241px] h-[274px] rounded-[10px] object-cover"
              />
            </Link>
            {/* 북마크 버튼 */}
            <BookmarkButton movieId={movie.id} variant="grid" />
          </div>

          <div className="flex flex-col m-0 text-start">
            <Link
              to="/movies/$movieId"
              params={{ movieId: String(movie.id) }}
              className="no-underline pt-[5px] h-[27px] text-[14px] font-extrabold text-[#17191E]"
            >
              {movie.title}
            </Link>

            <p className="h-[14px] text-xs text-[#969DA8]">
              {movie.release_date}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
