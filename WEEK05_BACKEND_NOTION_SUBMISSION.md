# UMC 11기 Product Engineering 5주차 — Backend

> 사용 스택: NestJS / TypeORM / MySQL / TypeScript / npm
>
> 코드 구현, 빌드, 테스트용 Repository 기반 테스트 7개는 완료했다. 실제 Windows MySQL의 스키마·시드 적용, 실제 DB를 사용하는 NestJS 기동, Postman 및 웹 인증은 별도 확인이 필요하다. 아래의 [캡처 추가] 부분은 실제 실행 후 채운다. 예시 JSON과 테스트용 데이터 결과를 실제 DB 실행 결과로 제출하지 않는다.

# 🎯 핵심 키워드

## 1. SOP와 CORS

SOP(Same-Origin Policy)는 브라우저가 다른 Origin의 응답을 JavaScript에서 읽는 것을 제한하는 정책이다. Origin은 프로토콜, 호스트, 포트를 함께 비교한다. 따라서 프런트엔드의 http://localhost:5173과 백엔드의 http://localhost:3000은 포트가 달라 cross-origin이다.

CORS는 서버가 응답 헤더로 어떤 Origin에 응답 읽기를 허용하는지 알려주는 방식이다. 이번 서버는 Access-Control-Allow-Origin에 http://localhost:5173을 허용하도록 설정했다. CORS는 사용자 인증·인가를 대신하지 않으며, 모든 요청 자체를 서버에 도달하지 못하게 막는 장치도 아니다. Postman은 브라우저의 SOP를 적용하지 않으므로 Postman 성공과 브라우저에서의 CORS 성공을 따로 확인해야 한다. 단순 GET은 preflight OPTIONS 없이 동작할 수도 있다.

참고: [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

## 2. Same-Origin과 Same-Site의 차이

Same-Origin은 프로토콜·호스트·포트가 모두 같아야 한다. Same-Site는 scheme을 고려하는 경우 scheme과 등록 가능 도메인을 기준으로 판단하며 포트는 구분하지 않는다. 예를 들어 https://example.com:3000과 https://example.com:5173은 cross-origin이지만 same-site이다. 이번 로컬 HTTP 환경에서도 localhost의 포트가 다른 두 주소는 cross-origin이다.

참고: [MDN Site](https://developer.mozilla.org/en-US/docs/Glossary/Site)

## 3. 쿠키의 SameSite 속성

SameSite는 cross-site 요청 상황에서 쿠키를 보낼지 제한하는 속성이다. Strict는 엄격하게 제한하고, Lax는 일부 최상위 안전한 탐색 등을 허용한다. None은 cross-site 쿠키 전송을 허용하며 Secure가 요구된다. SameSite와 CORS는 서로 다른 기능이며, 이번 주차에는 쿠키 로그인 기능을 구현하지 않았다.

참고: [MDN Set-Cookie / SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#samesitesamesite-value)

## 4. 복합 UNIQUE 제약을 사용하는 이유

rating과 favorite에는 (member_id, movie_id) 조합의 UNIQUE 제약을 적용했다. member_id 하나만 UNIQUE이면 회원이 영화 한 편에만 기록을 남길 수 있고, movie_id 하나만 UNIQUE이면 여러 회원이 같은 영화를 평가할 수 없게 된다. 두 컬럼의 조합을 UNIQUE로 만들면 여러 회원과 여러 영화의 기록은 허용하면서 동일 회원·동일 영화의 중복 기록만 방지할 수 있다.

## 5. 외부 API Key를 어디에 두어야 하는가?

비밀로 유지해야 하는 값은 백엔드에서 관리해야 한다. 프런트에서 사용하는 VITE_ 환경 변수는 빌드 결과나 브라우저 요청에 나타날 수 있으므로, 환경 파일을 Git에서 제외하는 것만으로 브라우저에서도 숨겨지는 것은 아니다. 이번 프런트 실습은 워크북에 따라 TMDB 읽기 토큰을 사용하고, 백엔드의 DB_PASSWORD는 서버의 .env에서 읽는다. 실제 토큰과 비밀번호는 소스·예시 파일·노션에 넣지 않는다.

참고: [Vite 환경 변수](https://vite.dev/guide/env-and-mode)

# 📢 학습 후기

이번 주차에는 기존 도서 대여 프로젝트를 보존하고, 영화 평점 서비스를 위한 별도 NestJS 프로젝트를 구성했다. Controller는 요청을 받고, Service는 조회 순서와 조건을 처리하고, Repository는 DB에 접근하고, DTO는 응답에 공개할 필드를 정리하도록 역할을 나누었다.

영화 자체의 정보와 우리 서비스가 관리할 정보를 구분하는 것이 핵심이었다. 영화 정보는 TMDB가 제공하므로 Movie 테이블을 만들지 않고 외부 영화 ID만 저장했다. 또한 회원이 없는 경우와 회원은 있지만 평점이 없는 경우를 각각 404와 빈 배열로 구분했다.

검증에서는 코드 빌드, 테스트 저장소를 이용한 검증, 실제 MySQL을 연결한 검증이 서로 다른 범위를 확인한다는 점을 구분했다. 실제 DB를 사용하는 실행 결과와 브라우저의 CORS 동작은 Windows 로컬 환경에서 별도로 확인하여 인증을 추가할 예정이다.

# ✅ 실습 체크리스트

## 코드와 자동 검증

- [x] 기존 BE/study와 분리된 BE/movie 프로젝트를 구성했다.
- [x] Member / Rating / BaseTimeEntity를 작성했다.
- [x] TypeORM Repository를 주입했다.
- [x] CheckResponseDto / RatingResponseDto를 작성했다.
- [x] 닉네임·이메일 중복 확인과 유저별 평점 조회 API를 구현했다.
- [x] 존재하지 않는 회원의 404 처리를 구현했다.
- [x] localhost:5173에 대한 CORS를 구성했다.
- [x] schema와 seed SQL을 준비했다.
- [x] npm run build가 통과했다.
- [x] 테스트 저장소 기반 테스트 7개가 통과했다.

## 실제 DB 기반 실습 인증 — Windows에서 확인 후 체크

- [ ] umc_movie에 member, rating, favorite 테이블과 회원/평점 seed가 있다.
- [ ] Postman에서 닉네임/이메일 API의 available 값을 확인했다.
- [ ] Postman에서 유저별 평점이 최신순으로 반환되는 것을 확인했다.
- [ ] 실제 DB를 사용하는 서버에서 CORS 비활성화 시 브라우저 차단을 확인했다.
- [ ] CORS 활성화 후 같은 웹 화면에서 세 API의 정상 응답을 확인했다.

# ☑️ 실습 인증

| 번호 | 추가할 캡처 | 화면에 보여야 하는 내용 |
| --- | --- | --- |
| 1 | DB 테이블·seed 조회 | umc_movie의 세 테이블, 회원·평점 조회 결과 |
| 2 | 닉네임 중복 / 사용 가능 | Postman의 GET URL, 200, available false/true |
| 3 | 이메일 중복 / 사용 가능 | Postman의 GET URL, 200, available false/true |
| 4 | 회원 평점 조회 | Postman의 GET URL, 200, 최신순 DTO 배열 |
| 5 | 없는 회원 조회 | URL, 404, 존재하지 않는 유저입니다. |
| 6 | CORS 비활성화 | 실제 DB 서버가 응답 가능한 상태에서 브라우저 CORS 오류 |
| 7 | CORS 활성화 및 웹 연결 | /api-test의 닉네임·이메일·평점 세 결과와 Network JSON |
| 8 | 선택 미션 Validation | 잘못된 닉네임/이메일의 400 응답 |
| 9 | 빌드 | npm run build 성공 로그 |

**[캡처 1~9 추가 — 실제 실행 후 추가]**

# 💪 미션 기록

## 1. 프로젝트 구성

기존 도서 대여 서비스는 수정하지 않고 새 영화 서비스 프로젝트를 구성했다. 워크북의 Layer 구조에 맞춰 Controller, Service, Repository, Entity, DTO를 구분했다. 별도 도메인 Feature Module 대신 AppModule에서 직접 등록했다.

```text
BE/movie/
├─ .env                         # 로컬 전용, Git 제외
├─ .env.example
├─ package.json / package-lock.json
├─ nest-cli.json
├─ tsconfig.json / tsconfig.build.json
├─ sql/
│  ├─ schema.sql
│  └─ seed.sql
├─ src/
│  ├─ controller/
│  ├─ service/
│  ├─ repository/
│  ├─ entity/
│  ├─ dto/
│  ├─ configure-app.ts
│  ├─ app.module.ts
│  └─ main.ts
├─ scripts/check-db.mjs
├─ postman/week05-movie.postman_collection.json
└─ test/
   ├─ api.test.mjs
   └─ test-app.mjs
```

repository 폴더는 유지하되 별도 Repository 클래스를 만들지 않고 TypeORM의 Repository<Entity>를 Service에 주입했다.

## 2. ERD 및 데이터 설계

| 엔티티 | 저장 정보 | 관계 |
| --- | --- | --- |
| Member | 이메일, 비밀번호, 닉네임, 생성·수정 시간 | 회원 1명에 여러 Rating/Favorite |
| Rating | 회원, TMDB 영화 ID, 평점, 코멘트, 생성·수정 시간 | Member에 대한 N:1 관계 |
| Favorite | 회원, TMDB 영화 ID, 생성·수정 시간 | Member에 대한 N:1 관계 |

```text
Member (1) ─── (N) Rating
Member (1) ─── (N) Favorite

Rating.movie_id   → TMDB 외부 식별자, 우리 DB의 FK가 아님
Favorite.movie_id → TMDB 외부 식별자, 우리 DB의 FK가 아님
```

Favorite는 이후 주차를 위한 테이블만 준비했으며 Entity/API는 구현 범위에 포함하지 않았다.

### 스키마 SQL

```sql
CREATE DATABASE IF NOT EXISTS umc_movie CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE umc_movie;

CREATE TABLE member (
    member_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(254) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE rating (
    rating_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    score TINYINT NOT NULL,
    comment TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES member(member_id),
    UNIQUE KEY uk_rating_member_movie (member_id, movie_id)
);

CREATE TABLE favorite (
    favorite_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES member(member_id),
    UNIQUE KEY uk_favorite_member_movie (member_id, movie_id)
);
```

### Seed SQL

개발용 dummy hash를 사용했으며 실제 비밀번호는 넣지 않았다. 아래 seed는 새 스키마에 최초 한 번 적용하는 용도다. 회원 ID 1/2를 기준으로 평점을 넣으므로 기존 데이터가 있으면 먼저 상태를 확인한다.

```sql
USE umc_movie;

-- Development-only dummy hashes. These are not usable credentials.
INSERT INTO member (email, password, nickname) VALUES
('noco@umc.com', '$2a$10$dummyEncodedPasswordValue', '수현'),
('minseo@umc.com', '$2a$10$dummyEncodedPasswordValue', '민서');

INSERT INTO rating (member_id, movie_id, score, comment) VALUES
(1, 550, 5, '최고의 영화!'),
(1, 155, 4, '다시 봐도 명작'),
(2, 550, 3, '호불호가 갈릴 것 같아요');
```

### DB 확인 쿼리

```sql
USE umc_movie;
SHOW TABLES;
SELECT member_id, email, nickname FROM member;
SELECT rating_id, member_id, movie_id, score, comment
FROM rating ORDER BY rating_id DESC;
```

**[실행 후 캡처 1 추가]**

## 3. 환경 변수와 TypeORM 설정

실행 대상은 Windows 호스트의 MySQL 3307 인스턴스다. 실제 비밀번호는 로컬 .env에만 입력한다. 다음은 비밀번호를 비운 공개 가능한 예시다.

```dotenv
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=root
DB_PASSWORD=
DB_NAME=umc_movie
PORT=3000
# false: CORS 오류 재현 실습. 기본값은 true.
CORS_ENABLED=true
```

ConfigModule에서 환경 변수를 읽고 TypeOrmModule.forRootAsync로 MySQL 연결을 구성했다. synchronize는 false로 두어 실행 시 스키마가 임의 변경되지 않게 했다. TypeOrmModule.forFeature로 Member와 Rating Repository를 주입할 수 있도록 등록했다.

```ts
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Member } from "./entity/member.entity.js";
import { Rating } from "./entity/rating.entity.js";
import { MemberController } from "./controller/member.controller.js";
import { RatingController } from "./controller/rating.controller.js";
import { MemberService } from "./service/member.service.js";
import { RatingService } from "./service/rating.service.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "mysql" as const,
        host: config.get<string>("DB_HOST", "127.0.0.1"),
        port: Number(config.get<string>("DB_PORT", "3307")),
        username: config.get<string>("DB_USER", "root"),
        password: config.get<string>("DB_PASSWORD", ""),
        database: config.get<string>("DB_NAME", "umc_movie"),
        autoLoadEntities: true,
        synchronize: false,
        supportBigNumbers: true,
        bigNumberStrings: true,
      }),
    }),
    TypeOrmModule.forFeature([Member, Rating]),
  ],
  controllers: [MemberController, RatingController],
  providers: [MemberService, RatingService],
})
export class AppModule {}
```

## 4. Entity 구현

### BaseTimeEntity

회원과 평점의 공통 생성·수정 시간을 정의했다.

```ts
import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseTimeEntity {
  @CreateDateColumn({ name: "created_at", type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "datetime" })
  updatedAt!: Date;
}
```

### Member

이메일은 최대 254자, 닉네임은 최대 50자이며 각각 unique다. password는 기본 조회에서 제외했다. MySQL BIGINT를 JavaScript number로 무조건 변환하지 않도록 내부 ID는 문자열로 받는다.

```ts
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseTimeEntity } from "./base-time.entity.js";

@Entity("member")
export class Member extends BaseTimeEntity {
  // mysql2 returns BIGINT as strings to preserve precision.
  @PrimaryGeneratedColumn({ name: "member_id", type: "bigint" })
  memberId!: string;

  @Column({ length: 254, unique: true })
  email!: string;

  @Column({ length: 60, select: false })
  password!: string;

  @Column({ length: 50, unique: true })
  nickname!: string;
}
```

### Rating

회원과 N:1 관계를 맺고 member_id로 연결했다. movieId는 TMDB 식별자이므로 일반 컬럼이다. 동일 회원·영화 조합은 중복되지 않도록 설정했다.

```ts
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { BaseTimeEntity } from "./base-time.entity.js";
import { Member } from "./member.entity.js";

@Entity("rating")
@Unique("uk_rating_member_movie", ["member", "movieId"])
export class Rating extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: "rating_id", type: "bigint" })
  ratingId!: string;

  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn({ name: "member_id" })
  member!: Member;

  // External TMDB identifier; deliberately not a foreign key.
  @Column({ name: "movie_id", type: "bigint" })
  movieId!: string;

  @Column({ type: "tinyint" })
  score!: number;

  @Column({ type: "text", nullable: true })
  comment!: string | null;
}
```

## 5. 응답 DTO 구현

### CheckResponseDto

중복 확인 결과는 available 하나로 반환한다.

```ts
export class CheckResponseDto {
  available!: boolean;
}
```

### RatingResponseDto

Entity를 그대로 반환하지 않고 평점 응답에 필요한 필드만 추렸다. Member 정보나 password는 포함하지 않는다. BIGINT의 ID를 숫자로 반환할 때 안전한 정수 범위인지 검사한다. Date 필드는 HTTP JSON 응답에서 문자열로 직렬화된다.

```ts
import { InternalServerErrorException } from "@nestjs/common";
import { Rating } from "../entity/rating.entity.js";

function toSafeId(value: string): number {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new InternalServerErrorException(
      "식별자가 지원 범위를 벗어났습니다.",
    );
  }
  return id;
}

export class RatingResponseDto {
  ratingId!: number;
  movieId!: number;
  score!: number;
  comment!: string | null;
  createdAt!: Date;
  updatedAt!: Date;

  static from(rating: Rating): RatingResponseDto {
    return Object.assign(new RatingResponseDto(), {
      ratingId: toSafeId(rating.ratingId),
      movieId: toSafeId(rating.movieId),
      score: rating.score,
      comment: rating.comment,
      createdAt: rating.createdAt,
      updatedAt: rating.updatedAt,
    });
  }
}
```

## 6. API 명세

Base URL: http://localhost:3000. 세 API는 GET 조회이며 요청 Body는 없다.

| 이름 | Method | URL | Request | Success Response |
| --- | --- | --- | --- | --- |
| 닉네임 중복 확인 | GET | /members/nickname/{nickname} | Path nickname: string, 2~12자 | 200, { available: boolean } |
| 이메일 중복 확인 | GET | /members/email/{email} | Path email: string, 이메일 형식 | 200, { available: boolean } |
| 유저별 평점 조회 | GET | /members/{memberId}/ratings | Path memberId: 양의 안전한 정수 | 200, RatingResponseDto[] |

| 평점 응답 필드 | JSON 타입 |
| --- | --- |
| ratingId | number |
| movieId | number |
| score | number |
| comment | string 또는 null |
| createdAt | string |
| updatedAt | string |

오류: 입력 형식 오류는 400, 존재하지 않는 회원의 평점 조회는 404다. 회원은 존재하지만 평점이 없으면 200과 []를 반환한다.

## 7. 닉네임·이메일 중복 체크 API

Controller에서 Path Parameter를 받고 Service로 전달한다. Service는 Repository.exists로 존재 여부를 확인한다. 이미 있으면 사용할 수 없으므로 available은 exists의 반대 값이다.

### MemberController

```ts
import { Controller, Get, Param } from "@nestjs/common";
import { MemberService } from "../service/member.service.js";
import { EmailParamsDto, NicknameParamsDto } from "../dto/check-params.dto.js";

@Controller("members")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get("nickname/:nickname")
  checkNickname(@Param() params: NicknameParamsDto) {
    return this.memberService.checkNickname(params.nickname);
  }

  @Get("email/:email")
  checkEmail(@Param() params: EmailParamsDto) {
    return this.memberService.checkEmail(params.email);
  }
}
```

### MemberService

```ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Member } from "../entity/member.entity.js";
import { CheckResponseDto } from "../dto/check-response.dto.js";

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async checkNickname(nickname: string): Promise<CheckResponseDto> {
    const exists = await this.memberRepository.exists({ where: { nickname } });
    return { available: !exists };
  }

  async checkEmail(email: string): Promise<CheckResponseDto> {
    const exists = await this.memberRepository.exists({ where: { email } });
    return { available: !exists };
  }
}
```

### Postman 검증 계획과 예상 결과

아래는 제공한 seed가 적용된 새 DB의 예상 값이다. 실제 실행 응답을 복사한 결과는 아니며, 실행 후 캡처를 추가한다.

| GET URL | 예상 상태 | 예상 응답 |
| --- | --- | --- |
| http://localhost:3000/members/nickname/수현 | 200 | { "available": false } |
| http://localhost:3000/members/nickname/꿀범 | 200 | { "available": true } |
| http://localhost:3000/members/email/noco@umc.com | 200 | { "available": false } |
| http://localhost:3000/members/email/new@umc.com | 200 | { "available": true } |

**[실행 후 캡처 2, 3 추가 — URL·상태·JSON이 함께 보이도록 캡처]**

## 8. 유저별 평점 조회 API

ParseIntPipe로 회원 ID를 숫자로 받고 양의 안전한 정수인지 추가 검사한다. Service에서는 회원 존재를 먼저 확인한다. 회원이 없으면 NotFoundException, 회원이 있으면 해당 회원의 평점만 ratingId DESC로 조회하고 DTO로 변환한다.

### RatingController

```ts
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
```

### RatingService

```ts
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
```

### Postman 검증 계획과 예상 결과

| GET URL | 예상 상태 | 확인할 내용 |
| --- | --- | --- |
| http://localhost:3000/members/1/ratings | 200 | 새 DB seed 기준 ratingId 2 → 1, DTO 필드만 반환 |
| http://localhost:3000/members/999/ratings | 404 | 해당 회원이 실제 없을 때 존재하지 않는 유저입니다. |
| http://localhost:3000/members/abc/ratings | 400 | 잘못된 ID 거부 |

회원은 있지만 평점이 없는 경우는 실제로 존재하는 회원 ID를 골라 []를 확인한다. 자동 테스트에만 있는 가상 회원 3번을 실제 seed의 회원으로 가정하지 않는다.

**[실행 후 캡처 4, 5 추가]**

## 9. CORS 설정 및 적용 전후 실습

main.ts에서 서버를 만들고 configureApp을 호출하여 CORS와 ValidationPipe를 적용한다. 허용 Origin은 http://localhost:5173 하나로 제한했다.

### main.ts

```ts
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module.js";
import { configureApp } from "./configure-app.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  configureApp(app, config.get<string>("CORS_ENABLED", "true") !== "false");
  await app.listen(Number(config.get<string>("PORT", "3000")));
}
void bootstrap();
```

### configure-app.ts

```ts
import { type INestApplication, ValidationPipe } from "@nestjs/common";

export function configureApp(app: INestApplication, corsEnabled = true) {
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  if (corsEnabled) {
    app.enableCors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PATCH", "DELETE"],
    });
  }
}
```

### 적용 전 실습 절차

1. 실제 DB를 사용하는 서버가 Postman에 정상 응답하는지 먼저 확인한다.
2. 로컬 .env에서 CORS_ENABLED=false로 바꾼다.
3. 백엔드를 종료하고 npm run start:dev로 재시작한다.
4. http://localhost:5173/api-test에서 닉네임 중복 확인을 누른다.
5. 브라우저 Console의 CORS 차단 메시지를 캡처한다.

서버가 꺼져 발생하는 ERR_CONNECTION_REFUSED는 CORS 오류와 구분한다.

**[실행 후 캡처 6 추가]**

### 적용 후 실습 절차

1. CORS_ENABLED=true로 복원하고 서버를 재시작한다.
2. 같은 /api-test에서 닉네임·이메일·평점 세 폼을 제출한다.
3. Network의 200 응답과 JSON, Access-Control-Allow-Origin: http://localhost:5173을 확인한다.

**[실행 후 캡처 7 추가]**

별도 mock-frontend HTML을 만들지 않고 실제 UMCine의 /api-test 화면을 이용하도록 구현했다. 테스트 저장소를 사용한 브라우저 검증에서는 CORS 비활성 시 차단, 활성 시 세 API 호출이 통과했다. 실제 MySQL 서버를 사용하는 동일한 실습은 Windows에서 확인 후 캡처한다.

## 10. 실제 프론트 연결 구현

닉네임/이메일 중복 체크와 평점 조회를 위한 요청 함수를 작성했다. 사용자 입력값은 URL에 안전하게 전달하도록 encodeURIComponent를 사용했다. backendClient는 환경 변수의 URL을 사용하고 기본 주소는 http://localhost:3000이다.

```ts
import ky from "ky";

const backendClient = ky.create({
  baseUrl: `${(import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:3000").replace(/\/+$/, "")}/`,
  retry: 0,
});

export interface CheckResponse {
  available: boolean;
}
export interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export function checkNickname(nickname: string) {
  return backendClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckResponse>();
}
export function checkEmail(email: string) {
  return backendClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckResponse>();
}
export function getMemberRatings(memberId: number) {
  return backendClient
    .get(`members/${memberId}/ratings`)
    .json<RatingResponse[]>();
}
```

실제 /api-test 화면은 다음 세 영역으로 구성했다.

- 닉네임 입력 → 중복 확인 → 사용 가능/중복 표시
- 이메일 입력 → 중복 확인 → 사용 가능/중복 표시
- Member ID 입력 → 평점 조회 → 평점 목록 또는 오류 문구 표시

아래는 실제 화면의 요청 처리 핵심 부분을 발췌한 코드다. UI className 등 표현 코드는 생략했다.

```tsx
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(
      new FormData(event.currentTarget).get("value") ?? "",
    ).trim();
    setLoading(true);
    setResult("");
    try {
      const data = await (kind === "nickname"
        ? checkNickname(value)
        : checkEmail(value));
      setResult(data.available ? "사용 가능" : "중복");
    } catch (error) {
      setResult(await backendError(error));
    } finally {
      setLoading(false);
    }
  }
```

```tsx
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const memberId = Number(new FormData(event.currentTarget).get("memberId"));
    if (!Number.isSafeInteger(memberId) || memberId <= 0) {
      setMessage("올바르지 않은 유저 번호입니다.");
      return;
    }
    setLoading(true);
    setRatings([]);
    setMessage("");
    try {
      const data = await getMemberRatings(memberId);
      setRatings(data);
      setMessage(data.length ? `평점 ${data.length}개` : "남긴 평점이 없어요.");
    } catch (error) {
      setMessage(await backendError(error));
    } finally {
      setLoading(false);
    }
  }
```

정상 seed를 적용한 상태에서 닉네임 수현, 이메일 noco@umc.com, Member ID 1로 조회하면 각각 중복, 중복, 평점 2개가 예상된다. 세 API 모두 실제 웹 화면에서 호출한 캡처를 추가해야 한다.

## 11. 선택 미션: 닉네임 / 이메일 Validation

닉네임 2~12자, 이메일 형식을 DTO에서 검사하고 전역 ValidationPipe를 적용했다. 검증에 실패하면 Service의 중복 조회 전에 400을 반환한다.

```ts
import { IsEmail, IsString, Length } from "class-validator";

export class NicknameParamsDto {
  @IsString()
  @Length(2, 12)
  nickname!: string;
}

export class EmailParamsDto {
  @IsEmail()
  @Length(3, 254)
  email!: string;
}
```

| 잘못된 요청 | 예상 상태 |
| --- | --- |
| GET /members/nickname/a | 400 |
| GET /members/nickname/abcdefghijklmnop | 400 |
| GET /members/email/not-an-email | 400 |

웹 폼의 HTML 검증은 요청 자체를 막을 수 있으므로 서버 Validation 인증은 Postman으로 진행한다.

**[실행 후 캡처 8 추가]**

평점 목록 page/size 페이지네이션은 이번에 구현하지 않았다. CORS의 '*' 허용과 특정 Origin 허용을 비교하는 선택 실습도 수행한 것으로 기록하지 않는다.

## 12. 빌드와 자동 테스트 결과

실행한 검증 명령:

```powershell
npm test
```

npm test는 npm run build를 먼저 실행한 뒤 Node 테스트 러너를 실행하도록 구성했다. 최종 결과는 빌드 성공, tests 7 / pass 7 / fail 0이다.

| 자동 검증 항목 | 결과 |
| --- | --- |
| 닉네임/이메일 중복 및 사용 가능 | 통과 |
| 평점 최신순·DTO 필드·민감정보 제외 | 통과 |
| 회원은 있지만 평점 없음과 없는 회원 404 구분 | 통과 |
| 잘못된 닉네임/이메일/회원 ID 400 | 통과 |
| CORS Origin·preflight method 설정 | 통과 |
| CORS 비활성화 시 허용 header 없음 | 통과 |
| MySQL Entity metadata의 FK·UNIQUE 구조 | 통과 |

이 테스트는 실제 HTTP 서버를 실행하되 Repository를 테스트 데이터로 대체한다. MySQL 접속이나 실제 SQL 적용까지 검증한 결과는 아니다.

Windows에서 빌드 로그를 별도 캡처하려면 npm run build를 실행한다.

**[캡처 9 추가]**

# ⚡ 트러블 슈팅

## 이슈 1. 새 NestJS 프로젝트의 TS1479

**이슈**

빌드 과정에서 ESM 패키지를 CommonJS 방식으로 불러오려는 TS1479 오류가 발생했다.

**문제**

사용한 Nest 12 패키지와 새 프로젝트의 module 설정이 일치하지 않았다.

**해결**

package.json에 type:module을 적용하고, 상대 import에 .js 확장자를 사용하도록 맞췄다.

**결과**

npm run build가 통과했다.

## 이슈 2. API 테스트 화면에 서버의 오류 메시지가 나타나지 않음

**이슈**

존재하지 않는 회원 조회 시 서버의 '존재하지 않는 유저입니다.' 대신 일반적인 404 문구만 나타났다.

**문제**

Ky 2는 오류 응답을 error.data로 읽는 과정에서 body를 소비한다. response.clone().json()으로 다시 읽으려던 처리가 맞지 않았다.

**해결**

frontend의 backendError에서 error.data.message를 사용하도록 수정했다.

**결과**

테스트 저장소 기반 브라우저 검증에서 서버 404 메시지가 화면에 표시되는 것을 확인했다.

## 이슈 3. Workbench 확인 결과와 자동 실행 환경의 DB 연결 결과가 다름

**이슈**

사용자는 Windows Workbench에서 127.0.0.1:3307의 Test Connection 성공을 확인했지만, 자동 실행 환경의 같은 주소에서는 ECONNREFUSED가 발생했다.

**문제**

관찰한 사실은 자동 실행 환경에서 3307의 TCP 연결이 거부되었다는 것이다. 실행 환경이나 네트워크 경계 차이가 가능하지만 실제 원인을 확정하지 않았다. ECONNREFUSED를 비밀번호 오류로 단정할 수 없다.

**대응 및 현재 상태**

MySQL을 외부로 개방하거나 새 인스턴스를 만들지 않고 실제 연결 검증은 Windows 로컬 터미널에서 진행하도록 정리했다. 소스·예시·문서의 포트는 3307로 통일했으며, DB와 무관한 빌드 및 테스트는 완료했다. 실제 MySQL 기동·API 검증 성공은 아직 추가하지 않았다.

# Windows 로컬 실행 및 인증 순서

## 1. DB 준비

Workbench의 UMC MySQL 3307 연결에서 schema.sql, seed.sql 순서로 최초 한 번 적용한다. 이미 테이블/데이터가 있으면 먼저 확인하고 중복 실행하지 않는다.

## 2. 서버 실행

Windows PowerShell:

```powershell
Set-Location 'C:\Users\proce\OneDrive\문서\ChatGPT\UMC11th\BE\movie'
# 의존성이 없는 환경에서만 먼저 npm ci 실행
npm run db:check
npm run build
npm run start:dev
```

기본 서버 주소는 http://localhost:3000이다. TypeORM 접속 오류가 반복되지 않고 정상 서버 시작 로그가 나오는지 확인한다. 비밀번호는 .env에서만 읽는다.

## 3. 실제 API 확인

서버 실행용 터미널을 유지한 채 새 PowerShell에서 실행한다.

```powershell
$apiBase = 'http://localhost:3000'
$nickname = [uri]::EscapeDataString('수현')
Invoke-RestMethod "$apiBase/members/nickname/$nickname"
Invoke-RestMethod "$apiBase/members/email/noco@umc.com"
Invoke-RestMethod "$apiBase/members/1/ratings" | ConvertTo-Json -Depth 5
curl.exe -i "$apiBase/members/999/ratings"
curl.exe -i "$apiBase/members/nickname/a"
curl.exe -i "$apiBase/members/email/not-an-email"
```

Postman으로 제출용 캡처를 남길 때는 week05-movie.postman_collection.json을 Import하여 요청 10개를 사용한다.

## 4. 실제 프런트 확인

프런트가 해당 Windows에서 실행 중이지 않다면 별도 터미널에서 실행한다.

```powershell
Set-Location 'C:\Users\proce\OneDrive\문서\ChatGPT\UMC11th\FE\umcine'
pnpm dev --port 5173 --strictPort
```

http://localhost:5173/api-test에서 세 API를 모두 호출한다. CORS 전후 실습은 CORS_ENABLED=false/true를 바꿀 때마다 백엔드를 명시적으로 재시작하여 확인한다. 최종 설정은 true로 복원한다.

# 🤔 참고 자료

- [NestJS Database / TypeORM](https://docs.nestjs.com/techniques/database)
- [NestJS CORS](https://docs.nestjs.com/security/cors)
- [NestJS Validation](https://docs.nestjs.com/techniques/validation)
- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
- [MDN Site](https://developer.mozilla.org/en-US/docs/Glossary/Site)
- [MDN SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#samesitesamesite-value)
- [Vite 환경 변수](https://vite.dev/guide/env-and-mode)

스터디 인증샷, 실제 실행 캡처, 실제 DB/API 확인 후의 체크리스트는 본인의 인증으로 추가한다. 현재 문서에는 실연결 미확인 항목을 완료로 표시하지 않았다.
