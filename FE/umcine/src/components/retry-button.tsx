export function RetryButton({ onRetry }: { onRetry: () => void }) {
  return <button type="button" className="mx-auto mt-4 block rounded bg-[#17181c] px-4 py-2 text-xs font-bold text-white" onClick={onRetry}>다시 시도</button>;
}
