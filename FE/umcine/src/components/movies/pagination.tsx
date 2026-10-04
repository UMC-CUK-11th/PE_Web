import { useState } from "react";
import { cn } from "../../utils/cn";

export default function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <nav className="mt-[38px] flex items-center justify-center gap-[6px]" aria-label="페이지 이동">
      {[1, 2, 3, 4, 5].map((page) => (
        <button
          // 현재 페이지인지에 따라 버튼의 class를 다르게 적용한다.
          className={cn(
            "h-[30px] w-[30px] border text-[12px]",
            currentPage === page
              ? "border-[#536be8] bg-[#536be8] text-white"
              : "border-[#dddddd] bg-white text-[#222222]",
          )}
          key={page}
          type="button"
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}
