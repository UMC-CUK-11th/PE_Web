import type { Movie } from "../types/movie";

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
      <div className="poster-wrapper">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="movie-poster"
        />

        <div className="poster-overlay" />

        <button
          type="button"
          className={`bookmark-button ${
            movie.isBookmarked ? "bookmarked" : ""
          }`}
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={
            movie.isBookmarked ? "북마크 해제" : "북마크 추가"
          }
          aria-pressed={movie.isBookmarked}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
            className="bookmark-icon"
          />
        </button>
      </div>

      <div className="movie-info">
        <h2 className="movie-title">{movie.title}</h2>

        <p className="movie-original-title">
          {movie.originalTitle}
        </p>

        <div className="movie-meta">
          <span>{movie.releaseDate}</span>
          <span>{movie.runtime}</span>
        </div>

        <div className="genre-list">
          {movie.genres.map((genre) => (
            <span key={genre} className="genre">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}