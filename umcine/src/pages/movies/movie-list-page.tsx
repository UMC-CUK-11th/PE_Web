import { useState, useEffect } from 'react';
import { MovieGrid } from '../../components/movies/movie-grid';
import { Pagination } from '../../components/movies/pagination';
import { useBookmarks } from '../../data/movies';
import { getMovies } from '../../api/movies/get-movies';
import type { TmdbMovieListItem } from '../../api/movies/models';
import type { Movie } from '../../types/movie';

const FALLBACK_IMAGE = '/umcine-images/images/movies/placeholder.jpg';

export function MovieListPage() {
  const { bookmarkedIds, toggleBookmark } = useBookmarks();

  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: currentPage });

        if (ignore) return;

        const convertedMovies: Movie[] = response.results.map(
          (movie: TmdbMovieListItem) => ({
            id: movie.id,
            title: movie.title,
            originalTitle: movie.original_title,
            releaseDate: movie.release_date,
            posterPath: movie.poster_path ?? FALLBACK_IMAGE,
            backdropPath: movie.backdrop_path ?? FALLBACK_IMAGE,
            genres: [],
            runtime: '',
            tagline: '',
            overview: movie.overview,
            isBookmarked: bookmarkedIds.has(movie.id),
          }),
        );

        setMovies(convertedMovies);
        setTotalPages(response.total_pages);
      } catch {
        if (!ignore) {
          setErrorMessage('영화 목록을 불러오지 못했어요.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, [currentPage]);

  return (
    <main className='mx-auto w-full max-w-[1200px] px-6 pb-16 pt-8'>
      <h2 className='mb-5 mt-0 text-[22px] font-bold text-gray-900'>
        영화 목록
      </h2>

      {isLoading ? (
        <p>영화 목록을 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p role='alert'>{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p>조건에 맞는 영화가 없어요.</p>
      ) : (
        <MovieGrid
          movies={movies}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={toggleBookmark}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
