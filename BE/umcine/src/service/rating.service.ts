import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entity/rating.entity.js';
import { RatingResponseDto } from '../dto/rating-response.dto.js';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async checkRatings(memberId: number): Promise<RatingResponseDto[]> {
    const ratings = await this.ratingRepository.find({
      where: { member: { memberId } },
    });

    if (!ratings.length) {
      throw new NotFoundException('평점을 찾을 수 없습니다.');
    }

    return ratings.map((rating) => RatingResponseDto.from(rating));
  }
}
