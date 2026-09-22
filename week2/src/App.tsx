import { useState } from 'react'
import './App.css'
import { Header } from './components/header'
import { MovieGrid } from './components/movie-grid'
import { Pagination } from './components/pagination'
import { movies } from './data/movie'

function App() {
  const [currentPage, setCurrentPage] = useState(1)
  const [bookmarkedMovieIds, setBookmarkedMovieIds] = useState<number[]>(
    movies.filter((movie) => movie.isBookmarked).map((movie) => movie.id),
  )

  const handleBookmarkToggle = (movieId: number) => {
    setBookmarkedMovieIds((currentIds) =>
      currentIds.includes(movieId)
        ? currentIds.filter((id) => id !== movieId)
        : [...currentIds, movieId],
    )
  }

  return (
    <div className="app" id="top">
      <Header />
      <main className="movie-page">
        <div className="movie-page__heading">
          <p className="movie-page__eyebrow">NOW PLAYING</p>
          <h1>영화 목록</h1>
        </div>

        <MovieGrid
          movies={movies}
          bookmarkedMovieIds={bookmarkedMovieIds}
          onBookmarkToggle={handleBookmarkToggle}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
        />
      </main>

      <footer className="footer">
        <p>영화 정보는 TMDB를 참고했습니다.</p>
        <img
          src="/umcine-images/images/logos/tmdb-logo.svg"
          alt="The Movie Database"
        />
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </footer>
    </div>
  )
}

export default App
