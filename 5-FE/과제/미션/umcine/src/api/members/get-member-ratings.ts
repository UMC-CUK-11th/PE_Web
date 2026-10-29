import { umcClient } from "../umc-client";

interface MemberRating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

type GetMemberRatingsResponse = MemberRating[];

function getMemberRatings(memberId: number) {
  return umcClient
    .get(`members/${memberId}/ratings`)
    .json<GetMemberRatingsResponse>();
}

export { getMemberRatings, type GetMemberRatingsResponse, type MemberRating };
