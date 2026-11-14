import { Link } from "@tanstack/react-router";
import AuthPanel from "../../components/auth/auth-panel";
import { buttonClassName } from "../../components/auth/form-styles";
import RequestStatus from "../../components/movies/request-status";
import { useMemberInfo } from "../../hooks/use-member-info";
import { getRequestErrorMessage } from "../../utils/auth/request-error";

export function MyPage() {
  const member = useMemberInfo();
  const profile = member.data;

  return (
    <AuthPanel
      title="내 정보"
      description="나의 프로필을 확인하고, 영화 속 나만의 취향을 채워보세요."
    >
      {profile ? (
        <>
          <div
            className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-950 text-2xl font-bold text-white"
            aria-hidden="true"
          >
            {profile.nickname.slice(0, 1)}
          </div>
          <h2 className="mt-4 text-xl font-bold">{profile.nickname}님</h2>
          <dl className="my-6 space-y-5 border-y border-zinc-100 py-6 text-sm">
            <div>
              <dt className="text-zinc-500">이메일</dt>
              <dd className="mt-1 break-all font-semibold">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">닉네임</dt>
              <dd className="mt-1 font-semibold">{profile.nickname}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">가입일</dt>
              <dd className="mt-1 font-semibold">
                <time dateTime={profile.createdAt}>
                  {new Date(profile.createdAt).toLocaleDateString("ko-KR")}
                </time>
              </dd>
            </div>
          </dl>
          <Link
            to="/my/edit"
            className={`${buttonClassName} block text-center`}
          >
            내 정보 수정
          </Link>
        </>
      ) : (
        <RequestStatus
          loading={member.isLoading}
          loadingMessage="회원 정보를 불러오는 중이에요…"
          error={
            member.isError
              ? getRequestErrorMessage(
                  member.error,
                  "회원 정보를 불러오지 못했어요.",
                )
              : undefined
          }
          onRetry={() => void member.refetch()}
        />
      )}
    </AuthPanel>
  );
}
