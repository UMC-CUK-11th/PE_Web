import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrap">
        <img className="movie-poster" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        <button
          className="bookmark-button"
          type="button"
          aria-label={`${movie.title} 북마크`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img src={`/icons/${movie.isBookmarked ? "bookmark" : "bookmark-outline"}.svg`} alt="" />
        </button>
      </div>
      <h2>{movie.title}</h2>
      <time dateTime={movie.releaseDate.replaceAll(".", "-")}>{movie.releaseDate}</time>
    </article>
  );
}
