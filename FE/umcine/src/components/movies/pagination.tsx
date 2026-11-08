import "./pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const endPage = Math.min(totalPages, startPage + 4);
  const pages = Array.from(
    { length: Math.max(0, endPage - startPage + 1) },
    (_, index) => startPage + index,
  );

  return (
    <nav className="pagination" aria-label="영화 목록 페이지">
      <button
        type="button"
        aria-label="이전 페이지"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={totalPages === 0 || currentPage <= 1}
      >
        <img src="/icons/movie-icons/chevron-left.svg" alt="" aria-hidden="true" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={currentPage === page ? "active" : ""}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        aria-label="다음 페이지"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={totalPages === 0 || currentPage >= totalPages}
      >
        <img src="/icons/movie-icons/chevron-right.svg" alt="" aria-hidden="true" />
      </button>
    </nav>
  );
}
