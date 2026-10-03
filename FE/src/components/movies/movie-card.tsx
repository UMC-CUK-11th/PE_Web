import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import BookmarkButton from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="overflow-hidden rounded-[10px] bg-white shadow-sm ring-1 ring-slate-200">
      <div className="relative">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="group block focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-blue-600">
          <img className="aspect-[2/3] w-full object-cover motion-safe:transition-opacity group-hover:opacity-90" src={movie.posterPath} alt={`${movie.title} 포스터`} loading="lazy" />
        </Link>
        {/* 링크와 버튼을 따로 두어 북마크를 눌러도 상세 화면으로 이동하지 않아요. */}
        <BookmarkButton movieId={movie.id} movieTitle={movie.title} />
      </div>
      <div className="p-4">
        <h2 className="text-base leading-6 font-bold break-keep">
          <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="rounded hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600">{movie.title}</Link>
        </h2>
        <p className="mt-2 text-sm text-slate-500">{movie.releaseDate}</p>
      </div>
    </article>
  );
}
