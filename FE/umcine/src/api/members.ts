import { apiClient } from "./api-client";

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
  return apiClient.get("members/nickname/" + encodeURIComponent(nickname)).json<AvailabilityResponse>();
}
export function checkEmail(email: string) {
  return apiClient.get("members/email/" + encodeURIComponent(email)).json<AvailabilityResponse>();
}
export function getMemberRatings(memberId: number) {
  return apiClient.get("members/" + memberId + "/ratings").json<MemberRating[]>();
}
