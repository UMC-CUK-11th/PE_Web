// 이 파일은 영화 목록 아래의 페이지 번호 버튼을 담당한다.
// 목록 페이지가 영화 데이터를 보여주는 일과 버튼 상태를 그리는 일을 나누기 위해 분리했다.
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // URL에는 넣지 않고 기존 로컬 상태를 유지하며 실제 API 페이지를 요청한다.
  const startPage = Math.min(Math.max(1, currentPage - 2), Math.max(1, totalPages - 4));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, index) => startPage + index);
  if (totalPages <= 1) return null;
  const buttonClass = [
    "flex h-9 min-w-9 items-center justify-center rounded border",
    "border-gray-700 bg-[#1f2128] text-sm text-white hover:bg-[#2e303d]",
    "disabled:cursor-not-allowed disabled:opacity-30",
  ].join(" ");

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-2"
      aria-label="페이지 이동"
    >
      <button
        type="button"
        className={`${buttonClass} w-9`}
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img src="/icons/chevron-left.svg" alt="" className="h-4 w-4 invert" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={
            currentPage === page
              ? `${buttonClass} border-[#e50914] bg-[#e50914] font-bold`
              : buttonClass
          }
          aria-label={`${page}페이지`}
          aria-current={currentPage === page ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className={`${buttonClass} w-9`}
        aria-label="다음 페이지"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img src="/icons/chevron-right.svg" alt="" className="h-4 w-4 invert" />
      </button>
    </nav>
  );
}
