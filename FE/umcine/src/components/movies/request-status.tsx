
import LoadingSpinner from "../common/loading-spinner";

export default function RequestStatus({
  loading,
  loadingMessage = "영화를 불러오는 중이에요…",
  error,
  onRetry,
}: {
  loading?: boolean;
  loadingMessage?: string;
  error?: string;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <div className="mx-auto my-10 flex min-h-[320px] max-w-3xl items-center justify-center px-5">
        <LoadingSpinner
          size="lg"
          message={loadingMessage}
        />
      </div>
    );
  }

  if (!error) {
    return null;
  }

  return (
    <div
      role="alert"
      className="mx-5 my-10 flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-[#2b3b55] bg-[#162238] p-10 text-center sm:mx-auto sm:max-w-3xl"
    >
      <div
        aria-hidden="true"
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-2xl text-red-400"
      >
        !
      </div>

      <h2 className="text-xl font-bold text-white">
        문제가 발생했어요
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {error}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
      >
        다시 시도
      </button>
    </div>
  );
}
