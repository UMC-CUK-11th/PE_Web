// Next.js는 NEXT_PUBLIC_으로 시작하는 환경변수만 브라우저 코드에 넣어 줌
// process.env.NEXT_PUBLIC_XXX 처럼 이름을 그대로 적어야 빌드할 때 값으로 바뀜
export const TMDB_BASE_URL = (process.env.NEXT_PUBLIC_TMDB_API_BASE_URL?.trim() || "https://api.themoviedb.org/3").replace(/\/+$/, "") + "/";
export function getTmdbToken(): string {
  const token = process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN?.trim();
  if (!token) throw new Error("TMDB 토큰이 없어요. FE/.env.local에 NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN을 설정해 주세요.");
  return token;
}
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:8080").replace(/\/+$/, "") + "/";
