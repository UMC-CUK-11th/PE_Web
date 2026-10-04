import { Link } from '@tanstack/react-router';
import type { Movie } from '../../types/movie';

interface MovieCardProps {
  movie: Movie;
  isBookmarked: boolean;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({
  movie,
  isBookmarked,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className='min-w-0 overflow-hidden rounded-lg bg-white'>
      {/* 포스터 클릭 시 상세 페이지로 이동 */}
      <Link
        to='/movies/$movieId'
        params={{ movieId: String(movie.id) }}
        className='block overflow-hidden rounded-lg no-underline'
        aria-label={`${movie.title} 상세 페이지`}
      >
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className='aspect-[2/3] w-full rounded-lg object-cover transition-transform duration-200 hover:scale-[1.03]'
        />
      </Link>

      <div className='flex items-start justify-between gap-2 py-3'>
        {/* 제목 클릭 시에도 같은 상세 페이지로 이동 */}
        <div className='min-w-0'>
          <Link
            to='/movies/$movieId'
            params={{ movieId: String(movie.id) }}
            className='line-clamp-2 text-sm font-semibold text-gray-900 no-underline hover:text-blue-600'
          >
            {movie.title}
          </Link>

          <p className='mt-1 text-xs text-gray-500'>{movie.releaseDate}</p>
        </div>

        {/* 즐겨찾기 버튼 */}
        <button
          type='button'
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={isBookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          aria-pressed={isBookmarked}
          className='shrink-0 rounded-md p-1 transition-colors hover:bg-gray-100'
        >
          <img
            src={
              isBookmarked
                ? '/icons/movie-icons/bookmark.svg'
                : '/icons/movie-icons/bookmark-outline.svg'
            }
            alt=''
            aria-hidden='true'
            className='h-5 w-5'
          />
        </button>
      </div>
    </article>
  );
}
