import { Link } from "@tanstack/react-router";
import { useProfilePreviewStore } from "./model/profile-preview-store";

export function ProfilePage() {
  const { nickname, email } = useProfilePreviewStore();
  return (
    <main className="mx-auto min-h-[calc(100vh-112px)] max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <p className="text-xs font-bold tracking-widest text-blue-600">MY UMCINE</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">내 정보</h1>
      <p className="mt-3 text-sm text-slate-500">나의 프로필을 확인하고 취향을 표현해 보세요.</p>
      <p className="mt-6 rounded-xl bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">화면 미리보기 · 예시 회원 정보예요. 변경 내용은 현재 화면에서만 유지돼요.</p>
      <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm" aria-label="프로필 정보">
        <div className="flex items-center gap-5 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white px-6 py-8 sm:px-8">
          <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-blue-600 text-2xl font-extrabold text-white" aria-hidden="true">{nickname.slice(0, 1).toUpperCase()}</div>
          <div className="min-w-0"><p className="break-words text-xl font-extrabold">{nickname}</p><p className="mt-1 text-sm text-slate-500">영화와 함께 쌓아가는 나의 취향</p></div>
        </div>
        <dl className="space-y-6 px-6 py-8 sm:px-8">
          <div><dt className="text-xs font-semibold text-slate-500">이메일</dt><dd className="mt-2 break-all text-sm font-semibold">{email}</dd></div>
          <div><dt className="text-xs font-semibold text-slate-500">닉네임</dt><dd className="mt-2 break-words text-sm font-semibold">{nickname}</dd></div>
        </dl>
        <div className="border-t border-slate-100 px-6 py-5 sm:px-8"><Link to="/mypage/edit" className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">내 정보 수정</Link></div>
      </section>
      <Link to="/" search={{}} className="mt-6 inline-block text-sm font-semibold text-slate-500 hover:text-blue-600">← 영화 둘러보기</Link>
    </main>
  );
}
