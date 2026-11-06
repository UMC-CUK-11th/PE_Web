import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useState, useEffect, type SubmitEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchMovies } from '../../api/movies/search-movies';

export function SearchPage() {
  const { query } = useSearch({ from: '/search' });
  const navigate = useNavigate({ from: '/search' });

  const [searchText, setSearchText] = useState(query ?? '');

  // URL 쿼리가 바뀔 때 입력창 텍스트 동기화
  useEffect(() => {
    setSearchText(query ?? '');
  }, [query]);

  const normalizedQuery = query?.trim() ?? '';

  const searchQuery = useQuery({
    queryKey: ['movies', 'search', { query: normalizedQuery }],
    queryFn: () => searchMovies({ query: normalizedQuery }),
    enabled: normalizedQuery.length > 0,
  });

  const searchResults = searchQuery.data?.results ?? [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

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
      ) : searchQuery.isLoading ? (
        <p>검색 결과를 불러오는 중이에요.</p>
      ) : searchQuery.isError ? (
        <p role='alert'>검색 결과를 불러오지 못했어요.</p>
      ) : searchQuery.isSuccess && searchResults.length === 0 ? (
        <p>검색 결과가 없어요.</p>
      ) : (
        <>
          <h2>‘{query}’ 검색 결과</h2>
          <p>영화 {searchResults.length}편</p>

          <ul>
            {searchResults.map((movie) => (
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
