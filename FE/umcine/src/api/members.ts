import ky from "ky";

const backendClient = ky.create({
  baseUrl: `${(import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:3000").replace(/\/+$/, "")}/`,
  retry: 0,
});

export interface CheckResponse {
  available: boolean;
}
export interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export function checkNickname(nickname: string) {
  return backendClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckResponse>();
}
export function checkEmail(email: string) {
  return backendClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckResponse>();
}
export function getMemberRatings(memberId: number) {
  return backendClient
    .get(`members/${memberId}/ratings`)
    .json<RatingResponse[]>();
}
