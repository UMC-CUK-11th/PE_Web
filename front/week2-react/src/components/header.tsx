export function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="UMCine 홈">
        <img className="brand-mark" src="/icons/movie.svg" alt="" />
        <span>UMCine</span>
      </a>
      <nav className="header-navigation" aria-label="주요 메뉴">
        <a className="active" href="#movie-list">영화</a>
        <a href="#search">검색</a>
        <a href="#my-page">내 정보</a>
      </nav>
      <div className="header-actions">
        <button className="icon-button" type="button" aria-label="검색">
          <img src="/icons/search.svg" alt="" />
        </button>
        <button className="login-button" type="button">로그인</button>
      </div>
    </header>
  );
}
