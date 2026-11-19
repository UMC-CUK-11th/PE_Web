import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { favoritesOptions, meOptions, ratingsOptions } from "../../api/private-query-options";
import { movieDetailOptions } from "../../api/movies/movie-query-options";
import { BookmarkButton } from "../../components/bookmark-button";
import { useAuthStore } from "../../stores/auth-store";
import { memberErrorMessage } from "../../api/api-client";

function FavoriteMovie({ movieId }: { movieId: number }) {
  const movie = useQuery({ ...movieDetailOptions(movieId), retry: false });
  const title = movie.data?.title ?? `영화 #${movieId}`;
  return <article className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4"><Link to="/movies/$movieId" params={{ movieId: String(movieId) }} className="font-bold text-slate-800 hover:text-blue-700">{title}</Link><BookmarkButton movieId={movieId} movieTitle={title} variant="search" /></article>;
}

export function ProfilePage() {
  const me = useQuery(meOptions());
  const session = useAuthStore((state) => state.sessionVersion);
  const favorites = useQuery(favoritesOptions(session));
  const ratings = useQuery(ratingsOptions(session, me.data?.memberId ?? 0));
  if (!me.data) return null;
  const { nickname, email, createdAt } = me.data;
  return <main className="mx-auto min-h-[calc(100vh-160px)] max-w-4xl px-4 py-8 md:px-8 md:py-12">
    <p className="text-xs font-bold tracking-widest text-blue-600">MY UMCINE</p><h1 className="mt-3 text-3xl font-extrabold">내 정보</h1>
    <section aria-label="프로필 정보" className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="break-words text-xl font-bold">{nickname}</h2><dl className="mt-5 space-y-4 text-sm"><div><dt className="text-slate-500">이메일</dt><dd className="mt-1 break-all">{email}</dd></div><div><dt className="text-slate-500">가입일</dt><dd className="mt-1">{createdAt.slice(0, 10)}</dd></div></dl>
      <Link to="/mypage/edit" className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">내 정보 수정</Link>
    </section>
    <section className="mt-8" aria-label="즐겨찾기 목록"><h2 className="mb-4 text-xl font-bold">즐겨찾기</h2>
      {favorites.isLoading ? <p role="status">즐겨찾기를 불러오는 중이에요.</p> : favorites.isError ? <div role="alert">{memberErrorMessage(favorites.error)}<button onClick={() => void favorites.refetch()} className="ml-3 text-blue-700">다시 시도</button></div>
        : favorites.data?.length === 0 ? <p className="rounded-xl bg-white p-6 text-sm text-slate-500">아직 즐겨찾기한 영화가 없어요.</p> : <div className="grid gap-3">{favorites.data?.map((item) => <FavoriteMovie key={item.favoriteId} movieId={item.movieId} />)}</div>}
    </section>
    <section className="mt-8" aria-label="내 평점 목록"><h2 className="mb-4 text-xl font-bold">내 평점</h2>
      {ratings.isLoading ? <p role="status">평점을 불러오는 중이에요.</p> : ratings.isError ? <div role="alert">{memberErrorMessage(ratings.error)}<button onClick={() => void ratings.refetch()} className="ml-3 text-blue-700">다시 시도</button></div>
        : ratings.data?.length === 0 ? <p className="rounded-xl bg-white p-6 text-sm text-slate-500">아직 남긴 평점이 없어요.</p> : <div className="grid gap-3">{ratings.data?.map((item) => <article key={item.ratingId} className="rounded-xl border border-slate-200 bg-white p-5"><Link to="/movies/$movieId" params={{ movieId: String(item.movieId) }} className="font-bold text-blue-700">영화 #{item.movieId}</Link><p className="mt-2 font-bold">★ {item.score} / 5</p><p className="mt-2 whitespace-pre-wrap break-words text-sm">{item.comment || "작성한 후기가 없어요."}</p></article>)}</div>}
    </section>
  </main>;
}
