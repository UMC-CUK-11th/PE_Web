export function RequestState({ loading, error, onRetry }: {
  loading?: boolean; error?: string; onRetry?: () => void;
}) {
  return <div role={error ? "alert" : "status"} className="my-8 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-600">
    <p>{loading ? "영화 정보를 불러오는 중이에요." : error || "조건에 맞는 영화가 없어요."}</p>
    {error && onRetry && <button type="button" onClick={onRetry} className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white">다시 시도</button>}
  </div>;
}
