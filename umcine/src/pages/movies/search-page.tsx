import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState, type SubmitEvent } from 'react';
import { searchMovies } from '../../api/movies/search-movies';
import type { TmdbMovieListItem } from '../../api/movies/models';

export function SearchPage() {
  const { query } = useSearch({ from: '/search' });
  const navigate = useNavigate({ from: '/search' });

  const [searchText, setSearchText] = useState(query ?? '');
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setSearchText(query ?? '');
  }, [query]);

  useEffect(() => {
    let ignore = false;
    const normalizedQuery = (query ?? '').trim();

    setMovies([]);
    setErrorMessage(null);

    if (!normalizedQuery) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) {
          setMovies(response.results);
        }
      })
      .catch(() => {
        if (!ignore) {
          setErrorMessage('검색 결과를 불러오지 못했어요.');
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  const normalizedQuery = (query ?? '').trim();

  return (
    <main>
      <h1>영화 검색</h1>

      <form onSubmit={handleSubmit}>
        <input
          aria-label='검색어'
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <button type='submit'>검색</button>
      </form>

      {!normalizedQuery ? (
        <p>검색어를 입력해 주세요.</p>
      ) : isLoading ? (
        <p>검색 결과를 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p role='alert'>{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p>검색 결과가 없어요.</p>
      ) : (
        <>
          <h2>‘{query}’ 검색 결과</h2>
          <p>영화 {movies.length}편</p>

          <ul>
            {movies.map((movie) => (
              <li key={movie.id}>
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={`${movie.title} 포스터`}
                  />
                )}

                <h3>{movie.title}</h3>
                <p>{movie.original_title}</p>
                <p>{movie.release_date}</p>
                <p>{movie.overview}</p>

                <Link
                  to='/movies/$movieId'
                  params={{ movieId: String(movie.id) }}
                >
                  상세 보기
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
