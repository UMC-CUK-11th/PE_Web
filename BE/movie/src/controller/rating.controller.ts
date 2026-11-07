import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { RatingService } from "../service/rating.service.js";

@Controller("members")
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(":memberId/ratings")
  findByMember(@Param("memberId", ParseIntPipe) memberId: number) {
    if (!Number.isSafeInteger(memberId) || memberId <= 0) {
      throw new BadRequestException("올바르지 않은 유저 번호입니다.");
    }
    return this.ratingService.findByMember(memberId);
  }
}
