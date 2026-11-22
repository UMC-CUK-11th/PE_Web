import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from '../entity/member.entity.js';
import { Rating } from '../entity/rating.entity.js';
import { RatingService } from './rating.service.js';

describe('RatingService', () => {
  let service: RatingService;

  const member = { memberId: 1 };
  const rating = { ratingId: 10, movieId: 550, member, score: 4 };

  const memberRepository = {
    findOneBy: jest.fn<() => Promise<typeof member | null>>(),
  };

  const ratingRepository = {
    findOne: jest.fn<() => Promise<typeof rating | null>>(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        RatingService,
        { provide: getRepositoryToken(Member), useValue: memberRepository },
        { provide: getRepositoryToken(Rating), useValue: ratingRepository },
      ],
    }).compile();

    service = module.get(RatingService);
  });

  it('같은 회원이 같은 영화에 평점을 다시 등록하면 RATING409_1을 반환하고 저장하지 않는다', async () => {
    memberRepository.findOneBy.mockResolvedValue(member);
    ratingRepository.findOne.mockResolvedValue(rating);

    await expect(service.create(1, { movieId: 550, score: 5 }))
      .rejects.toMatchObject({ code: 'RATING409_1' });

    expect(ratingRepository.save).not.toHaveBeenCalled();
  });

  it('다른 회원의 평점을 수정하면 RATING403_1을 반환하고 저장하지 않는다', async () => {
    ratingRepository.findOne.mockResolvedValue(rating);

    await expect(service.update(2, 10, { score: 5 }))
      .rejects.toMatchObject({ code: 'RATING403_1' });

    expect(ratingRepository.save).not.toHaveBeenCalled();
  });
});