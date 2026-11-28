
import LoadingSpinner from "../components/common/loading-spinner";

export default function Loading() {
  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-[#0b1120] px-5">
      <div className="flex flex-col items-center gap-6">
        <div className="text-3xl font-black tracking-tight text-white">
          UMC<span className="text-blue-400">ine</span>
        </div>

        <LoadingSpinner
          size="lg"
          message="페이지를 불러오는 중이에요…"
        />

        <p className="text-xs text-slate-400">
          새로운 영화를 만나러 가는 중
        </p>
      </div>
    </main>
  );
}
