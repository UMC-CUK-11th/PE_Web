import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="flex items-center gap-6 border-b border-[#2e303d] bg-[#1a1c24] px-8 py-4">
      <Link to="/" className="text-2xl font-bold text-[#e50914]">UMCine</Link>
      <nav className="flex gap-4 text-sm text-white" aria-label="주요 메뉴"><Link to="/" activeOptions={{ exact: true }} activeProps={{ "aria-current": "page", className: "font-bold text-[#e50914]" }}>영화 목록</Link><Link to="/search" activeOptions={{ exact: true }} activeProps={{ "aria-current": "page", className: "font-bold text-[#e50914]" }}>영화 검색</Link></nav>
    </header>
  );
}
