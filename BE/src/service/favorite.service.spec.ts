import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Favorite } from '../entity/favorite.entity.js';
import { Member } from '../entity/member.entity.js';
import { FavoriteService } from './favorite.service.js';

describe('FavoriteService', () => {
  let service: FavoriteService;

  const member = { memberId: 1, nickname: '영화조아' };
  const favorite = { member, movieId: 550 };
  const savedFavorite = {
    favoriteId: 1,
    movieId: 550,
    createdAt: new Date('2026-11-22T00:00:00.000Z'),
  };

  const memberRepository = {
    findOneBy: jest.fn<() => Promise<typeof member | null>>(),
  };
  const favoriteRepository = {
    findOne: jest.fn<() => Promise<typeof savedFavorite | null>>(),
    create: jest.fn<() => typeof favorite>(),
    save: jest.fn<(value: typeof favorite) => Promise<typeof savedFavorite>>(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        FavoriteService,
        { provide: getRepositoryToken(Member), useValue: memberRepository },
        { provide: getRepositoryToken(Favorite), useValue: favoriteRepository },
      ],
    }).compile();

    service = module.get(FavoriteService);
    memberRepository.findOneBy.mockResolvedValue(member);
  });

  it('처음 등록하는 영화는 즐겨찾기에 저장한다', async () => {
    favoriteRepository.findOne.mockResolvedValue(null);
    favoriteRepository.create.mockReturnValue(favorite);
    favoriteRepository.save.mockResolvedValue(savedFavorite);

    const result = await service.create(1, { movieId: 550 });

    expect(result.movieId).toBe(550);
    expect(favoriteRepository.save).toHaveBeenCalledTimes(1);
    expect(favoriteRepository.save).toHaveBeenCalledWith(favorite);
  });

  it('이미 등록한 영화는 FAVORITE409_1 예외를 던지고 저장하지 않는다', async () => {
    favoriteRepository.findOne.mockResolvedValue(savedFavorite);

    await expect(service.create(1, { movieId: 550 })).rejects.toMatchObject({
      code: 'FAVORITE409_1',
    });
    expect(favoriteRepository.save).not.toHaveBeenCalled();
  });
});