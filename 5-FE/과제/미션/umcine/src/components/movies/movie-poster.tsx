import { cn } from "../../utils/cn";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

interface MoviePosterProps {
  posterPath: string | null;
  title: string;
  className?: string;
}

export function MoviePoster({ posterPath, title, className }: MoviePosterProps) {
  const posterUrl = getTmdbPosterUrl(posterPath);
  if (!posterUrl) {
    return (
      <div
        role="img"
        aria-label={`${title} 포스터 없음`}
        className={cn(
          "flex items-center justify-center bg-slate-300 text-sm text-slate-600",
          className,
        )}
      >
        이미지 없음
      </div>
    );
  }
  return (
    <img
      src={posterUrl}
      alt={`${title} 포스터`}
      className={cn("object-cover", className)}
    />
  );
}
