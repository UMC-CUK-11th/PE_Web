import { InternalServerErrorException } from "@nestjs/common";
import { Rating } from "../entity/rating.entity.js";

function toSafeId(value: string): number {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new InternalServerErrorException(
      "식별자가 지원 범위를 벗어났습니다.",
    );
  }
  return id;
}

export class RatingResponseDto {
  ratingId!: number;
  movieId!: number;
  score!: number;
  comment!: string | null;
  createdAt!: Date;
  updatedAt!: Date;

  static from(rating: Rating): RatingResponseDto {
    return Object.assign(new RatingResponseDto(), {
      ratingId: toSafeId(rating.ratingId),
      movieId: toSafeId(rating.movieId),
      score: rating.score,
      comment: rating.comment,
      createdAt: rating.createdAt,
      updatedAt: rating.updatedAt,
    });
  }
}
