// 이 파일은 영화 한 편의 포스터·제목·개봉일을 카드로 표시한다.
// 영화 배열을 반복하는 MovieGrid와 분리해 카드 모양과 링크를 재사용한다.
import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="overflow-hidden rounded-lg bg-[#1f2128]">
      <div className="relative aspect-[2/3] w-full">
        {/* URL 파라미터는 문자열이므로 숫자 ID를 변환해 전달한다. */}
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="block h-full w-full object-cover"
          />
        </Link>

        {/* 버튼은 같은 영화 ID를 사용해 카드와 상세 화면의 상태를 공유한다. */}
        <BookmarkButton
          movieId={movie.id}
          movieTitle={movie.title}
          className="absolute right-2 top-2"
        />
      </div>

      <div className="p-3">
        <h3 className="mb-1 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-bold">
          <Link
            to="/movies/$movieId"
            params={{ movieId: String(movie.id) }}
          >
            {movie.title}
          </Link>
        </h3>
        <p className="text-[13px] text-gray-400">
          개봉일: {movie.releaseDate}
        </p>
      </div>
    </article>
  );
}
