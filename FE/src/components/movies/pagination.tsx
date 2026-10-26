interface PaginationProps { page: number; totalPages: number; onPageChange: (page: number) => void }
export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const last = Math.min(totalPages, 500);
  if (last < 1) return null;
  const start = Math.max(1, Math.min(page - 2, last - 4));
  const pages = Array.from({ length: Math.min(5, last) }, (_, index) => start + index);
  return <nav aria-label="페이지 선택" className="mt-12 flex flex-wrap items-center justify-center gap-3">
    <button type="button" aria-label="이전 페이지" disabled={page <= 1} onClick={() => onPageChange(Math.min(last, page - 1))} className="page-button disabled:opacity-40">←</button>
    {pages.map((value) => <button key={value} type="button" aria-label={`${value} 페이지`} aria-current={page === value ? "page" : undefined} className={page === value ? "page-button active-page" : "page-button"} onClick={() => onPageChange(value)}>{value}</button>)}
    <button type="button" aria-label="다음 페이지" disabled={page >= last} onClick={() => onPageChange(page + 1)} className="page-button disabled:opacity-40">→</button>
  </nav>;
}
