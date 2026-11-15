# 8주차 BE 본문 실습 1~4

기준: `be-week7-only`. PDF의 NestJS 본문 실습을 기존 `entity`, `dto`, `service`, `controller` 구조에 구현했습니다. FE, 루트 설정, 의존성은 수정하지 않았습니다. 선택 미션 Swagger는 제외했습니다.

## 실행

```sh
cd BE
npm ci
npm run build
npm run start:dev
```

서버 주소는 `http://localhost:3000`입니다. 기존 `.env`의 `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `JWT_ACCESS_EXPIRATION` 설정을 유지합니다. DB 포트는 기존과 같은 3306입니다. `synchronize: false`를 유지하므로 DB 테이블은 자동 생성되지 않습니다. 워크북 5주차의 member/rating/favorite 테이블과 `(member_id, movie_id)` UNIQUE 제약이 준비되어 있어야 합니다. `.env.example`을 기존 `.env`에 덮어쓰지 마세요.

## Postman 실행

`BE/test/week08-practice.postman_collection.json`을 Import하고 컬렉션 전체를 위에서 아래로 실행하세요. Collection 변수 `baseUrl` 기본값은 `http://localhost:3000`입니다.

첫 요청은 실행마다 새로운 테스트 회원 A/B의 이메일·닉네임을 만들고, 회원가입과 로그인 후 토큰을 자동 저장합니다. 테스트 회원 비밀번호는 `Movie123!`입니다. 사용자의 기존 계정은 사용하지 않습니다. 컬렉션은 테스트 회원 및 데이터를 생성하므로 개발용 DB에서 실행하세요. 개별 API만 실행하려면 준비 회원가입·로그인을 먼저 실행해야 합니다.

실습 순서:

1. `Favorite`가 `BaseTimeEntity`를 상속하고 회원·영화 ID와 복합 UNIQUE 제약을 매핑하는 코드 확인.
2. `POST /favorites`, `GET /favorites`, `GET /favorites/{movieId}`, `DELETE /favorites/{movieId}` 실행. 최신 등록 순서와 회원별 데이터 분리 확인.
3. `POST /movie-records`에 아래 본문을 전송해 `result.rating`과 `result.favorite` 확인.
4. 토큰 없음 401/AUTH401_2, 중복 등록 409/FAVORITE409_1, 없는 즐겨찾기 해제 404/FAVORITE404_1, movieId 0의 400, 빈 목록 200/[] 확인.

```json
{
  "movieId": 238,
  "score": 5,
  "comment": "다시 보고 싶은 영화입니다.",
  "addToFavorites": true
}
```

요청자 memberId를 URL·body·query에 보내지 않습니다. 인증은 `Authorization: Bearer {accessToken}` 헤더로 처리합니다. 영화 기록 Service는 `dataSource.transaction()` 콜백 안의 `manager.getRepository()`로만 조회·저장합니다. `addToFavorites: false`이면 평점만 저장하고 `favorite: null`을 반환합니다.

## 확인 결과

- `npm ci`, `npm run build`, `npm run lint` 통과.
- 별도의 임시 MySQL 8.4와 실제 NestJS 서버에서 Newman으로 요청 36개, assertion 85개 통과. 기존 사용자 DB에는 접근하지 않았습니다.
- 테스트 DB에만 실패 유도 trigger를 설치해 즐겨찾기 INSERT를 실패시켰을 때 먼저 INSERT한 평점도 롤백됨을 SQL로 확인했습니다. trigger 제거 후 재요청은 두 행 모두 저장되었습니다.
- DB의 복합 UNIQUE 제약이 동일 회원/영화 중복을 막는 것도 확인했습니다.

## 워크북 인증 캡처

- 즐겨찾기 등록 성공과 중복 등록 오류 응답.
- 즐겨찾기 목록, 단건 여부, 해제 응답.
- 영화 기록 저장 성공 시 rating/favorite가 함께 담긴 응답.
- `src/service/movie-record.service.ts`의 `dataSource.transaction()` 코드.

설명 한 문장: 평점 저장 후 즐겨찾기 저장이 실패하면 평점도 취소되어야 하므로 두 저장을 하나의 트랜잭션으로 묶었습니다.

실제 토큰은 캡처 시 가리고, 토큰이 저장된 실행 후 컬렉션 내보내기는 Git에 올리지 마세요. 8주차 PR 생성과 머지는 수행하지 않았습니다.
