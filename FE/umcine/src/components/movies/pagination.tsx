interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // TMDB only accepts pages 1–500 even if total_pages is larger.
  const lastPage = Math.min(500, Math.max(0, totalPages));
  if (lastPage < 2) return null;
  const start = Math.max(1, Math.min(currentPage - 2, lastPage - 4));
  const pages = Array.from(
    { length: Math.min(5, lastPage) },
    (_, index) => start + index,
  );
  return (
    <nav className="pagination" aria-label="영화 목록 페이지">
      <button
        type="button"
        className="page-arrow"
        disabled={currentPage <= 1}
        aria-label="이전 페이지"
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={"page-button " + (currentPage === page ? "active" : "")}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        className="page-arrow"
        disabled={currentPage >= lastPage}
        aria-label="다음 페이지"
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>
    </nav>
  );
}
