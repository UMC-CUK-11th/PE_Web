interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  onPageChange,
}: PaginationProps) {
  const pages = [1, 2, 3, 4, 5];

  return (
    <div className="pagination">
      <button
        type="button"
        className="page-nav-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img src="/icons/chevron-left.svg" alt="이전" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`page-btn ${currentPage === page ? "active" : ""}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="page-nav-btn"
        disabled={currentPage === 5}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img src="/icons/chevron-right.svg" alt="다음" />
      </button>
    </div>
  );
}
