import Header from "./components/layout/header";
import MovieGrid from "./components/movies/movie-grid";

import { movies } from "./data/movie";

import "./App.css";

function App() {
  return (
    <>
      <Header />

      <main className="main">
        <h1>영화 목록</h1>

        <MovieGrid movies={movies} />
      </main>
    </>
  );
}

export default App;