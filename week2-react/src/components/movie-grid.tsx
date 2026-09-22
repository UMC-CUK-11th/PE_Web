import type { Movie } from "../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieGrid(props: MovieGridProps) {
  return (
    <section className="movie-grid">

      {/*전달받은 movies 배열을 하나씩 꺼내서 각각 MovieCard 컴포넌트로 바꿔 화면에 표시한다.*/}
      {props.movies.map((movie) => (
        <MovieCard
          //React가 각 영화를 구분하기 위한 고유한 값
          key={movie.id}

          //현재 영화 객체 하나를 MovieCard에게 전달
          movie={movie}

          //App에서 전달받은 북마크 변경 함수를 다시 MovieCard에게 전달
          onToggleBookmark={props.onToggleBookmark}
        />
      ))}
    </section>
  );
}