interface ErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "영화 정보를 불러오지 못했습니다.";
}

export function LoadingState({ message = "영화 정보를 불러오는 중이에요." }: { message?: string }) {
  return (
    <section className="grid min-h-[320px] place-items-center text-center" aria-live="polite" aria-busy="true">
      <div>
        <div className="mx-auto mb-4 size-9 animate-spin rounded-full border-4 border-[#dfe3e8] border-t-[#2877eb]" />
        <p className="text-sm font-semibold text-[#737b86]">{message}</p>
      </div>
    </section>
  );
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <section className="grid min-h-[320px] place-items-center px-6 text-center" role="alert">
      <div>
        <h2 className="text-xl font-extrabold">요청을 완료하지 못했어요.</h2>
        <p className="mt-3 text-sm text-[#737b86]">{getErrorMessage(error)}</p>
        <button className="mt-6 h-10 cursor-pointer rounded-lg border-0 bg-[#18191b] px-5 text-sm font-bold text-white" type="button" onClick={onRetry}>
          다시 시도
        </button>
      </div>
    </section>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <section className="grid min-h-[320px] place-items-center px-6 text-center" aria-live="polite">
      <div>
        <img className="mx-auto mb-5 size-10 opacity-40" src="/icons/movie.svg" alt="" />
        <h2 className="text-xl font-extrabold">{title}</h2>
        <p className="mt-2 text-sm text-[#737b86]">{description}</p>
      </div>
    </section>
  );
}
