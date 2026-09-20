function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-icon">▣</span>
          <span>UMCine</span>
        </div>

        <nav className="nav">
          <a href="#" className="active">
            영화
          </a>
          <a href="#">검색</a>
          <a href="#">내 정보</a>
        </nav>

        <div className="header-actions">
          <button className="search-button" type="button">
            <img src="/icons/search.svg" alt="검색" />
          </button>
          <button className="login-button" type="button">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
