import { Link } from "@tanstack/react-router";
import { BookmarkButton } from "../bookmark-button";
import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard(props: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative w-full">
        {/* 포스터를 클릭하면 해당 영화의 상세 route로 이동한다. */}
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(props.movie.id) }}
        >
          <img
            className="block aspect-[2/3] w-full rounded-[7px] object-cover"
            src={props.movie.posterPath}
            alt={props.movie.title}
          />
        </Link>

        {/* <button
          // 공통 class와 북마크 상태에 따라 달라지는 class를 cn으로 조합한다.
          className={cn(
            "absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-[6px] border p-0",
            props.movie.isBookmarked
              ? "border-[#536be8] bg-[#536be8]"
              : "border-white bg-[rgba(20,20,20,0.8)]",
          )}
          onClick={() => props.onToggleBookmark(props.movie.id)}
          aria-label={
            props.movie.isBookmarked ? "북마크 해제" : "북마크 추가"
          }
        >
          <img
            className="h-5 w-5 invert"
            src={
              props.movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button> */}
        <BookmarkButton movieId={props.movie.id} />
      </div>

      <h2 className="mb-[4px] mt-[7px] overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-semibold text-[#222]">
        {props.movie.title}
      </h2>

      <p className="m-0 text-[11px] text-[#9a9ca2]">
        {props.movie.releaseDate}
      </p>
    </article>
  );
}
