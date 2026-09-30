import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="flex items-center justify-between bg-white px-20 py-[21.5px] max-h-[91px] max-md:max-h-[151px] max-md:flex-col max-md:gap-10 max-md:px-4">
      <nav
        id="navigator"
        className="flex h-8 w-[308px] items-center justify-between max-md:order-1 max-md:w-full max-md:max-w-[308px] max-md:flex-col max-md:gap-2.5"
      >
        <Link to="/">
          <img
            src="\images\logos\tmdb-logo.svg"
            alt="Logo"
            id="logo"
            className="h-8 w-[116px]"
          />
        </Link>

        <ul className="m-0 flex h-[17px] w-[150px] list-none items-center justify-between p-0">
          <li>
            <Link
              to="/"
              id="nav-movie"
              className="text-[14px] font-bold text-[rgba(96,103,116,1)] transition duration-300 hover:text-[rgba(23,25,30,1)] hover:underline"
            >
              영화
            </Link>
          </li>

          <li>
            <Link
              to="/search"
              id="nav-search"
              className="text-[14px] font-bold text-[rgba(96,103,116,1)] transition duration-300 hover:text-[rgba(23,25,30,1)] hover:underline"
            >
              검색
            </Link>
          </li>

          <li>
            <Link
              to="."
              id="nav-myinfo"
              className="text-[14px] font-bold text-[rgba(96,103,116,1)] transition duration-300 hover:text-[rgba(23,25,30,1)] hover:underline"
            >
              내 정보
            </Link>
          </li>
        </ul>
      </nav>

      <div
        id="top-action"
        className="flex w-[142px] items-center justify-between p-0 max-md:order-2"
      >
        <Link to="/search">
          <img
            src="\icons\movie-icons\search.svg"
            alt="search"
            className="flex h-[42px] w-[42px] items-center rounded-lg border border-[rgba(227,230,235,1)] bg-white p-2"
          />
        </Link>

        <button className="h-[42px] w-[95px] max-h-full rounded-lg border border-white bg-[rgba(37,99,235,1)] p-0 text-[14px] font-bold text-white">
          마이페이지
        </button>
      </div>
    </header>
  );
}
