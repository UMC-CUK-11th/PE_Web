import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  const firstPage = Math.max(1, Math.min(currentPage - 2, pageCount - 4));
  const visiblePages = Array.from(
    { length: Math.min(5, pageCount) },
    (_, index) => firstPage + index,
  );

  return (
    <nav className="mt-10 flex justify-center gap-2" aria-label="영화 페이지">
      <button
        className="h-[34px] min-w-[34px] cursor-pointer rounded-md border border-[#dce0e6] bg-white px-2 text-[#3f4651] disabled:cursor-default disabled:opacity-40"
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        이전
      </button>
      {visiblePages.map((page) => (
        <button
          key={page}
          className={cn(
            "h-[34px] min-w-[34px] cursor-pointer rounded-md border border-[#dce0e6] bg-white text-[#3f4651]",
            currentPage === page && "border-[#2f65dd] bg-[#2f65dd] text-white",
          )}
          type="button"
          aria-current={currentPage === page ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="h-[34px] min-w-[34px] cursor-pointer rounded-md border border-[#dce0e6] bg-white px-2 text-[#3f4651] disabled:cursor-default disabled:opacity-40"
        type="button"
        disabled={currentPage === pageCount}
        onClick={() => onPageChange(currentPage + 1)}
      >
        다음
      </button>
    </nav>
  );
}
