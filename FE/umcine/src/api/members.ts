import { apiClient } from "./api-client";

// Preserve existing /api-test imports while sharing the endpoint functions.
export { checkEmail } from "./members/check-email-duplicate";
export { checkNickname } from "./members/check-nickname-duplicate";
export { signup } from "./members/signup";
export type {
  CheckResponse,
  SignupRequest,
  SignupResponse,
} from "./members/models";
export interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export function getMemberRatings(memberId: number) {
  return apiClient.get(`members/${memberId}/ratings`).json<RatingResponse[]>();
}
