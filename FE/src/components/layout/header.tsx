// 이 파일은 모든 페이지 위에 공통으로 보이는 사이트 머리글을 담당한다.
// 메뉴를 페이지마다 복사하지 않고 하나의 컴포넌트로 재사용하기 위해 분리했다.
import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="flex items-center gap-6 border-b border-[#2e303d] bg-[#1a1c24] px-8 py-4">
      <Link to="/" className="text-2xl font-bold text-[#e50914]">
        UMCine
      </Link>
      {/* activeProps는 현재 URL의 링크를 강조하고 보조 기술에 현재 페이지를 알려준다. */}
      <nav className="flex gap-4 text-sm text-white" aria-label="주요 메뉴">
        <Link
          to="/"
          activeOptions={{ exact: true }}
          activeProps={{
            "aria-current": "page",
            className: "font-bold text-[#e50914]",
          }}
        >
          영화 목록
        </Link>
        <Link
          to="/search"
          activeOptions={{ exact: true }}
          activeProps={{
            "aria-current": "page",
            className: "font-bold text-[#e50914]",
          }}
        >
          영화 검색
        </Link>
      </nav>
    </header>
  );
}
