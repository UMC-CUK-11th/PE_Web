import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  isBookmarked: boolean;
  onBookmarkToggle: (movieId: number) => void;
}

export function MovieCard({ movie, isBookmarked, onBookmarkToggle }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-card__poster-wrap">
        <img className="movie-card__poster" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        <button
          className={`bookmark-button${isBookmarked ? " bookmark-button--active" : ""}`}
          type="button"
          aria-label={`${movie.title} ${isBookmarked ? "북마크 해제" : "북마크 추가"}`}
          aria-pressed={isBookmarked}
          onClick={() => onBookmarkToggle(movie.id)}
        >
          <img src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} alt="" />
        </button>
      </div>
      <h2 className="movie-card__title">{movie.title}</h2>
      <time className="movie-card__date" dateTime={movie.releaseDate.replaceAll(".", "-")}>
        {movie.releaseDate}
      </time>
    </article>
  );
}
