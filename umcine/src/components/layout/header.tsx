import { Link, useNavigate } from '@tanstack/react-router';

export function Header() {
  const navigate = useNavigate();

  return (
    <header className='border-b border-gray-200 bg-white'>
      <div className='mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-3 sm:gap-8 sm:px-6'>
        {/* 로고 */}
        <div className='flex shrink-0 items-center gap-2 whitespace-nowrap text-lg font-bold text-gray-900'>
          <img
            src='/icons/movie-icons/movie.svg'
            alt=''
            aria-hidden='true'
            className='h-5 w-5'
          />
          <span>UMCine</span>
        </div>

        {/* 메뉴 */}
        <nav
          className='flex flex-1 items-center gap-3 sm:gap-6'
          aria-label='주요 메뉴'
        >
          <Link
            to='/'
            className='text-[13px] text-gray-500 no-underline transition-colors hover:text-gray-900 sm:text-sm'
            activeProps={{
              className:
                'text-[13px] font-semibold text-gray-900 no-underline sm:text-sm',
            }}
            activeOptions={{ exact: true }}
          >
            영화
          </Link>

          <Link
            to='/search'
            className='text-[13px] text-gray-500 no-underline transition-colors hover:text-gray-900 sm:text-sm'
            activeProps={{
              className:
                'text-[13px] font-semibold text-gray-900 no-underline sm:text-sm',
            }}
          >
            검색
          </Link>
        </nav>

        {/* 우측 버튼 */}
        <div className='flex shrink-0 items-center gap-1.5 sm:gap-3'>
          <button
            type='button'
            className='flex items-center justify-center rounded p-1'
            aria-label='검색'
            onClick={() => navigate({ to: '/search' })}
          >
            <img
              src='/icons/movie-icons/search.svg'
              alt=''
              aria-hidden='true'
              className='h-[18px] w-[18px]'
            />
          </button>

          <button
            type='button'
            className='rounded-md bg-blue-600 px-2.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 sm:px-4 sm:text-sm'
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
