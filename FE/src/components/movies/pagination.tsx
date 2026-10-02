interface PaginationProps { currentPage: number; onPageChange: (page: number) => void; }

export function Pagination({ currentPage, onPageChange }: PaginationProps) {
  const pages = [1, 2, 3, 4, 5];
  const buttonClass = "flex h-9 min-w-9 items-center justify-center rounded border border-gray-700 bg-[#1f2128] text-sm text-white hover:bg-[#2e303d] disabled:cursor-not-allowed disabled:opacity-30";
  return <nav className="mt-10 flex items-center justify-center gap-2" aria-label="페이지 이동">
    <button type="button" className={`${buttonClass} w-9`} aria-label="이전 페이지" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}><img src="/icons/chevron-left.svg" alt="" className="h-4 w-4 invert" /></button>
    {pages.map((page) => <button key={page} type="button" className={currentPage === page ? `${buttonClass} border-[#e50914] bg-[#e50914] font-bold` : buttonClass} aria-label={`${page}페이지`} aria-current={currentPage === page ? "page" : undefined} onClick={() => onPageChange(page)}>{page}</button>)}
    <button type="button" className={`${buttonClass} w-9`} aria-label="다음 페이지" disabled={currentPage === pages.length} onClick={() => onPageChange(currentPage + 1)}><img src="/icons/chevron-right.svg" alt="" className="h-4 w-4 invert" /></button>
  </nav>;
}
