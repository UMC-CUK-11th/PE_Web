import { cn } from "../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const visiblePageCount = Math.min(totalPages, 5);
  const lastStartPage = Math.max(totalPages - visiblePageCount + 1, 1);
  const startPage = Math.min(Math.max(currentPage - 2, 1), lastStartPage);
  const visiblePages = Array.from({ length: visiblePageCount }, (_, index) => startPage + index);

  return (
    <nav className="mt-9 flex justify-center gap-2" aria-label="영화 목록 페이지">
      {visiblePages.map((page) => (
        <button
          key={page}
          className={cn(
            "size-9 cursor-pointer rounded-lg border",
            page === currentPage
              ? "border-[#2877eb] bg-[#2877eb] text-white"
              : "border-[#dde1e6] bg-white text-[#5e636c]",
          )}
          type="button"
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={`${page}페이지`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}
