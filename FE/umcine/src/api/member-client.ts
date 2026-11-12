import { apiRequest } from "./api-client";

export { ApiError as MemberApiError } from "./api-client";
export { checkEmailDuplicate as checkEmail } from "./members/check-email-duplicate";
export { checkNicknameDuplicate as checkNickname } from "./members/check-nickname-duplicate";

export type CheckResponse = { available: boolean };
export type RatingResponse = {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};

export const getMemberRatings = (memberId: string) =>
  apiRequest<RatingResponse[]>(`members/${encodeURIComponent(memberId)}/ratings`);
