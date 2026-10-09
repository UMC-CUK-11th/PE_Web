import { cn } from "../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-9 flex justify-center gap-2" aria-label="영화 목록 페이지">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          className={cn(
            "size-9 cursor-pointer rounded-lg border border-[#dde1e6] bg-white text-[#5e636c]",
            page === currentPage && "border-[#2877eb] bg-[#2877eb] text-white",
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
