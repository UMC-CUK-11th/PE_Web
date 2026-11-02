import ky from "ky";

const client = ky.create({
  baseUrl: (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080") + "/",
});

export interface AvailabilityResponse { available: boolean }
export interface MemberRating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export function checkNickname(nickname: string) {
  return client.get("members/nickname/" + encodeURIComponent(nickname)).json<AvailabilityResponse>();
}
export function checkEmail(email: string) {
  return client.get("members/email/" + encodeURIComponent(email)).json<AvailabilityResponse>();
}
export function getMemberRatings(memberId: number) {
  return client.get("members/" + memberId + "/ratings").json<MemberRating[]>();
}
