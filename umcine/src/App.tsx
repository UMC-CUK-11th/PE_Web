import Header from "./header.tsx";
import MovieGrid from "./movie-grid.tsx";

import "./App.css";

export default function App() {
  return (
    <body>
      <Header />
      {/*영화 목록 화면*/}
      <MovieGrid />
      <footer>
        <img src="\images\logos\tmdb-logo.svg" alt="logo" />
        <p>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </footer>
    </body>
  );
}
