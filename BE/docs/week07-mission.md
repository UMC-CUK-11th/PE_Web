# 7주차 BE 필수 미션

워크북 필수 항목인 본문 실습 1~6과 9단계 검증 시나리오를 구현했습니다. 선택 미션용 커스텀 데코레이터, Refresh Token, 로그아웃, FE 연동 등은 추가하지 않았습니다.

## 실행

기존 BE는 `package-lock.json`을 사용하는 NestJS 프로젝트이므로 설치 방식을 유지했습니다. 워크북에서 요구한 `@nestjs/jwt`만 의존성에 추가했습니다.

```bash
cd BE
npm ci
npm run build
npm run start:dev
```

서버 주소는 기존과 같은 `http://localhost:3000`입니다. 기존 MySQL과 6주차 테이블을 그대로 사용합니다. `synchronize: false`를 유지하므로 실행 시 DB 스키마를 변경하지 않습니다.

기존 `.env`의 DB 설정을 유지하고 다음 설정을 추가해야 합니다. `.env.example`은 필요한 변수 이름만 담은 참고 파일입니다. 기존 `.env`를 덮어쓰지 마세요.

- `JWT_SECRET`: 직접 생성한 32자 이상의 비밀키. 맥 터미널에서 `openssl rand -hex 32`로 생성할 수 있습니다. `.env`에만 저장하고 Git에는 올리지 않습니다.
- `JWT_ACCESS_EXPIRATION=3600`: 초 단위 만료 시간.

## 구현한 API

| 메서드 | 경로 | 동작 |
| --- | --- | --- |
| POST | `/auth/login` | bcrypt 비교 후 JWT 발급, 200 |
| GET | `/members/me` | Bearer JWT의 회원 정보 조회, 200 |
| PATCH | `/members/me` | 본인 닉네임 수정, 200 |
| POST | `/ratings` | 토큰의 회원으로 평점 등록, 201 |
| PATCH | `/ratings/:ratingId` | 본인 평점 수정, 200 |
| DELETE | `/ratings/:ratingId` | 본인 평점 삭제, 200 |
| GET | `/members/:memberId/ratings` | 기존 공개 조회 유지 |

평점 쓰기 요청의 URL·body에서 요청자 memberId를 받지 않습니다. Guard가 서명·만료를 검증한 JWT의 sub를 request['memberId']에 저장하고 컨트롤러가 사용합니다. 타입 선언은 기존 strict TypeScript 설정에서 이 요청 속성을 인식시키기 위한 것으로, 커스텀 파라미터 데코레이터는 추가하지 않았습니다.

로그인 시에는 비밀번호 존재 여부만 검증하고 회원가입의 복잡도 규칙을 다시 적용하지 않습니다. 내 정보 응답에는 email, nickname, createdAt만 담습니다. 평점 등록·수정은 RatingResponseDto를 반환합니다. 기존 회원가입·중복 확인 API와 main.ts는 유지합니다.

## Postman 검증 및 제출 캡처

Postman에서 `BE/test/week07.postman_collection.json`을 Import하세요. Collection Variables의 baseUrl 기본값은 `http://localhost:3000`입니다. 기본 테스트 계정은 a@umc.com, b@umc.com이고 비밀번호는 Movie123!입니다. 기존 DB에 같은 계정·닉네임이 있으면 emailA/emailB/nicknameA/nicknameB 및 닉네임 수정 요청의 값을 사용하지 않은 값으로 바꾸세요.

컬렉션 순서대로 실행하면 로그인 응답의 토큰과 평점 ID를 자동 저장해 다음 요청에 사용합니다. 로그인 요청부터 개별 실행하려면 테스트 계정이 먼저 가입되어 있어야 합니다. 이전 Run이 남긴 Collection Variables는 첫 가입 요청에서 초기화됩니다.

워크북 9단계:

1. A와 B 회원가입.
2. A와 B 로그인 및 토큰 발급.
3. A 토큰으로 평점 등록 → 201, COMMON201.
4. 같은 영화에 중복 등록 → 409, RATING409_1.
5. A 토큰으로 본인 평점 수정 → 200.
6. B 토큰으로 A의 평점 수정 → 403, RATING403_1.
7. 토큰 없이 수정 → 401, AUTH401_2.
8. 없는 평점 삭제 → 404, RATING404_1.
9. A 토큰으로 본인 평점 삭제 → 200, COMMON200.

그 아래 본문 실습 폴더에서 내 정보 조회·수정과 인증 실패를 확인합니다.

제출 캡처 4장:

- `2-1. A 로그인`의 200 응답: result.accessToken이 보이도록 촬영.
- `토큰 없이 GET /members/me`의 401 응답: AUTH401_2가 보이도록 촬영.
- `6. A의 평점을 B가 수정`의 403 응답: RATING403_1이 보이도록 촬영.
- `3. 본인 토큰으로 평점 등록`의 201 응답: 요청 body에 memberId가 없고 응답 code가 COMMON201인 장면 촬영.

Collection Runner를 끝까지 돌리면 9단계에서 평점이 삭제되므로 403 장면은 Runner의 해당 실행 결과에서 확인하거나, 새 평점을 등록한 뒤 삭제 전에 촬영하세요. 실제 JWT가 저장된 환경/컬렉션 내보내기는 Git에 올리지 마세요.

## 현재 환경의 검증 결과

- 별도 임시 MySQL 8.4에서 실제 NestJS 서버를 실행했습니다. 기존 사용자 DB에는 접근하지 않았습니다.
- Postman 컬렉션을 Newman으로 실행: 19개 요청·69개 assertion 통과. Postman GUI 캡처는 생성하지 않았습니다.
- `npm run build`, `npm run lint` 통과.
- JWT payload의 sub/email 및 3600초 만료, 공개 조회, body memberId 거절, 남의 평점 삭제 403, 닉네임 유효성 및 자기 닉네임 유지, 이전 쓰기 URL 제거도 실제 HTTP로 확인했습니다.
- 기존 `npm test`는 TypeScript 6의 rootDir 및 ESM 설정 문제로 테스트 실행 전에 실패합니다. 이 미션과 무관한 저장소 Jest 설정은 바꾸지 않았으며, 임시 실행 설정으로 기존 단위 테스트 1개가 통과한 것을 확인했습니다.
