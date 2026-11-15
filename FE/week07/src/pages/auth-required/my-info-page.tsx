import { Link } from "@tanstack/react-router";
import { readProfilePreview } from "./profile-preview";

export function MyInfoPage() {
  const profile = readProfilePreview();

  return (
    <main className="mx-auto min-h-[calc(100vh-76px)] w-full max-w-[680px] px-5 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold">내 정보</h1>
          <p className="mt-2 text-sm text-[#7b808b]">내 프로필을 확인해 보세요.</p>
        </div>
        <Link className="rounded-lg bg-[#2669ee] px-5 py-3 text-sm font-bold text-white no-underline" to="/my-info/edit">수정하기</Link>
      </div>
      <div className="rounded-xl border border-[#e4e7ed] bg-white p-7">
        <dl className="space-y-6">
          <div><dt className="mb-2 text-xs font-bold text-[#7b808b]">이메일</dt><dd className="text-base font-semibold">{profile.email}</dd></div>
          <div><dt className="mb-2 text-xs font-bold text-[#7b808b]">닉네임</dt><dd className="text-base font-semibold">{profile.nickname}</dd></div>
          <div><dt className="mb-2 text-xs font-bold text-[#7b808b]">한 줄 소개</dt><dd className="text-base">{profile.introduction}</dd></div>
        </dl>
      </div>
      <p className="mt-4 text-xs text-[#7b808b]">7주차 화면 미리보기 데이터예요. 실제 계정 정보 조회는 8주차에 연결해요.</p>
    </main>
  );
}
