import { cn } from "../../utils/cn";
export function Pagination({
  currentPage,
  onPageChange,
}: {
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <nav aria-label="페이지 선택" className="mt-12 flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={cn(
            "size-8 rounded text-sm",
            page === currentPage
              ? "bg-[#245de8] font-bold text-white"
              : "text-[#6a7081]",
          )}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}
