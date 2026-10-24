export default function RequestStatus({
  loading,
  error,
  onRetry,
}: {
  loading?: boolean;
  error?: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="mx-auto my-10 max-w-3xl rounded-2xl bg-white p-10 text-center"
      role={error ? "alert" : "status"}
    >
      <p>{loading ? "영화를 불러오는 중이에요…" : error}</p>
      {error && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-xl bg-zinc-950 px-5 py-3 text-white"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
