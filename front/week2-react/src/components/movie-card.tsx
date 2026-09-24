import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  isBookmarked: boolean;
  onBookmarkToggle: (movieId: number) => void;
}

export function MovieCard({ movie, isBookmarked, onBookmarkToggle }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img className="poster-image" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        <button
          className={`bookmark-button${isBookmarked ? " is-bookmarked" : ""}`}
          type="button"
          aria-label={`${movie.title} ${isBookmarked ? "북마크 해제" : "북마크 추가"}`}
          aria-pressed={isBookmarked}
          onClick={() => onBookmarkToggle(movie.id)}
        >
          <img src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} alt="" />
        </button>
      </div>
      <h2 title={movie.title}>{movie.title}</h2>
      <div className="movie-meta">
        <time dateTime={movie.releaseDate.replaceAll(".", "-")}>{movie.releaseDate}</time>
      </div>
    </article>
  );
}
