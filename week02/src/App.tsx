import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/header";
import { movies } from "./data/movie";
import { MovieDetailPage } from "./pages/movie-detail-page";
import { MovieListPage } from "./pages/movie-list-page";
import { SearchPage } from "./pages/search-page";

const initialBookmarks = movies.filter((movie) => movie.isBookmarked).map((movie) => movie.id);

export default function App() {
  const [bookmarkedMovieIds, setBookmarkedMovieIds] = useState<number[]>(initialBookmarks);

  const handleBookmarkToggle = (movieId: number) => {
    setBookmarkedMovieIds((currentIds) =>
      currentIds.includes(movieId)
        ? currentIds.filter((id) => id !== movieId)
        : [...currentIds, movieId],
    );
  };

  const sharedProps = {
    bookmarkedMovieIds,
    onBookmarkToggle: handleBookmarkToggle,
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fa] text-[#202124]" id="top">
      <Header />
      <Routes>
        <Route path="/" element={<MovieListPage {...sharedProps} />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movies/:movieId" element={<MovieDetailPage {...sharedProps} />} />
        <Route path="*" element={<MovieDetailPage {...sharedProps} />} />
      </Routes>
      <footer className="mt-auto h-14 shrink-0 border-t border-[#e1e4e8] bg-white">
        <div className="mx-auto flex h-full w-[min(calc(100%-48px),1200px)] items-center justify-end gap-1 text-[10px] text-[#7f8792] max-[420px]:w-[calc(100%-32px)]">
          <img className="mr-0.5 w-[23px]" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
          <span>This product uses the TMDB API but is not endorsed or certified by</span>
          <a className="underline" href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB.</a>
        </div>
      </footer>
    </div>
  );
}
