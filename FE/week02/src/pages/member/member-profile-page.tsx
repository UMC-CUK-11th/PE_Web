import { Link } from "react-router-dom";
import { useMemberProfileStore } from "../../stores/member-profile-store";

export function MemberProfilePage() {
  const profile = useMemberProfileStore((state) => state.profile);

  return (
    <main className="flex-1">
      <div className="mx-auto w-[min(calc(100%-48px),900px)] py-12 pb-24 max-[420px]:w-[calc(100%-32px)]">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#2877eb]">MY PAGE</p>
            <h1 className="mt-2 text-[34px] font-extrabold tracking-[-1.5px]">내 정보</h1>
          </div>
          <Link className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#dce1e7] bg-white px-4 text-sm font-bold text-[#30353b] no-underline" to="/my/edit">
            <img className="size-4" src="/icons/edit.svg" alt="" />
            정보 수정
          </Link>
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#e0e4e9] bg-white shadow-[0_15px_40px_rgba(28,38,54,0.06)]">
          <div className="flex items-center gap-5 border-b border-[#e9ecf0] bg-[#f9fafc] px-9 py-8 max-sm:px-6">
            <div className="grid size-20 shrink-0 place-items-center rounded-full bg-[#e9f2ff]">
              <img className="size-9" src="/icons/person.svg" alt="" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-extrabold">{profile.nickname}</h2>
              <p className="mt-1 truncate text-sm text-[#7e8691]">{profile.email}</p>
            </div>
          </div>

          <dl className="px-9 py-3 max-sm:px-6">
            <div className="grid grid-cols-[150px_1fr] border-b border-[#eceff2] py-6 max-sm:grid-cols-1 max-sm:gap-2">
              <dt className="text-sm font-bold text-[#747c87]">이메일</dt>
              <dd className="m-0 text-sm font-semibold">{profile.email}</dd>
            </div>
            <div className="grid grid-cols-[150px_1fr] border-b border-[#eceff2] py-6 max-sm:grid-cols-1 max-sm:gap-2">
              <dt className="text-sm font-bold text-[#747c87]">닉네임</dt>
              <dd className="m-0 text-sm font-semibold">{profile.nickname}</dd>
            </div>
            <div className="grid grid-cols-[150px_1fr] py-6 max-sm:grid-cols-1 max-sm:gap-2">
              <dt className="text-sm font-bold text-[#747c87]">한 줄 소개</dt>
              <dd className="m-0 text-sm leading-6 text-[#535b65]">{profile.introduction || "등록된 소개가 없어요."}</dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}
