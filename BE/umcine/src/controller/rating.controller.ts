import { Controller, Get, Param } from '@nestjs/common';
import { RatingService } from '../service/rating.service.js';

@Controller('members')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get('/:memberId/ratings')
  checkNickname(@Param('memberId') memberId: number) {
    return this.ratingService.checkRatings(memberId);
  }
}
