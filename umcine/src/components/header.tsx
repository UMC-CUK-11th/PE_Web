export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="logo">UMCine</h1>

        <nav className="nav">
          <button type="button" className="nav-button active">
            영화
          </button>
          <button type="button" className="nav-button">
            북마크
          </button>
        </nav>
      </div>
    </header>
  );
}