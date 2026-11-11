import { describe, it, expect, vi } from 'vitest';
import { HttpStatus, type ExecutionContext } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import type { Repository } from 'typeorm';
import { AuthGuard } from '../guard/auth.guard.js';
import { RatingService } from './rating.service.js';
import { ApiException } from '../exception/api.exception.js';
import type { Rating } from '../entity/rating.entity.js';
import type { Member } from '../entity/member.entity.js';

async function expectApiError(operation: Promise<unknown>, status: number, code: string) {
  const error: unknown = await operation.catch((caught: unknown) => caught);
  expect(error).toBeInstanceOf(ApiException);
  if (!(error instanceof ApiException)) throw new Error('Expected ApiException');
  expect(error.getStatus()).toBe(status);
  expect(error.code).toBe(code);
}

function createContext(authorization?: string) {
  const request = { headers: { authorization } };
  const context = { switchToHttp: () => ({ getRequest: () => request }) } as unknown as ExecutionContext;
  return { context, request };
}

describe('평점 API 인증과 소유권 검사', () => {
  it('토큰이 없으면 401로 거절한다', async () => {
    const jwt = { verifyAsync: vi.fn() };
    const guard = new AuthGuard(jwt as unknown as JwtService);
    await expectApiError(guard.canActivate(createContext().context), HttpStatus.UNAUTHORIZED, 'AUTH401_2');
    expect(jwt.verifyAsync).not.toHaveBeenCalled();
  });

  it('잘못된 토큰은 401로 거절한다', async () => {
    const jwt = { verifyAsync: vi.fn().mockRejectedValue(new Error('invalid signature')) };
    const guard = new AuthGuard(jwt as unknown as JwtService);
    await expectApiError(guard.canActivate(createContext('Bearer invalid').context), HttpStatus.UNAUTHORIZED, 'AUTH401_3');
  });

  it('만료된 토큰은 만료 코드와 401을 반환한다', async () => {
    const jwt = { verifyAsync: vi.fn().mockRejectedValue(new TokenExpiredError('expired', new Date())) };
    const guard = new AuthGuard(jwt as unknown as JwtService);
    await expectApiError(guard.canActivate(createContext('Bearer expired').context), HttpStatus.UNAUTHORIZED, 'AUTH401_4');
  });

  for (const action of ['update', 'delete'] as const) {
    it(action + ': 없는 평점은 404로 거절한다', async () => {
      const repository = { findOne: vi.fn().mockResolvedValue(null), save: vi.fn(), remove: vi.fn() };
      const service = new RatingService(repository as unknown as Repository<Rating>, {} as Repository<Member>);
      const operation = action === 'update' ? service.update(1, 99, { score: 4 }) : service.delete(1, 99);
      await expectApiError(operation, HttpStatus.NOT_FOUND, 'RATING404_1');
      expect(repository.save).not.toHaveBeenCalled();
      expect(repository.remove).not.toHaveBeenCalled();
    });

    it(action + ': 다른 회원의 평점은 403으로 거절하고 변경하지 않는다', async () => {
      const repository = {
        findOne: vi.fn().mockResolvedValue({ ratingId: 11, member: { memberId: 2 }, score: 3 }),
        save: vi.fn(), remove: vi.fn(),
      };
      const service = new RatingService(repository as unknown as Repository<Rating>, {} as Repository<Member>);
      const operation = action === 'update' ? service.update(1, 11, { score: 4 }) : service.delete(1, 11);
      await expectApiError(operation, HttpStatus.FORBIDDEN, 'RATING403_1');
      expect(repository.save).not.toHaveBeenCalled();
      expect(repository.remove).not.toHaveBeenCalled();
    });
  }

  it('본인 평점 수정은 소유권 확인 후 저장한다', async () => {
    const rating = { ratingId: 11, movieId: 5, member: { memberId: 1 }, score: 3, comment: null };
    const repository = { findOne: vi.fn().mockResolvedValue(rating), save: vi.fn().mockImplementation((value: unknown) => value) };
    const service = new RatingService(repository as unknown as Repository<Rating>, {} as Repository<Member>);
    const result = await service.update(1, 11, { score: 4, comment: '수정한 후기' });
    expect(result.score).toBe(4);
    expect(result.comment).toBe('수정한 후기');
    expect(repository.findOne).toHaveBeenCalledWith({ where: { ratingId: 11 }, relations: { member: true } });
  });
});
