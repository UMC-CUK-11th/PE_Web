export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand" aria-label="UMCine">
          <img src="/icons/movie.svg" alt="" />
          <span>UMCine</span>
        </div>
        <nav className="main-nav" aria-label="주 메뉴">
          <span className="nav-active">영화</span>
          <span>리뷰</span>
          <span>내 정보</span>
        </nav>
        <div className="header-actions">
          <img src="/icons/search.svg" alt="검색" />
          <button type="button" className="login-button">로그인</button>
        </div>
      </div>
    </header>
  );
}
