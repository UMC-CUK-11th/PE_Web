import "./header.css";

export default function Header() {
  return (
    <header>
      <nav id="navigator">
        <img src="\images\logos\tmdb-logo.svg" alt="Logo" id="logo"></img>
        <ul className="nav-list">
          <li className="nav-item">
            <a href="#" id="nav-movie">
              영화
            </a>
          </li>
          <li className="nav-item">
            <a href="#" id="nav-search">
              검색
            </a>
          </li>
          <li className="nav-item">
            <a href="#" id="nav-myinfo">
              내 정보
            </a>
          </li>
        </ul>
      </nav>
      <div id="top-action">
        <a href="#">
          <img
            src="\icons\movie-icons\search.svg"
            alt="search"
            className="icons"
          ></img>
        </a>
        <button className="mypage-btn">마이페이지</button>
      </div>
    </header>
  );
}
