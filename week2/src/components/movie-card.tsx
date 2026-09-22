import type { Movie } from '../types/movie'

interface MovieCardProps {
  movie: Movie
  isBookmarked: boolean
  onBookmarkToggle: (movieId: number) => void
}

const bookmarkIconPath = '/icons/movie-icons/movie-icons'

export function MovieCard({ movie, isBookmarked, onBookmarkToggle }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-card__poster-wrap">
        <img className="movie-card__poster" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        <button
          className={`movie-card__bookmark${isBookmarked ? ' movie-card__bookmark--active' : ''}`}
          type="button"
          aria-label={`${movie.title} ${isBookmarked ? '북마크 해제' : '북마크 추가'}`}
          aria-pressed={isBookmarked}
          onClick={() => onBookmarkToggle(movie.id)}
        >
          <img
            src={`${bookmarkIconPath}/${isBookmarked ? 'bookmark.svg' : 'bookmark-outline.svg'}`}
            alt=""
          />
        </button>
      </div>

      <div className="movie-card__content">
        <h2>{movie.title}</h2>
        <p className="movie-card__original-title">{movie.originalTitle}</p>
        <div className="movie-card__metadata">
          <span>{movie.releaseDate}</span>
          <span aria-hidden="true">·</span>
          <span>{movie.genres.join(' · ')}</span>
        </div>
      </div>
    </article>
  )
}
