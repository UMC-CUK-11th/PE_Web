interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="영화 목록 페이지">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          className={page === currentPage ? "pagination__button pagination__button--active" : "pagination__button"}
          type="button"
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange?.(page)}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}
