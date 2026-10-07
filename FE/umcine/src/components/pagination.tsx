import { cn } from "../utils/cn";

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const chevronPath = '/icons/movie-icons/movie-icons'

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="mt-14 flex justify-center gap-2" aria-label="영화 목록 페이지">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="grid size-9 place-items-center rounded-md border border-[#dedfe3] bg-white disabled:cursor-not-allowed disabled:opacity-35"
      >
        <img className="size-4" src={`${chevronPath}/chevron-left.svg`} alt="" />
      </button>
      {pages.map((page) => (
        <button
          className={cn(
            "grid size-9 place-items-center rounded-md border border-[#dedfe3] bg-white text-xs text-[#5d6068] transition hover:border-[#9a9ca3]",
            page === currentPage && "border-[#2563eb] bg-[#2563eb] font-bold text-white hover:border-[#2563eb]",
          )}
          type="button"
          aria-label={`${page}페이지`}
          aria-current={page === currentPage ? 'page' : undefined}
          onClick={() => onPageChange(page)}
          key={page}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="grid size-9 place-items-center rounded-md border border-[#dedfe3] bg-white disabled:cursor-not-allowed disabled:opacity-35"
      >
        <img className="size-4" src={`${chevronPath}/chevron-right.svg`} alt="" />
      </button>
    </nav>
  )
}
