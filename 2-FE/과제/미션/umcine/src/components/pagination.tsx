interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, onPageChange }: PaginationProps) {
  return (
    <nav className="pagination" aria-label="페이지 선택">
      {[1, 2, 3, 4, 5].map((page) => (
        <button
          key={page}
          type="button"
          aria-label={`${page}페이지`}
          aria-current={currentPage === page ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >{page}</button>
      ))}
    </nav>
  );
}
