import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
//4주차 코드 추가
import { BookmarkButton } from "../../components/bookmark-button";


export function MovieDetailPage() {
  // /movies/$movieId의 동적 path param 값을 읽는다.
  const { movieId } = useParams({ from: "/movies/$movieId" });

  // URL에서 받은 movieId는 문자열이므로 숫자로 바꾼 뒤 영화 id와 비교한다.
  const movie = movies.find((item) => item.id === Number(movieId));

  // 존재하지 않는 영화 id가 들어와도 오류 대신 안내 문구를 보여준다.
  if (!movie) {
    return (
      <main className="mx-auto w-full max-w-[1180px] px-6 py-8">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f5f6f8] pb-12">
      {/* Figma의 상단 배경 영역 */}
      <section className="relative flex min-h-[330px] items-end overflow-hidden bg-[#182124] text-white">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />

        {/* 배경 이미지 위의 글자가 잘 보이도록 어두운 레이어를 덧씌운다. */}
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative mx-auto w-full max-w-[1180px] px-6 pb-10">
          <Link
            className="mb-5 inline-block text-[13px] text-white no-underline"
            to="/"
          >
            ← 영화 목록
          </Link>

          <p className="mb-2 text-[13px] text-white/80">
            {movie.originalTitle}
          </p>
          <h1 className="m-0 text-[36px] font-bold">{movie.title}</h1>
          <p className="mb-0 mt-3 text-[12px] text-white/85">
            {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}
          </p>
        </div>
      </section>

      {/* 포스터와 영화 설명 영역 */}
      <section className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-7 px-6 py-8 md:grid-cols-[180px_minmax(0,1fr)]">
        <img
          className="aspect-[2/3] w-[180px] rounded-[6px] object-cover"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />

        <div className="min-w-0">
          <h2 className="mb-3 mt-0 text-[18px] font-semibold text-[#24272e]">
            {movie.tagline}
          </h2>
          <p className="m-0 text-[13px] leading-6 text-[#6e737d]">
            {movie.overview}
          </p>
          {/* 4주차 미션 코드 추가 */}
          <BookmarkButton movieId={movie.id} />

          <div className="mt-6 grid grid-cols-1 gap-4 text-[12px] sm:grid-cols-3">
            <div>
              <p className="m-0 text-[#9296a0]">개봉일</p>
              <p className="mb-0 mt-1 text-[#373a42]">{movie.releaseDate}</p>
            </div>
            <div>
              <p className="m-0 text-[#9296a0]">장르</p>
              <p className="mb-0 mt-1 text-[#373a42]">
                {movie.genres.join(" · ")}
              </p>
            </div>
            <div>
              <p className="m-0 text-[#9296a0]">상영 시간</p>
              <p className="mb-0 mt-1 text-[#373a42]">{movie.runtime}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
