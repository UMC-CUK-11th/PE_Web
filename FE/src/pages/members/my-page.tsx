import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { useFavoritesQuery, useMeQuery, useMyRatingsQuery } from "../../hooks/use-member-queries";
import { apiErrorMessage } from "../../utils/api-error-message";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function MyPage() {
  const me = useMeQuery();
  const favorites = useFavoritesQuery();
  const ratings = useMyRatingsQuery();
  return <main className="mx-auto max-w-[1200px] space-y-10 px-5 py-10">
    <section>
      <h1 className="text-3xl font-bold">마이페이지</h1>
      {me.data && <p className="mt-3">{me.data.nickname}님 · {me.data.email}</p>}
      {me.isError && <p role="alert">{apiErrorMessage(me.error)}</p>}
      <Link to="/me" className="mt-3 inline-block text-red-400 underline">내 정보 보기</Link>
    </section>
    <section><h2 className="mb-5 text-2xl font-bold">내 즐겨찾기</h2>
      {favorites.isLoading ? <p role="status">즐겨찾기를 불러오는 중이에요.</p>
        : favorites.isError ? <p role="alert">{apiErrorMessage(favorites.error)}</p>
        : !favorites.data?.length ? <p>아직 즐겨찾기한 영화가 없어요.</p>
        : <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {favorites.data.map(favorite => <FavoriteCard key={favorite.favoriteId} movieId={favorite.movieId} />)}
        </div>}
    </section>
    <section><h2 className="mb-5 text-2xl font-bold">내 평점</h2>
      {ratings.isLoading ? <p role="status">평점을 불러오는 중이에요.</p>
        : ratings.isError ? <p role="alert">{apiErrorMessage(ratings.error)}</p>
        : !ratings.data?.length ? <p>아직 작성한 평점이 없어요.</p>
        : <div className="space-y-4">{ratings.data.map(rating => <article key={rating.ratingId} className="rounded-xl bg-[#202229] p-5">
          <Link to="/movies/$movieId" params={{ movieId: String(rating.movieId) }} className="font-bold underline">영화 {rating.movieId}</Link>
          <p className="mt-2">{rating.score}점 · {rating.comment || "감상평 없음"}</p>
          <Link to="/movies/$movieId" params={{ movieId: String(rating.movieId) }} className="mt-3 inline-block text-sm text-red-400">평점 수정·삭제</Link>
        </article>)}</div>}
    </section>
  </main>;
}

function FavoriteCard({ movieId }: { movieId: number }) {
  const detail = useQuery({ queryKey: ["movies", "detail", movieId], queryFn: () => getMovieDetail(movieId), retry: false });
  const title = detail.data?.title ?? `영화 ${movieId}`;
  const poster = getTmdbPosterUrl(detail.data?.poster_path ?? null);
  return <article className="relative rounded-xl bg-[#202229] p-3">
    <Link to="/movies/$movieId" params={{ movieId: String(movieId) }}>
      {poster ? <img src={poster} alt={`${title} 포스터`} className="aspect-[2/3] w-full rounded object-cover" />
        : <div className="flex aspect-[2/3] items-center justify-center rounded bg-gray-700">{detail.isLoading ? "불러오는 중" : "포스터 없음"}</div>}
      <h3 className="mt-3 font-bold">{title}</h3>
    </Link>
    <BookmarkButton movieId={movieId} movieTitle={title} className="absolute top-5 right-5" />
  </article>;
}
