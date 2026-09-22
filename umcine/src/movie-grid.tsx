import { movies } from "./data/movie";
import { useState } from "react";
import "./movie-grid.css";

export default function MovieGrid() {
  const [moviesState, setBookmark] = useState(movies);

  function handleToggleBookmark(movieId: number) {
    setBookmark((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <main>
      <h2>영화 목록</h2>
      {moviesState.length == 0 ? (
        <p>표시할 영화가 없습니다.</p>
      ) : (
        <ul id="movie-grid-list">
          {moviesState.map((movie) => (
            <li key={movie.id} className="movie-grid-item">
              <div className="movie-grid-container">
                <img
                  src={movie.posterPath}
                  alt={movie.originalTitle}
                  className="movie-gird-poster"
                ></img>
                <button
                  className="bookmark-btn"
                  onClick={() => handleToggleBookmark(movie.id)}
                  aria-label="Bookmark"
                  aria-pressed={movie.isBookmarked}
                >
                  <img
                    src={
                      movie.isBookmarked
                        ? "/icons/movie-icons/bookmark.svg"
                        : "/icons/movie-icons/bookmark-outline.svg"
                    }
                    alt=""
                    aria-hidden="true"
                  />
                </button>
              </div>
              <p id="movie-grid-title">{movie.title}</p>
              <p id="movie-grid-releaseDate">{movie.releaseDate}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
