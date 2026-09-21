import "./movie-card.css";

export default function MovieCard() {
  return (
    <main>
      <div id="movie-card-header">
        <div id="movie-card-container">
          <div id="movie-card-header-action">
            <a>
              <img
                src="\icons\movie-icons\chevron-left.svg"
                alt="back"
                id="movie-card-back"
              />
            </a>
            <p>영화 목록</p>
          </div>
          <div id="movie-card-header-info">
            <h2>스파이더맨: 브랜드 뉴 데이</h2>
            <p>Spider-Man: Brand New Day</p>
            <p>2026.07.29 SF.액션.모험 2시간 25분</p>
          </div>
        </div>
        <img
          src="/images/movies/spider-man-brand-new-day-backdrop.jpg"
          alt="spider-man-backdrop"
          id="movie-backdrop"
        />
      </div>
      <section id="movie-card-contents"></section>
      <section id="movie-card-review"></section>
    </main>
  );
}
