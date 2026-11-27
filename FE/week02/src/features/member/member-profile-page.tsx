"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { favoritesQueryOptions } from "../../api/favorite-query-options";
import { myInfoQueryOptions } from "../../api/member-query-options";
import { adaptTmdbMovieDetails } from "../../api/tmdb-adapter";
import { movieDetailsQueryOptions } from "../../api/movie-query-options";
import { MovieGrid } from "../../components/movie-grid";
import { EmptyState, ErrorState, LoadingState } from "../../components/request-state";

function FavoriteMoviesSection() {
  const favoritesQuery = useQuery(favoritesQueryOptions());
  const movieQueries = useQueries({
    queries: (favoritesQuery.data ?? []).map((favorite) => movieDetailsQueryOptions(favorite.movieId)),
  });
  const movies = movieQueries.flatMap((query) => query.data ? [adaptTmdbMovieDetails(query.data)] : []);
  const isMovieLoading = movieQueries.some((query) => query.isPending);

  return (
    <section className="mt-10" aria-labelledby="favorite-movies-title">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-sm font-bold text-[#2877eb]">FAVORITES</p>
          <h2 className="mt-1 text-2xl font-extrabold" id="favorite-movies-title">내가 찜한 영화</h2>
        </div>
        {favoritesQuery.data && <span className="text-sm text-[#7e8691]">총 {favoritesQuery.data.length}편</span>}
      </div>

      {favoritesQuery.isPending && <LoadingState message="즐겨찾기를 불러오는 중이에요." />}
      {favoritesQuery.isError && <ErrorState error={favoritesQuery.error} onRetry={() => void favoritesQuery.refetch()} />}
      {favoritesQuery.isSuccess && favoritesQuery.data.length === 0 && (
        <EmptyState title="아직 찜한 영화가 없어요." description="영화 상세 화면에서 북마크를 추가해 보세요." />
      )}
      {favoritesQuery.isSuccess && favoritesQuery.data.length > 0 && isMovieLoading && (
        <LoadingState message="영화 정보를 불러오는 중이에요." />
      )}
      {movies.length > 0 && <MovieGrid movies={movies} cardSize="compact" />}
    </section>
  );
}

export function MemberProfilePage() {
  const memberQuery = useQuery(myInfoQueryOptions());

  return (
    <main className="flex-1">
      <div className="mx-auto w-[min(calc(100%-48px),900px)] py-12 pb-24 max-[420px]:w-[calc(100%-32px)]">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#2877eb]">MY PAGE</p>
            <h1 className="mt-2 text-[34px] font-extrabold tracking-[-1.5px]">내 정보</h1>
          </div>
          <Link className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#dce1e7] bg-white px-4 text-sm font-bold text-[#30353b] no-underline" href="/my/edit">
            <img className="size-4" src="/icons/edit.svg" alt="" />
            정보 수정
          </Link>
        </div>

        {memberQuery.isPending && <LoadingState message="회원 정보를 불러오는 중이에요." />}
        {memberQuery.isError && <ErrorState error={memberQuery.error} onRetry={() => void memberQuery.refetch()} />}
        {memberQuery.isSuccess && (
          <section className="overflow-hidden rounded-2xl border border-[#e0e4e9] bg-white shadow-[0_15px_40px_rgba(28,38,54,0.06)]">
            <div className="flex items-center gap-5 border-b border-[#e9ecf0] bg-[#f9fafc] px-9 py-8 max-sm:px-6">
              <div className="grid size-20 shrink-0 place-items-center rounded-full bg-[#e9f2ff]">
                <img className="size-9" src="/icons/person.svg" alt="" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-2xl font-extrabold">{memberQuery.data.nickname}</h2>
                <p className="mt-1 truncate text-sm text-[#7e8691]">{memberQuery.data.email}</p>
              </div>
            </div>

            <dl className="px-9 py-3 max-sm:px-6">
              <div className="grid grid-cols-[150px_1fr] border-b border-[#eceff2] py-6 max-sm:grid-cols-1 max-sm:gap-2">
                <dt className="text-sm font-bold text-[#747c87]">이메일</dt>
                <dd className="m-0 text-sm font-semibold">{memberQuery.data.email}</dd>
              </div>
              <div className="grid grid-cols-[150px_1fr] border-b border-[#eceff2] py-6 max-sm:grid-cols-1 max-sm:gap-2">
                <dt className="text-sm font-bold text-[#747c87]">닉네임</dt>
                <dd className="m-0 text-sm font-semibold">{memberQuery.data.nickname}</dd>
              </div>
              <div className="grid grid-cols-[150px_1fr] py-6 max-sm:grid-cols-1 max-sm:gap-2">
                <dt className="text-sm font-bold text-[#747c87]">가입일</dt>
                <dd className="m-0 text-sm text-[#535b65]">{new Date(memberQuery.data.createdAt).toLocaleDateString("ko-KR")}</dd>
              </div>
            </dl>
          </section>
        )}

        <FavoriteMoviesSection />
      </div>
    </main>
  );
}
