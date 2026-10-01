import { useState } from "react";

export default function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <nav aria-label="페이지 선택" className="mt-12 flex items-center justify-center gap-3">
      <button type="button" aria-label="이전 페이지" disabled className="flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white disabled:cursor-not-allowed disabled:opacity-40">
        <img src="/icons/chevron-left.svg" alt="" className="size-5" />
      </button>
      {[1, 2, 3, 4, 5].map((page) => (
        <button
          key={page}
          type="button"
          aria-current={currentPage === page ? "page" : undefined}
          className={currentPage === page ? "page-button active-page" : "page-button"}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}
      <button type="button" aria-label="다음 페이지" disabled className="flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white disabled:cursor-not-allowed disabled:opacity-40">
        <img src="/icons/chevron-right.svg" alt="" className="size-5" />
      </button>
    </nav>
  );
}
