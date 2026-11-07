import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Member } from "../entity/member.entity.js";
import { Rating } from "../entity/rating.entity.js";
import { RatingResponseDto } from "../dto/rating-response.dto.js";

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async findByMember(memberId: number): Promise<RatingResponseDto[]> {
    const id = String(memberId);
    if (!(await this.memberRepository.exists({ where: { memberId: id } }))) {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }
    const ratings = await this.ratingRepository.find({
      where: { member: { memberId: id } },
      order: { ratingId: "DESC" },
    });
    return ratings.map(RatingResponseDto.from);
  }
}
