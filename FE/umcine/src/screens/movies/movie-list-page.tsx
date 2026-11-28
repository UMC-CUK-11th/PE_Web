
"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { movieListQueryOptions } from "../../queries/movie-query-options";
import RequestStatus from "../../components/movies/request-status";
import CardSizeControl from "../../components/movies/card-size-control";
import MovieGrid from "../../components/movies/movie-grid";
import MovieGridSkeleton from "../../components/movies/movie-grid-skeleton";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="min-h-screen bg-[#0b1120] pb-20 pt-8">
      <section className="mx-auto mb-12 max-w-6xl px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] border border-blue-400/15 bg-gradient-to-br from-[#172554] via-[#14213d] to-[#0b1120] px-7 py-14 shadow-xl sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"
          />

          <div className="relative z-10 max-w-2xl">
            <p className="mb-5 inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-xs font-bold tracking-widest text-blue-300">
              YOUR PERSONAL CINEMA
            </p>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              오늘은 어떤
              <br />
              <span className="text-blue-400">영화</span>를 만나볼까요?
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
              새로운 영화를 발견하고, 좋아하는 작품을 저장하고,
              나만의 평점을 남겨보세요.
              당신만의 영화 취향이 완성되는 공간, UMCine.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#movie-list"
                className="rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
              >
                영화 둘러보기
              </a>

              <Link
                href="/search"
                className="rounded-xl border border-slate-500/60 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                영화 검색하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="movie-list"
        className="mx-auto mb-6 max-w-6xl scroll-mt-28 px-5 lg:px-8"
      >
        <p className="mb-2 text-xs font-bold tracking-[0.2em] text-blue-400">
          DISCOVER MOVIES
        </p>

        <h2 className="text-3xl font-black tracking-tight text-white">
          영화 둘러보기
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          새로운 작품을 발견하고 나만의 영화 목록을 만들어 보세요.
        </p>
      </section>

      <CardSizeControl />

      <MovieListResults
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}

function MovieListResults({
  currentPage,
  onPageChange,
}: {
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery(movieListQueryOptions(currentPage));

  const errorMessage = isError
    ? error.message === "TMDB 환경 변수가 필요해요."
      ? error.message
      : "영화 목록을 불러오지 못했어요."
    : undefined;

  if (isPending) {
    return <MovieGridSkeleton />;
  }

  if (isError) {
    return (
      <RequestStatus
        error={errorMessage}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (!data?.results.length) {
    return (
      <div
        role="status"
        className="mx-5 my-10 flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-[#162238] p-10 text-center sm:mx-auto sm:max-w-3xl"
      >
        <div aria-hidden="true" className="mb-4 text-5xl">
          🎬
        </div>

        <h3 className="text-xl font-bold text-white">
          표시할 영화가 없어요
        </h3>

        <p className="mt-3 text-sm text-slate-400">
          잠시 후 다시 확인해 주세요.
        </p>
      </div>
    );
  }

  return (
    <>
      <MovieGrid movies={data.results} />

      <Pagination
        currentPage={data.page}
        totalPages={data.total_pages}
        onPageChange={onPageChange}
      />
    </>
  );
}
