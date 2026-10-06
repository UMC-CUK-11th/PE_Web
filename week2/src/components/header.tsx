const iconPath = '/icons/movie-icons/movie-icons'

export function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <a className="header__logo" href="#top" aria-label="UMCine 홈">
          <span>UMC</span>INE
        </a>

        <nav className="header__nav" aria-label="주요 메뉴">
          <a href="#top">홈</a>
          <a className="header__nav-link--active" href="#movies">영화</a>
          <a href="#bookmarks">
            <img src={`${iconPath}/bookmark-outline.svg`} alt="" />
            보관함
          </a>
        </nav>

        <div className="header__actions">
          <button type="button" aria-label="영화 검색">
            <img src={`${iconPath}/search.svg`} alt="" />
          </button>
          <button className="header__login" type="button">
            <img src={`${iconPath}/person.svg`} alt="" />
            로그인
          </button>
        </div>
      </div>
    </header>
  )
}
