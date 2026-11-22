import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import type { Repository } from 'typeorm';
import { FavoriteController } from '../src/controller/favorite.controller.js';
import { Favorite } from '../src/entity/favorite.entity.js';
import { Member } from '../src/entity/member.entity.js';
import { HttpExceptionFilter } from '../src/filter/http-exception.filter.js';
import { AuthGuard } from '../src/guard/auth.guard.js';
import { FavoriteService } from '../src/service/favorite.service.js';

describe('즐겨찾기 API 통합 테스트', () => {
  let app: INestApplication;
  let favoriteRepository: Repository<Favorite>;
  let authorization: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqljs',
          autoSave: false,
          entities: [Member, Favorite],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Member, Favorite]),
        JwtModule.register({ secret: 'test-secret-for-e2e-only' }),
      ],
      controllers: [FavoriteController],
      providers: [FavoriteService, AuthGuard],
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

    const memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
    favoriteRepository = module.get<Repository<Favorite>>(getRepositoryToken(Favorite));

    const member = await memberRepository.save(
      memberRepository.create({
        email: 'week9@example.com',
        password: 'unused-test-password',
        nickname: '영화조아',
      }),
    );

    const token = module.get(JwtService).sign({
      sub: String(member.memberId),
      email: member.email,
    });
    authorization = `Bearer ${token}`;
  });

  beforeEach(async () => {
    await favoriteRepository.clear();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('토큰 없이 등록하면 401과 AUTH401_2를 반환한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/favorites')
      .send({ movieId: 550 })
      .expect(401);

    expect(response.body.code).toBe('AUTH401_2');
  });

  it('토큰과 영화 ID로 등록하면 201과 영화 ID를 반환한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/favorites')
      .set('Authorization', authorization)
      .send({ movieId: 550 })
      .expect(201);

    expect(response.body.code).toBe('COMMON201');
    expect(response.body.result.movieId).toBe(550);
  });

  it('같은 영화를 다시 등록하면 409와 FAVORITE409_1을 반환한다', async () => {
    const registerFavorite = () =>
      request(app.getHttpServer())
        .post('/favorites')
        .set('Authorization', authorization)
        .send({ movieId: 550 });

    await registerFavorite().expect(201);
    const response = await registerFavorite().expect(409);

    expect(response.body.code).toBe('FAVORITE409_1');
  });

  it('등록하지 않은 영화는 200과 isFavorite: false를 반환한다', async () => {
    const response = await request(app.getHttpServer())
      .get('/favorites/550')
      .set('Authorization', authorization)
      .expect(200);

    expect(response.body.result.isFavorite).toBe(false);
  });
});