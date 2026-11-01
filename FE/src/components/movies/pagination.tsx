interface PaginationProps {
  page: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}
export default function Pagination({ page, totalPages, loading, onPageChange }: PaginationProps) {
  return (
    <div className="mt-10 flex justify-center gap-4">
      <button type="button" disabled={loading || page <= 1} onClick={() => onPageChange(page - 1)} className="rounded-md border border-gray-300 px-4 py-2 text-sm disabled:opacity-40">이전</button>
      <span className="flex items-center px-2 text-sm">{page}</span>
      <button type="button" disabled={loading || page >= totalPages} onClick={() => onPageChange(page + 1)} className="rounded-md border border-gray-300 px-4 py-2 text-sm disabled:opacity-40">다음</button>
    </div>
  );
}
