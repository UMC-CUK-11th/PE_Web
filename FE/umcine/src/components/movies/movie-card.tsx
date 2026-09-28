import { movies } from "../../data/movies";
import { Link, useParams } from "@tanstack/react-router";

export function MovieCard() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return <main>영화를 찾을 수 없어요.</main>;
  }
  return (
    <section className="w-full m-0 p-0 bg-[##F6F7F9]">
      <div className="relative w-full h-90 p-0 overflow-hidden bg-[#222]">
        <div
          id="movie-card-container"
          className="relative z-[2] w-full h-full px-20 box-border max-[900px]:px-10"
        >
          <Link
            to="/"
            id="movie-card-header-action"
            className="absolute top-[25px] left-20 flex items-center w-auto h-4 p-0 text-white text-[13px] font-bold max-[900px]:left-10"
          >
            <img
              src="/icons/movie-icons/chevron-left.svg"
              alt="back"
              className="w-6 h-6 invert"
            />
            영화 목록
          </Link>

          <div
            id="movie-card-header-info"
            className="absolute left-20 bottom-5 flex flex-col gap-[7px] w-200 text-white text-left max-[900px]:left-10 max-[700px]:w-[calc(100%-80px)]"
          >
            <h2 className="text-[32px] font-bold leading-[1.3] max-[700px]:text-[25px]">
              {movie.title}
            </h2>
            <p className="text-[14px]">{movie.originalTitle}</p>
            <p className="text-[13px] font-semibold">{movie.releaseDate}</p>
          </div>
        </div>

        <img
          src={movie.backdropPath}
          alt=""
          id="movie-backdrop"
          className="absolute top-0 left-0 z-0 w-full h-full object-cover object-center"
        />
      </div>

      <section
        id="movie-card-contents"
        className="flex w-full min-h-129 px-20 pt-[22px] pb-10 box-border bg-[#f8f9fa] max-[900px]:px-10 max-[700px]:flex-col"
      >
        <div
          id="movie-card-detail"
          className="flex flex-1 gap-[30px] pr-[30px] box-border max-[900px]:gap-5 max-[700px]:pr-0"
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="w-[181px] h-[259px] shrink-0 object-cover rounded-[9px] shadow-[0_12px_25px_rgba(0,0,0,0.15)]"
          />

          <div className="max-w-[600px] text-left">
            <p className="max-w-[600px] text-[13px] leading-[1.8] text-[#69707d]">
              {movie.genres.join(" · ")}
            </p>
            <p className="max-w-[600px] text-[13px] leading-[1.8] text-[#69707d]">
              {movie.runtime}
            </p>
            <h2 className="mb-3 text-[20px] font-bold text-[#17191c]">
              {movie.tagline}
            </h2>
            <p className="max-w-[600px] text-[13px] leading-[1.8] text-[#69707d]">
              {movie.overview}
            </p>

            <button
              id="bookmark-button"
              className="w-4 h-4 mr-[6px] brightness-0 invert"
            >
              <img src="/icons/movie-icons/bookmark.svg" alt="" />
              즐겨찾기
            </button>
          </div>
        </div>

        <div
          id="movie-card-rating"
          className="w-[325px] shrink-0 pl-7 border-l border-[#e1e4e8] box-border text-left max-[900px]:w-[280px] max-[700px]:w-full max-[700px]:mt-[30px] max-[700px]:pl-0 max-[700px]:pt-[25px] max-[700px]:border-l-0 max-[700px]:border-t"
        >
          <h2 className="text-[18px] font-bold text-[#17191c]">내 평점</h2>
          <p className="mt-[7px] text-[11px] text-[#9aa0aa]">
            별점은 필수, 후기는 선택이에요.
          </p>

          <div id="star-list" className="flex gap-[5px] mt-2">
            <button className="flex items-center justify-center w-[35px] h-[35px] p-0 border border-[#dfe3e8] rounded-[6px] bg-white text-[#687180] text-[22px] cursor-pointer">
              ★
            </button>
            <button className="flex items-center justify-center w-[35px] h-[35px] p-0 border border-[#dfe3e8] rounded-[6px] bg-white text-[#687180] text-[22px] cursor-pointer">
              ★
            </button>
            <button className="flex items-center justify-center w-[35px] h-[35px] p-0 border border-[#dfe3e8] rounded-[6px] bg-white text-[#687180] text-[22px] cursor-pointer">
              ★
            </button>
            <button className="flex items-center justify-center w-[35px] h-[35px] p-0 border border-[#dfe3e8] rounded-[6px] bg-white text-[#687180] text-[22px] cursor-pointer">
              ★
            </button>
            <button className="flex items-center justify-center w-[35px] h-[35px] p-0 border border-[#dfe3e8] rounded-[6px] bg-white text-[#687180] text-[22px] cursor-pointer">
              ★
            </button>
          </div>

          <textarea
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="block w-full h-[91px] mt-2 p-3 box-border resize-none border border-[#dfe3e8] rounded-[6px] bg-white text-[11px] outline-none placeholder:text-[#a3a9b3]"
          />

          <button
            id="rating-save-button"
            className="w-full h-[37px] mt-[9px] border-none rounded-[6px] bg-[#17191c] text-white text-xs font-bold cursor-pointer"
          >
            평점 저장
          </button>
        </div>
      </section>

      <section
        id="movie-card-review"
        className="min-h-[100px] border-t border-[#e5e7eb] bg-[#f8f9fa]"
      ></section>
    </section>
  );
}
