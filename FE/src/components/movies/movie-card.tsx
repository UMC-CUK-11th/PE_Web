import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps { movie: Movie; onToggleBookmark: (movieId: number) => void; }

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return <article className="overflow-hidden rounded-lg bg-[#1f2128]">
    <div className="relative aspect-[2/3] w-full">
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}><img src={movie.posterPath} alt={`${movie.title} 포스터`} className="block h-full w-full object-cover" /></Link>
      <button type="button" className={cn("absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border-0", movie.isBookmarked ? "bg-white" : "bg-black/60")} aria-label={movie.isBookmarked ? `${movie.title} 북마크 해제` : `${movie.title} 북마크 추가`} aria-pressed={movie.isBookmarked} onClick={() => onToggleBookmark(movie.id)}><img src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} alt="" className="h-[18px] w-[18px]" /></button>
    </div>
    <div className="p-3"><h3 className="mb-1 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-bold"><Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>{movie.title}</Link></h3><p className="text-[13px] text-gray-400">개봉일: {movie.releaseDate}</p></div>
  </article>;
}
