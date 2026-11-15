import { Link } from "@tanstack/react-router";
import { AuthCard } from "../../components/auth/auth-ui";
import { useProfilePreviewStore } from "../../stores/profile-preview-store";

export function MyPage() {
  const { email, nickname, createdAt } = useProfilePreviewStore();
  return <AuthCard title="내 정보" description="현재는 화면 확인을 위한 예시 프로필을 표시해요.">
    <div className="mb-7 flex items-center gap-4 rounded-xl bg-indigo-50 p-4">
      <img src="/icons/person.svg" alt="" className="h-10 w-10" />
      <p className="font-semibold text-gray-800">{nickname} 님의 영화 기록</p>
    </div>
    <dl className="space-y-5 text-sm">
      <div><dt className="mb-1 text-gray-500">이메일</dt><dd className="break-all font-medium">{email}</dd></div>
      <div><dt className="mb-1 text-gray-500">닉네임</dt><dd className="font-medium">{nickname}</dd></div>
      <div><dt className="mb-1 text-gray-500">가입일</dt><dd className="font-medium">{createdAt}</dd></div>
    </dl>
    <Link to="/mypage/edit" className="mt-8 block rounded-lg bg-[#536be8] py-3 text-center text-sm font-semibold text-white">내 정보 수정</Link>
  </AuthCard>;
}
