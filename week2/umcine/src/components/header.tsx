export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <div role="img" aria-label="logo">
            <img
              src="/icons/movie-icons/movie.svg"
              alt="영화"
              className="movie-logo-img"
            />
          </div>
          UMCine
        </div>
        <nav className="nav-menu" aria-label="주요 메뉴">
          <a href="#movies" className="active">영화</a>
          <a href="#search">검색</a>
          <a href="#profile">내 정보</a>
        </nav>
      </div>
      <div className="header-right">
        <button className="search-btn" type="button" aria-label="검색">
          <img src="/icons/movie-icons/search.svg" alt="" />
        </button>
        <button className="login-btn" type="button">로그인</button>
      </div>
    </header>
  );
}
