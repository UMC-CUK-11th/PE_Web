import "./header.css";

export default function Header() {
  return (
    <header className="topbar">
      <div className="header-left">
        <a className="brand" href="/">
          <img
            className="brand-icon"
            src="/movie-icons/movie.svg"
            alt=""
          />
          <span>UMCine</span>
        </a>

        <nav className="header-nav" aria-label="주요 메뉴">
          <a className="nav-link active" href="#">
            영화
          </a>

          <a className="nav-link" href="#">
            검색
          </a>

          <a className="nav-link" href="#">
            내 정보
          </a>
        </nav>
      </div>

      <div className="header-actions">
        <button
          className="search-button"
          type="button"
          aria-label="영화 검색"
        >
          <img
            src="/movie-icons/search.svg"
            alt=""
          />
        </button>

        <button className="login-button" type="button">
          로그인
        </button>
      </div>
    </header>
  );
}