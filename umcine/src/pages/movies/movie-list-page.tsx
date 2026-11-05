import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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

  const moviesQuery = useQuery({
    queryKey: ['movies', 'list', { page: currentPage }],
    queryFn: () => getMovies({ page: currentPage }),
  });

  const rawMovies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 1;

  const movies: Movie[] = rawMovies.map((movie: TmdbMovieListItem) => ({
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
  }));

  const handlePageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  return (
    <main className='mx-auto w-full max-w-[1200px] px-6 pb-16 pt-8'>
      <h2 className='mb-5 mt-0 text-[22px] font-bold text-gray-900'>
        영화 목록
      </h2>

      {moviesQuery.isPending ? (
        <p>영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p role='alert'>영화 목록을 불러오지 못했어요.</p>
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
        onPageChange={handlePageChange}
      />
    </main>
  );
}
