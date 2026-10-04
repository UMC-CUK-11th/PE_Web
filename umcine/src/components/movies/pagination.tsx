interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className='mt-8 flex items-center justify-center gap-1.5'
      aria-label='페이지 이동'
    >
      {/* 이전 페이지 */}
      <button
        type='button'
        className='
          flex h-8 min-w-8 items-center justify-center
          rounded-md border border-gray-200 bg-white
          text-gray-700
          disabled:cursor-not-allowed disabled:opacity-40
        '
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label='이전 페이지'
      >
        <img
          src='/icons/movie-icons/chevron-left.svg'
          alt=''
          aria-hidden='true'
          className='h-3.5 w-3.5'
        />
      </button>

      {/* 페이지 번호 */}
      {pages.map((page) => {
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type='button'
            className={`
              flex h-8 min-w-8 items-center justify-center
              rounded-md border text-[13px]
              ${
                isActive
                  ? 'border-gray-900 bg-gray-900 font-bold text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
              }
            `}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        );
      })}

      {/* 다음 페이지 */}
      <button
        type='button'
        className='
          flex h-8 min-w-8 items-center justify-center
          rounded-md border border-gray-200 bg-white
          text-gray-700
          disabled:cursor-not-allowed disabled:opacity-40
        '
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label='다음 페이지'
      >
        <img
          src='/icons/movie-icons/chevron-right.svg'
          alt=''
          aria-hidden='true'
          className='h-3.5 w-3.5'
        />
      </button>
    </nav>
  );
}
