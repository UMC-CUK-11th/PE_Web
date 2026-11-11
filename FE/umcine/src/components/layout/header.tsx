import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/auth-store";

export function Header() {
  const isLoggedIn = useAuthStore((state) => !!state.session);
  const clearSession = useAuthStore((state) => state.clearSession);
  const queryClient = useQueryClient();
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
              to="/mypage"
              activeProps={{ style: { color: "#17191e", textDecoration: "underline" } }}
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
        className="flex items-center gap-2 p-0 max-md:order-2"
      >
        <Link to="/search">
          <img
            src="\icons\movie-icons\search.svg"
            alt="search"
            className="flex h-[42px] w-[42px] items-center rounded-lg border border-[rgba(227,230,235,1)] bg-white p-2"
          />
        </Link>

        <Link
          to={isLoggedIn ? "/mypage" : "/login"}
          className="flex h-[42px] w-[95px] items-center justify-center rounded-lg bg-[#2563eb] text-[14px] font-bold text-white no-underline hover:bg-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
        >
          {isLoggedIn ? "마이페이지" : "로그인"}
        </Link>
        {isLoggedIn && <button type="button" className="text-xs text-[#69707d] cursor-pointer" onClick={() => {
          clearSession();
          queryClient.removeQueries({ queryKey: ["ratings"] });
        }}>로그아웃</button>}
      </div>
    </header>
  );
}
