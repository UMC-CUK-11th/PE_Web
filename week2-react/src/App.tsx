import { useState } from "react";
import "./App.css";

import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";

//movies.ts에 있는 movies 배열을 가져온다.
//App.tsx에서는 처음 사용할 영화 데이터라는 의미로 initialMovies라는 이름으로 사용된다.
import { movies as initialMovies } from "./data/movies";

export default function App() {

  //initialMOvies를 초기값으로 영화 목록 상태를 만든다.
  //movies는 현재 영화 목록이고, setMovies는 영화 목록 상태를 변경할 때 사용하는 함수이다.
  const [movies, setMovies] = useState(initialMovies);

  //북마크를 누른 영화의 id를 매개변수로 받는다.
  function handleToggleBookmark(movieId: number) {

    //현재 영화 배열을 기준으로 새로운 영화 배열을 만든다.
    setMovies((currentMovies) =>

      //영화들을 하나씩 확인한다.
      currentMovies.map((movie) =>

        //현재 확인 중인 영화가 클릭한 영화인지 비교한다.
        movie.id === movieId

          //클릭한 영화라면 기존 영화 정보는 그대로 복사하고
          //isBookmarked 값만 true <-> false로 반대로 바꾼다.
          ? {
              ...movie,
              isBookmarked: !movie.isBookmarked,
            }

          //클릭하지 않은 영화는 그대로 유지한다.
          : movie,
      ),
    );
  }

  return (
    <>
      {/*페이지 상단 메뉴와 로고 영역을 담당한다*/}
      <Header />
      

      <main className="app">
        <h1 className="page-title">영화 목록</h1>

        {/* MovieGrid에게 현재 영화 목록과 북마크 변경 함수를 props로 전달한다.
            영화 목록 전체를 배치한다. 내부에서 movies 배열을 map()으로 MovieCard들로 만든다.*/}
        <MovieGrid
          movies={movies}
          onToggleBookmark={handleToggleBookmark}
        />

          {/*페이지 번호 UI를 담당한다*/}
        <Pagination />
      </main>
    </>
  );
}