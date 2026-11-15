interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const visiblePages = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => Math.floor((page - 1) / 5) * 5 + index + 1,
  ).filter((pageNumber) => pageNumber <= totalPages);

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="disabled:opacity-30"
      >
        <img src="/icons/chevron-left.svg" alt="" />
      </button>

      {visiblePages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          className={`rounded-md px-3 py-2 ${
            page === pageNumber ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="disabled:opacity-30"
      >
        <img src="/icons/chevron-right.svg" alt="" />
      </button>
    </div>
  );
}

export default Pagination;
