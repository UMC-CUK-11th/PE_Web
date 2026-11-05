import { Link } from "@tanstack/react-router";
import AuthPanel from "../../components/auth/auth-panel";
import { buttonClassName } from "../../components/auth/form-styles";
import { demoProfile } from "./demo-profile";

export function MyPage() {
  return (
    <AuthPanel
      title="내 정보"
      description="나의 프로필을 확인하고, 영화 속 나만의 취향을 채워보세요."
    >
      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-500">
        예시 프로필
      </span>
      <div
        className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-950 text-2xl font-bold text-white"
        aria-hidden="true"
      >
        U
      </div>
      <h2 className="mt-4 text-xl font-bold">{demoProfile.nickname}님</h2>
      <dl className="my-6 space-y-5 border-y border-zinc-100 py-6 text-sm">
        <div>
          <dt className="text-zinc-500">이메일</dt>
          <dd className="mt-1 break-all font-semibold">{demoProfile.email}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">닉네임</dt>
          <dd className="mt-1 font-semibold">{demoProfile.nickname}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">가입일</dt>
          <dd className="mt-1 font-semibold">
            <time dateTime={demoProfile.joinedAt}>2026년 11월 1일</time>
          </dd>
        </div>
      </dl>
      <Link to="/my/edit" className={`${buttonClassName} block text-center`}>
        내 정보 수정
      </Link>
    </AuthPanel>
  );
}
