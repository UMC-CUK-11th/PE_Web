import type { Movie } from "../types/movie";
import type { TmdbMovieDetails, TmdbMovieSummary } from "../types/tmdb";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const genreNames: Record<number, string> = {
  12: "모험",
  14: "판타지",
  16: "애니메이션",
  18: "드라마",
  27: "공포",
  28: "액션",
  35: "코미디",
  36: "역사",
  37: "서부",
  53: "스릴러",
  80: "범죄",
  99: "다큐멘터리",
  878: "SF",
  9648: "미스터리",
  10402: "음악",
  10749: "로맨스",
  10751: "가족",
  10752: "전쟁",
  10770: "TV 영화",
};

function createImageUrl(path: string | null, size: "w500" | "w1280") {
  if (!path) return "/icons/movie.svg";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

function formatReleaseDate(releaseDate: string) {
  return releaseDate ? releaseDate.replaceAll("-", ".") : "개봉일 미정";
}

function formatRuntime(runtime: number | null) {
  if (!runtime) return "상영 시간 미정";
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
}

export function adaptTmdbMovie(movie: TmdbMovieSummary): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: formatReleaseDate(movie.release_date),
    posterPath: createImageUrl(movie.poster_path, "w500"),
    backdropPath: createImageUrl(movie.backdrop_path, "w1280"),
    genres: movie.genre_ids.map((genreId) => genreNames[genreId] ?? "기타"),
    runtime: "상영 시간 미정",
    tagline: "영화 정보를 확인해 보세요.",
    overview: movie.overview || "등록된 줄거리가 없습니다.",
    isBookmarked: false,
  };
}

export function adaptTmdbMovieDetails(movie: TmdbMovieDetails): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: formatReleaseDate(movie.release_date),
    posterPath: createImageUrl(movie.poster_path, "w500"),
    backdropPath: createImageUrl(movie.backdrop_path, "w1280"),
    genres: movie.genres.map((genre) => genre.name),
    runtime: formatRuntime(movie.runtime),
    tagline: movie.tagline || "영화 정보를 확인해 보세요.",
    overview: movie.overview || "등록된 줄거리가 없습니다.",
    isBookmarked: false,
  };
}
