export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-content">
        <a className="brand" href="/" aria-label="UMCine 영화 목록">
          <img src="/icons/movie.svg" alt="" />UMCine
        </a>
        <nav className="main-nav" aria-label="주 메뉴">
          <a className="active" href="/" aria-current="page">영화</a>
          <span>검색</span>
          <span>내 정보</span>
        </nav>
        <div className="header-actions">
          <img className="search-icon" src="/icons/search.svg" alt="검색" />
          <span className="login-label">로그인</span>
        </div>
      </div>
    </header>
  );
}
