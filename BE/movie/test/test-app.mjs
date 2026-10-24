import "reflect-metadata";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { MemberController } from "../dist/controller/member.controller.js";
import { RatingController } from "../dist/controller/rating.controller.js";
import { MemberService } from "../dist/service/member.service.js";
import { RatingService } from "../dist/service/rating.service.js";
import { Member } from "../dist/entity/member.entity.js";
import { Rating } from "../dist/entity/rating.entity.js";
import { configureApp } from "../dist/configure-app.js";

// Test-only repository substitutes. Production always connects to MySQL.
export async function createTestApp({ corsEnabled = true, port = 0 } = {}) {
  const members = [
    { memberId: "1", nickname: "수현", email: "noco@umc.com" },
    { memberId: "2", nickname: "민서", email: "minseo@umc.com" },
    { memberId: "3", nickname: "빈유저", email: "empty@umc.com" },
  ];
  const now = new Date("2026-10-24T00:00:00Z");
  const ratings = [
    {
      ratingId: "1",
      movieId: "550",
      member: members[0],
      score: 5,
      comment: "최고의 영화!",
      createdAt: now,
      updatedAt: now,
    },
    {
      ratingId: "2",
      movieId: "155",
      member: members[0],
      score: 4,
      comment: "다시 봐도 명작",
      createdAt: now,
      updatedAt: now,
    },
    {
      ratingId: "3",
      movieId: "550",
      member: members[1],
      score: 3,
      comment: "호불호가 갈릴 것 같아요",
      createdAt: now,
      updatedAt: now,
    },
  ];
  const module = await Test.createTestingModule({
    controllers: [MemberController, RatingController],
    providers: [
      MemberService,
      RatingService,
      {
        provide: getRepositoryToken(Member),
        useValue: {
          exists: async ({ where }) =>
            members.some((member) =>
              Object.entries(where).every(
                ([key, value]) => member[key] === value,
              ),
            ),
        },
      },
      {
        provide: getRepositoryToken(Rating),
        useValue: {
          find: async ({ where, order }) => {
            if (order.ratingId !== "DESC")
              throw new Error("Expected descending ratings");
            return ratings
              .filter(
                (rating) => rating.member.memberId === where.member.memberId,
              )
              .sort((a, b) => Number(b.ratingId) - Number(a.ratingId));
          },
        },
      },
    ],
  }).compile();
  const app = module.createNestApplication({ logger: false });
  configureApp(app, corsEnabled);
  await app.listen(port, "127.0.0.1");
  return app;
}
