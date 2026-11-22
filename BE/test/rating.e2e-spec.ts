import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import type { Repository } from 'typeorm';
import { RatingController } from '../src/controller/rating.controller.js';
import { Member } from '../src/entity/member.entity.js';
import { Rating } from '../src/entity/rating.entity.js';
import { HttpExceptionFilter } from '../src/filter/http-exception.filter.js';
import { AuthGuard } from '../src/guard/auth.guard.js';
import { RatingService } from '../src/service/rating.service.js';

describe('평점 등록 API 통합 테스트', () => {
  let app: INestApplication;
  let authorization: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqljs',
          entities: [Member, Rating],
          synchronize: true,
          autoSave: false,
        }),
        TypeOrmModule.forFeature([Member, Rating]),
        JwtModule.register({ secret: 'rating-e2e-test-only' }),
      ],
      controllers: [RatingController],
      providers: [RatingService, AuthGuard],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    const members = module.get<Repository<Member>>(getRepositoryToken(Member));
    const member = await members.save(
      members.create({
        email: 'rating-test@example.com',
        password: 'unused-test-password',
        nickname: '평점테스터',
      }),
    );

    const token = module.get(JwtService).sign({
      sub: String(member.memberId),
      email: member.email,
    });
    authorization = `Bearer ${token}`;
  });

  afterAll(async () => {
    await app?.close();
  });

  it('토큰 없이 POST /ratings를 호출하면 401과 AUTH401_2를 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/ratings')
      .send({ movieId: 550, score: 4 })
      .expect(401);

    expect(response.body.code).toBe('AUTH401_2');
  });

  it('유효한 토큰으로 POST /ratings를 호출하면 201과 등록한 평점을 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/ratings')
      .set('Authorization', authorization)
      .send({ movieId: 550, score: 4 })
      .expect(201);

    expect(response.body.code).toBe('COMMON201');
    expect(response.body.result).toMatchObject({ movieId: 550, score: 4 });
  });
});