export default function Pagination() {
  return (
    <div className="mt-10 flex justify-center gap-4">
      <button
        type="button"
        className="rounded-md border border-gray-300 px-4 py-2 text-sm"
      >
        이전
      </button>

      <span className="flex items-center px-2 text-sm">1</span>

      <button
        type="button"
        className="rounded-md border border-gray-300 px-4 py-2 text-sm"
      >
        다음
      </button>
    </div>
  );
}