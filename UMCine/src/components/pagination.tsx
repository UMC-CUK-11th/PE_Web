import "./pagination.css";

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
  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav className="pagination" aria-label="영화 목록 페이지">
      <button
        type="button"
        className="pagination-arrow"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        <img
          src="/movie-icons/chevron-left.svg"
          alt=""
        />
      </button>

      <div className="pagination-pages">
        {pages.map((page) => (
          <button
            type="button"
            key={page}
            className={`pagination-page ${
              currentPage === page ? "active" : ""
            }`}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="pagination-arrow"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        <img
          src="/movie-icons/chevron-right.svg"
          alt=""
        />
      </button>
    </nav>
  );
}