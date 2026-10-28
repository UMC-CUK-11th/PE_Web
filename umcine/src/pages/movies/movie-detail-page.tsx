import { Link, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getMovieDetail } from '../../api/movies/get-movie-detail';
import type { TmdbMovieDetail } from '../../api/movies/models';
import { useBookmarks } from '../../data/movies';
import { getMovieDetailErrorMessage } from '../../utils/movies/get-movie-detail-error-message';

export function MovieDetailPage() {
  const { movieId } = useParams({ from: '/movies/$movieId' });
  const parsedMovieId = Number(movieId);

  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadMovieDetail() {
      setMovie(null);
      setErrorMessage(null);

      if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
        setErrorMessage('올바르지 않은 영화 번호예요.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await getMovieDetail(parsedMovieId);

        if (!ignore) {
          setMovie(response);
        }
      } catch (error: unknown) {
        if (!ignore) {
          setErrorMessage(getMovieDetailErrorMessage(error));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMovieDetail();

    return () => {
      ignore = true;
    };
  }, [parsedMovieId]);

  if (isLoading) {
    return (
      <main className='min-h-[calc(100vh-72px)] w-full bg-gray-100 px-6 py-20 text-center'>
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (errorMessage || !movie) {
    return (
      <main className='min-h-[calc(100vh-72px)] w-full bg-gray-100'>
        <div className='px-6 py-20 text-center sm:px-20'>
          <h2 className='mb-4 text-xl font-bold text-gray-900'>
            {errorMessage ?? '영화 정보를 불러오지 못했어요.'}
          </h2>
          <Link
            to='/'
            className='text-sm text-blue-600 no-underline hover:underline'
          >
            영화 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const bookmarked = isBookmarked(movie.id);

  const runtimeText =
    typeof movie.runtime === 'number'
      ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
      : '상영 시간 정보가 없어요.';

  return (
    <main className='min-h-[calc(100vh-72px)] w-full bg-gray-100'>
      {/* 영화 배경 영역 */}
      <section className='relative h-[360px] overflow-hidden text-white'>
        {movie.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
            alt=''
            className='h-full w-full object-cover'
          />
        )}

        <div className='absolute inset-0 bg-gradient-to-b from-black/20 to-black/75' />

        <div className='absolute inset-0 flex flex-col justify-between px-6 py-6 sm:px-16 sm:pb-12'>
          <Link
            to='/'
            className='w-fit text-sm text-white no-underline hover:text-gray-300'
          >
            ← 영화 목록
          </Link>

          <div className='max-w-[650px]'>
            <h1 className='m-0 text-[32px] font-bold sm:text-[42px]'>
              {movie.title}
            </h1>

            <p className='my-2 text-sm'>{movie.original_title}</p>

            <p className='m-0 text-sm leading-7'>
              {movie.release_date}
              <span> · </span>
              {movie.genres.map((genre) => genre.name).join(', ')}
              <span> · </span>
              {runtimeText}
            </p>
          </div>
        </div>
      </section>

      {/* 영화 상세 콘텐츠 */}
      <section className='grid grid-cols-1 gap-6 bg-gray-50 px-6 py-6 min-[481px]:grid-cols-[120px_minmax(0,1fr)] min-[901px]:grid-cols-[160px_minmax(0,1fr)_280px] min-[901px]:px-16'>
        {/* 포스터 */}
        <div className='flex justify-center min-[481px]:block'>
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} 포스터`}
              className='block w-[160px] rounded-lg min-[481px]:w-[120px] min-[901px]:w-[160px]'
            />
          )}
        </div>

        {/* 영화 소개 */}
        <div className='min-w-0 min-[481px]:pr-0 min-[901px]:pr-6'>
          <h2 className='mb-4 mt-0 text-[22px] font-bold text-gray-900'>
            {movie.tagline}
          </h2>

          <p className='leading-[1.8] text-gray-600'>{movie.overview}</p>

          <button
            type='button'
            className='flex items-center gap-2 rounded-md border-0 bg-blue-600 px-4 py-2.5 text-sm text-white transition-colors hover:bg-blue-700'
            onClick={() => toggleBookmark(movie.id)}
          >
            <img
              src={
                bookmarked
                  ? '/icons/movie-icons/bookmark.svg'
                  : '/icons/movie-icons/bookmark-outline.svg'
              }
              alt=''
              aria-hidden='true'
              className='h-4 w-4'
            />
            {bookmarked ? '즐겨찾기 해제' : '즐겨찾기'}
          </button>
        </div>

        {/* 별점 및 감상평 */}
        <div className='min-w-0 border-t border-gray-300 pt-6 min-[481px]:col-span-2 min-[901px]:col-span-1 min-[901px]:border-l min-[901px]:border-t-0 min-[901px]:pl-6 min-[901px]:pt-0'>
          <h2 className='m-0 text-lg font-bold text-gray-900'>내 평점</h2>

          <p className='text-xs text-gray-400'>
            별점을 눌러 점수를 남겨보세요.
          </p>

          <div className='my-3 flex gap-1'>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type='button'
                className={`h-[34px] w-[34px] rounded-md border text-lg transition-colors ${
                  star <= rating
                    ? 'border-amber-400 bg-amber-50 text-amber-500'
                    : 'border-gray-300 bg-white text-gray-400 hover:bg-gray-100'
                }`}
                onClick={() => setRating(star)}
                aria-label={`${star}점`}
                aria-pressed={rating === star}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            className='box-border h-20 w-full resize-none rounded-md border border-gray-300 bg-white p-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            placeholder='영화를 보고 느낀 점을 남겨보세요.'
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />

          <button
            type='button'
            className='mt-2 w-full rounded-md border-0 bg-zinc-900 p-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700'
            onClick={() => alert(`내 평점: ${rating}점\n감상평: ${comment}`)}
          >
            평점 저장
          </button>
        </div>
      </section>
    </main>
  );
}
