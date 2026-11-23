import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMe } from "../../api/members/me";
import { getFavorites } from "../../api/favorites";
import { useAuthStore } from "../../stores/auth-store";

export function MyInfoPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const favoritesQuery = useQuery({
    queryKey: ["favorites", "list"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
  });

  return (
    <main className="mx-auto min-h-[calc(100vh-76px)] w-full max-w-[680px] px-5 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold">내 정보</h1>
          <p className="mt-2 text-sm text-[#7b808b]">내 프로필을 확인해 보세요.</p>
        </div>
        {accessToken && meQuery.isSuccess && (
          <Link className="rounded-lg bg-[#2669ee] px-5 py-3 text-sm font-bold text-white no-underline" to="/my-info/edit">
            수정하기
          </Link>
        )}
      </div>
      <div className="rounded-xl border border-[#e4e7ed] bg-white p-7">
        {!accessToken ? (
          <p>내 정보를 보려면 <Link to="/login">로그인</Link>해 주세요.</p>
        ) : meQuery.isPending ? (
          <p role="status">내 정보를 불러오는 중이에요.</p>
        ) : meQuery.isError ? (
          <p role="alert">내 정보를 불러오지 못했어요.</p>
        ) : (
          <dl className="space-y-6">
            <div>
              <dt className="mb-2 text-xs font-bold text-[#7b808b]">이메일</dt>
              <dd className="text-base font-semibold">{meQuery.data.email}</dd>
            </div>
            <div>
              <dt className="mb-2 text-xs font-bold text-[#7b808b]">닉네임</dt>
              <dd className="text-base font-semibold">{meQuery.data.nickname}</dd>
            </div>
            <div>
              <dt className="mb-2 text-xs font-bold text-[#7b808b]">가입 시각</dt>
              <dd className="text-base">{meQuery.data.createdAt.replace("T", " ").slice(0, 16)}</dd>
            </div>
          </dl>
        )}
      </div>
      <section className="mt-8 rounded-xl border border-[#e4e7ed] bg-white p-7" aria-labelledby="favorites-title">
        <h2 id="favorites-title" className="mb-4 text-xl font-bold">내 즐겨찾기</h2>
        {favoritesQuery.isPending ? (
          <p role="status">즐겨찾기를 불러오는 중이에요.</p>
        ) : favoritesQuery.isError ? (
          <button className="text-[#2669ee]" type="button" onClick={() => void favoritesQuery.refetch()}>즐겨찾기를 불러오지 못했어요. 다시 시도</button>
        ) : favoritesQuery.data.length === 0 ? (
          <p>아직 즐겨찾기한 영화가 없어요.</p>
        ) : (
          <ul className="space-y-3">
            {favoritesQuery.data.map((favorite) => (
              <li key={favorite.movieId}>
                <Link className="text-[#2669ee]" to="/movies/$movieId" params={{ movieId: String(favorite.movieId) }}>
                  {`영화 #${favorite.movieId}`}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
