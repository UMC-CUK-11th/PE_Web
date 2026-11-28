"use client";

import Link from "next/link";
import AuthPanel from "../../components/auth/auth-panel";
import { buttonClassName } from "../../components/auth/form-styles";
import RequestStatus from "../../components/movies/request-status";
import { useFavorites } from "../../hooks/use-favorite";
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
            href="/my/edit"
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
      <FavoritesList />
    </AuthPanel>
  );
}

function FavoritesList() {
  const favorites = useFavorites();
  return (
    <section
      id="favorites"
      className="mt-8 scroll-mt-28 border-t border-zinc-100 pt-6"
    >
      <h2 className="text-lg font-bold">즐겨찾기</h2>
      {favorites.data ? (
        favorites.data.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">
            아직 즐겨찾기한 영화가 없어요.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-zinc-100">
            {favorites.data.map(({ favoriteId, movieId, createdAt }) => (
              <li key={favoriteId}>
                <Link
                  href={`/movies/${movieId}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg px-2 py-3 text-sm hover:bg-zinc-50"
                >
                  <span className="font-semibold">영화 #{movieId}</span>
                  <time dateTime={createdAt} className="text-xs text-zinc-500">
                    {new Date(createdAt).toLocaleDateString("ko-KR")}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        )
      ) : (
        <RequestStatus
          loading={favorites.isLoading}
          loadingMessage="즐겨찾기를 불러오는 중이에요…"
          error={
            favorites.isError
              ? getRequestErrorMessage(
                  favorites.error,
                  "즐겨찾기 목록을 불러오지 못했어요.",
                )
              : undefined
          }
          onRetry={() => void favorites.refetch()}
        />
      )}
    </section>
  );
}
