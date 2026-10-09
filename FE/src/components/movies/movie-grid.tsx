// 이 파일은 영화 배열을 카드 목록으로 바꾸고 화면 너비에 따라 열 수를 조절한다.
// 반복 렌더링을 한곳에 두어 목록 페이지가 개별 카드의 배치를 직접 다루지 않게 한다.
import type { Movie } from "../../types/movie";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {/* key는 React가 각 영화 카드를 고유하게 구별할 때 사용한다. */}
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} />
        </li>
      ))}
    </ul>
  );
}
