import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard(props: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img
          className="movie-poster"
          src={props.movie.posterPath}
          alt={props.movie.title}
        />

        <button
            //북마크된 영화라면 active 클래스를 추가하고, 아니면 bookmark-button 클래스만 사용한다.
            className={`bookmark-button ${
                props.movie.isBookmarked ? "active" : ""
            }`}

            //버튼을 클릭하면 부모에서 전달받은 북마크 변경 함수를 실행한다.
            //어떤 영화를 눌렀는지 알 수 있도록 현재 영화의 id를 전달한다.
            onClick={() => props.onToggleBookmark(props.movie.id)}
            aria-label={
                props.movie.isBookmarked
                ? "북마크 해제"
                : "북마크 추가"
            }
            >
            <img
              
                //북마크 상태가 true면 채워진 북마크 아이콘을 보여주고, false면 빈 북마크 아이콘을 보여준다
                src={
                props.movie.isBookmarked
                    ? "/icons/bookmark.svg"
                    : "/icons/bookmark-outline.svg"
                }
                alt=""
            />
        </button>
      </div>

      <h2>{props.movie.title}</h2>
      <p>{props.movie.releaseDate}</p>
    </article>
  );
}