import { cn } from "../../utils/cn";

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
  return (
    <nav
      className="mt-[38px] flex items-center justify-center gap-1.5"
      aria-label="영화 목록 페이지"
    >
      <button
        className="grid size-[34px] cursor-pointer place-items-center rounded-[7px] p-0 text-[#737985] hover:bg-[#e9ecf1] disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent"
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img
          className="size-5 opacity-75"
          src="/icons/chevron-left.svg"
          alt=""
        />
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <button
            className={cn(
              "grid size-[34px] cursor-pointer place-items-center rounded-[7px] p-0 text-[13px] text-[#737985] hover:bg-[#e9ecf1]",
              page === currentPage &&
                "bg-[#1d63e9] font-bold text-white hover:bg-[#1d63e9]",
            )}
            type="button"
            aria-label={`${page}페이지`}
            aria-current={page === currentPage ? "page" : undefined}
            key={page}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ),
      )}
      <button
        className="grid size-[34px] cursor-pointer place-items-center rounded-[7px] p-0 text-[#737985] hover:bg-[#e9ecf1] disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent"
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img
          className="size-5 opacity-75"
          src="/icons/chevron-right.svg"
          alt=""
        />
      </button>
    </nav>
  );
}
