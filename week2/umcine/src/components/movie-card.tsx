import type { Movie } from "../types/movie";

type MovieCardProps = {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
};

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img src={movie.posterPath} alt={movie.title} className="poster-img" />
        <button
          className={`bookmark-btn ${movie.isBookmarked ? "active" : ""}`}
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          aria-pressed={movie.isBookmarked}
          type="button"
        >
          <img
            src={movie.isBookmarked
              ? "/icons/movie-icons/bookmark.svg"
              : "/icons/movie-icons/bookmark-outline.svg"}
            alt=""
          />
        </button>
      </div>
      <div className="movie-info">
        <h2 className="movie-title">{movie.title}</h2>
        <p className="movie-date">{movie.releaseDate}</p>
      </div>
    </article>
  );
}
