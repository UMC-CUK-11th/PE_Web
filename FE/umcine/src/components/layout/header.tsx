import { Link } from "@tanstack/react-router";

import { useLogout } from "../../hooks/use-logout";
import { useMeQuery } from "../../hooks/use-me-query";
import { useAuthStore } from "../../stores/auth-store";

export default function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMeQuery();
  const logout = useLogout();

  return (
    <header className="flex h-[56px] items-center justify-between border-b border-[#e7e9ed] bg-white px-12 max-[1080px]:px-7 max-[700px]:h-[52px] max-[700px]:px-4">
      <div className="flex items-center gap-7 max-[700px]:gap-4">
        <div className="flex items-center gap-[7px] text-[14px] font-extrabold tracking-[-0.4px] text-[#16181d]">
          <img
            src="/icons/movie-icons/movie.svg"
            alt=""
            aria-hidden="true"
            className="grid h-[19px] w-[19px] place-items-center rounded-[5px] border-[1.5px] border-[#16181d]"
          />
          UMCine
        </div>
        <nav className="flex items-center gap-[22px] max-[700px]:gap-3" aria-label="주요 메뉴">
          <Link to="/" activeProps={{ className: "font-bold text-[#000000] underline underline-offset-2" }} className="text-[11px] text-[#6e737d] no-underline">영화</Link>
          <Link to="/search" activeProps={{ className: "font-bold text-[#000000] underline underline-offset-2" }} className="text-[11px] text-[#6e737d] no-underline">검색</Link>
          <Link to="/my" activeProps={{ className: "font-bold text-[#000000] underline underline-offset-2" }} className="text-[11px] text-[#6e737d] no-underline">내 정보</Link>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/search" className="grid h-[26px] w-[26px] place-items-center rounded-[5px] border border-[#e1e4e9] bg-white" aria-label="검색">
          <img className="h-[15px] w-[15px]" src="/icons/movie-icons/search.svg" alt="" />
        </Link>
        {/* 로그인 전 → 로그인 링크, 첫 조회 중 → 같은 크기의 로딩 표시, 조회 후 → 닉네임과 로그아웃 */}
        {!accessToken ? (
          <Link to="/login" className="grid h-[26px] place-items-center rounded-[5px] bg-[#4c63d9] px-3 text-[10px] font-bold text-white no-underline max-[420px]:hidden">로그인</Link>
        ) : meQuery.isLoading ? (
          // enabled가 false일 때도 isPending은 참이라, 실제 첫 요청 중인지는 isLoading으로 확인해요.
          <span className="h-[26px] w-[88px] animate-pulse rounded-[5px] bg-[#e7e9ed]" aria-label="내 정보를 불러오는 중" />
        ) : (
          <>
            <Link to="/my" className="grid h-[26px] place-items-center rounded-[5px] border border-[#e1e4e9] bg-white px-3 text-[10px] font-bold text-[#17191f] no-underline max-[420px]:hidden">
              {meQuery.data ? `${meQuery.data.nickname}님` : "마이페이지"}
            </Link>
            <button type="button" onClick={logout} className="h-[26px] rounded-[5px] bg-[#4c63d9] px-3 text-[10px] font-bold text-white">
              로그아웃
            </button>
          </>
        )}
      </div>
    </header>
  );
}
