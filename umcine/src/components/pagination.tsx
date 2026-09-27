interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

const pages = [1, 2, 3, 4, 5];

export default function Pagination({
  currentPage,
  onPageChange,
}: PaginationProps) {
  return (
    <nav
      className="pagination"
      aria-label="영화 목록 페이지"
    >
      <button
        type="button"
        className="page-arrow"
        onClick={() =>
          onPageChange(Math.max(1, currentPage - 1))
        }
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        ‹
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`page-button ${
            currentPage === page ? "active" : ""
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="page-arrow"
        onClick={() =>
          onPageChange(Math.min(5, currentPage + 1))
        }
        disabled={currentPage === 5}
        aria-label="다음 페이지"
      >
        ›
      </button>
    </nav>
  );
}