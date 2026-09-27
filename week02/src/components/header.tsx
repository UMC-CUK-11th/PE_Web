export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__content">
        <a className="brand" href="#top" aria-label="UMCine 홈">
          <img src="/icons/movie.svg" alt="" />
          <span>UMCine</span>
        </a>
        <nav className="main-nav" aria-label="주요 메뉴">
          <a className="main-nav__link main-nav__link--active" href="#movies">영화</a>
          <a className="main-nav__link" href="#search">검색</a>
          <a className="main-nav__link" href="#profile">내 정보</a>
        </nav>
        <div className="header-actions">
          <button className="search-button" type="button" aria-label="영화 검색">
            <img src="/icons/search.svg" alt="" />
          </button>
          <button className="login-button" type="button">로그인</button>
        </div>
      </div>
    </header>
  );
}
