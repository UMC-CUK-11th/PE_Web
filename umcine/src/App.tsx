import { useEffect, useState } from 'react';
import { Header } from './components/layout/header';
import { MovieGrid } from './components/movies/movie-grid';
import { Pagination } from './components/movies/pagination';
import { movies } from './data/movies';
import { readBookmarkIds, saveBookmarkIds } from './utils/bookmark-storage';
import './App.css';

const TOTAL_PAGES = 5;

function App() {
  // localStorage에 저장된 북마크를 처음 상태로 가져오기
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(
    () => new Set(readBookmarkIds()),
  );

  // 선택 미션: 1~5 페이지 버튼 중 활성 페이지 관리
  const [currentPage, setCurrentPage] = useState(1);

  // 북마크 상태가 바뀌면 localStorage에 저장
  useEffect(() => {
    saveBookmarkIds([...bookmarkedIds]);
  }, [bookmarkedIds]);

  const handleToggleBookmark = (movieId: number) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);

      if (next.has(movieId)) {
        next.delete(movieId);
      } else {
        next.add(movieId);
      }

      return next;
    });
  };

  return (
    <div className='app'>
      <Header />

      <main className='app__main'>
        <h2 className='app__title'>영화 목록</h2>

        <MovieGrid
          movies={movies}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={handleToggleBookmark}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={TOTAL_PAGES}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
}

export default App;
