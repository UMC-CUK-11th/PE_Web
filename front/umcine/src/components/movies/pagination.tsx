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

  return (
    <nav className="mt-10 flex justify-center gap-2" aria-label="영화 페이지">
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
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
    </nav>
  );
}
