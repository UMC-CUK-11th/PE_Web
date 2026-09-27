import type { Movie } from "../types/movie";
import "./movie-card.css";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-poster-wrapper">
        <img
          className="movie-poster"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />

        <button
          className={`bookmark-button ${
            movie.isBookmarked ? "bookmarked" : ""
          }`}
          type="button"
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="bookmark-icon"
            src={
              movie.isBookmarked
                ? "/movie-icons/bookmark.svg"
                : "/movie-icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <div className="movie-info">
        <h2 className="movie-title">{movie.title}</h2>
        <p className="movie-release-date">{movie.releaseDate}</p>
      </div>
    </article>
  );
}