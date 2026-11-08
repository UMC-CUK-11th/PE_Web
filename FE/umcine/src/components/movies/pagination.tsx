import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, index) => index + 1);
  return <nav className="mt-[38px] flex items-center justify-center gap-[6px]" aria-label="페이지 이동">
    {pages.map((page) => <button key={page} type="button"
      aria-label={page + "페이지"} aria-current={currentPage === page ? "page" : undefined}
      className={cn("h-[30px] w-[30px] border text-[12px]",
        currentPage === page ? "border-[#536be8] bg-[#536be8] text-white" : "border-[#dddddd] bg-white text-[#222222]")}
      onClick={() => onPageChange(page)}>{page}</button>)}
  </nav>;
}
