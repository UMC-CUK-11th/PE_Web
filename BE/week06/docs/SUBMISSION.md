# 6주차 Standard Mission 제출 안내

## API 명세

기본 주소: `http://localhost:8080`. POST/PATCH는 `Content-Type: application/json`을 사용합니다. 현재 주차는 로그인 토큰 대신 URL의 `memberId`로 회원을 지정합니다.

| 기능 | 메서드 | 경로 | 요청 Body | 성공 |
|---|---|---|---|---|
| 회원가입 | POST | `/members` | email, password, nickname | 201 |
| 평점 등록 | POST | `/members/{memberId}/ratings` | movieId, score, comment | 201 |
| 평점 조회 | GET | `/members/{memberId}/ratings` | 없음 | 200 |
| 평점 수정 | PATCH | `/members/{memberId}/ratings/{ratingId}` | score, comment | 200 |
| 평점 삭제 | DELETE | `/members/{memberId}/ratings/{ratingId}` | 없음 | 204, 빈 Body |

### 회원가입 요청

```json
{"email":"owner@example.com","password":"Umc!1234","nickname":"테스터1"}
```

- email: 필수, 이메일 형식
- nickname: 필수, 2~12자
- password: 필수, 8자 이상이며 영문 대문자·소문자·숫자·특수문자(`!@#$%^&*`) 각각 포함
- 저장 시 BCrypt 적용. 응답에는 password 필드 없음

성공 응답 예시(회원 ID는 실제 생성 값으로 대체):

```json
{"isSuccess":true,"code":"COMMON201","message":"회원가입에 성공했습니다.","result":{"memberId":1,"email":"owner@example.com","nickname":"테스터1"}}
```

### 평점 등록 요청

```json
{"movieId":606001,"score":5,"comment":"재밌어요."}
```

- movieId: 필수 양수
- score: 필수 정수 1~5
- comment: 선택, 최대 500자
- 회원·영화 조합당 평점 1개. 성공 응답의 `result` 숫자가 ratingId

```json
{"isSuccess":true,"code":"COMMON201","message":"평점 등록에 성공했습니다.","result":10}
```

### 평점 수정 요청

```json
{"score":3,"comment":"다시 보니 보통이었어요."}
```

수정 시에도 score는 필수 1~5이며 comment는 최대 500자입니다. movieId는 수정 항목이 아닙니다. comment 생략 시 현재 구현에서는 null로 변경됩니다.

```json
{"isSuccess":true,"code":"COMMON200","message":"평점 수정에 성공했습니다.","result":null}
```

평점 조회 응답은 공통 래퍼 없이 `ratingId, movieId, score, comment, createdAt, updatedAt`을 가진 객체 배열입니다.

### 실패 응답

| 상황 | HTTP | code |
|---|---|---|
| 이메일·비밀번호·닉네임·별점 등 검증 실패 | 400 | COMMON4001 |
| 이메일·닉네임·평점 중복 사전 확인 | 409 | COMMON4092 |
| DB 무결성 제약 위반 | 409 | COMMON4091 |
| 다른 회원의 평점 수정·삭제 | 403 | COMMON403 |
| 없는 평점 또는 등록 대상 회원 없음 | 404 | COMMON404 |

```json
{"isSuccess":false,"code":"COMMON4092","message":"이미 이 영화에 평점을 남기셨습니다.","result":null}
```

## Postman 실행 및 캡처

1. IntelliJ에서 `BE/week06` 서버를 실행하고 MySQL 접속 정보를 설정합니다.
2. Postman의 **Import → Files**에서 같은 폴더의 `week06.postman_collection.json`을 선택합니다.
3. 가져온 컬렉션의 01~19를 순서대로 열고 **Send**를 누릅니다. 회원 ID와 평점 ID는 응답에서 자동 저장됩니다. Environment는 없어도 됩니다.
4. POST/PATCH의 **Body → raw → JSON**과 URL·메서드, 응답 상태·Body가 함께 보이도록 캡처합니다. **Test Results**에서 자동 검사 결과도 확인할 수 있습니다.
5. 01 요청을 다시 보내면 새 실습으로 시작합니다. 중간 실패 시 원인을 해결한 뒤 01부터 재실행하세요. 회원 2명은 DB에 남고, 평점은 16번에서 삭제됩니다.

| 순서 | 요청 | 예상 상태 / 확인 사항 |
|---|---|---|
| 01 | 회원가입 | 201, result에 password 없음 |
| 02 | 두 번째 회원가입 | 201, 다른 memberId 확보 |
| 03 | 이메일 중복 회원가입 | 409 |
| 04 | 닉네임 중복 회원가입 | 409 |
| 05 | 잘못된 이메일 형식 | 400 |
| 06 | 약한 비밀번호 | 400 |
| 07 | 1자 닉네임 | 400 |
| 08 | 평점 등록 | 201, result에 ratingId |
| 09 | 같은 회원·영화 평점 중복 등록 | 409 |
| 10 | score 6으로 등록 | 400 |
| 11 | 평점 조회 | 200, 해당 영화 평점이 1개뿐인지 확인 |
| 12 | 본인 평점 수정 | 200 |
| 13 | 평점 조회 | 200, score 3과 수정한 후기 확인 |
| 14 | 다른 회원으로 수정 | 403 |
| 15 | 다른 회원으로 삭제 | 403 |
| 16 | 본인 평점 삭제 | 204, 응답 Body 없음 |
| 17 | 평점 조회 | 200, 삭제한 ratingId가 없음 |
| 18 | 삭제한 평점 수정 | 404 |
| 19 | 삭제한 평점 삭제 | 404 |

403은 반드시 삭제 전에 확인합니다. 이미 삭제한 평점은 조회 단계에서 404가 발생해 소유권 검사까지 가지 않습니다.

## DB 확인

서비스의 중복 검사 외에도 실제 MySQL에 UNIQUE 제약이 있어야 동시 중복 요청을 막을 수 있습니다. JPA 엔티티에 UNIQUE를 선언했지만 `ddl-auto: validate`는 기존 테이블에 제약을 생성하지 않습니다. DB 도구에서 아래 읽기 전용 SQL로 실제 구조를 확인하세요.

```sql
SHOW CREATE TABLE member;
SHOW CREATE TABLE rating;
-- member: email과 nickname 각각 UNIQUE
-- rating: (member_id, movie_id) 조합 UNIQUE

-- Postman 11번 시점에 실제 회원 ID를 대입: 결과가 1이어야 함
SELECT COUNT(*) FROM rating WHERE member_id = 1 AND movie_id = 606001;

-- 01에서 가입한 이메일을 대입: bcrypt 접두사($2a$, $2b$ 등)와 길이 60 확인
SELECT member_id, LEFT(password, 4) AS bcrypt_prefix,
       CHAR_LENGTH(password) AS hash_length
FROM member WHERE email = '실제 가입한 이메일';
```

## 핵심 코드 링크

아래 상대 링크는 저장소에 함께 제출하면 GitHub에서도 열립니다.

- [회원가입 Controller](../src/main/java/com/umc/movie/controller/MemberController.java)
- [입력값 검증 DTO](../src/main/java/com/umc/movie/dto/SignUpRequest.java)
- [bcrypt 설정](../src/main/java/com/umc/movie/config/PasswordConfig.java)
- [회원가입·암호화 저장](../src/main/java/com/umc/movie/service/MemberService.java)
- [비밀번호 없는 회원 응답 DTO](../src/main/java/com/umc/movie/dto/MemberResponse.java)
- [평점 POST·PATCH·DELETE와 HTTP 상태](../src/main/java/com/umc/movie/controller/RatingController.java)
- [평점 중복·소유권·존재 여부 확인](../src/main/java/com/umc/movie/service/RatingService.java)
- [평점 UNIQUE 선언](../src/main/java/com/umc/movie/entity/Rating.java)
- [일관된 오류 응답](../src/main/java/com/umc/movie/controller/GlobalExceptionHandler.java)
- [자동 테스트](../src/test/java/com/umc/movie/StandardMissionTests.java)

## 트러블 슈팅: Postman 평점 수정 요청의 405 오류

- 증상: `PATCH /members/1/ratings` 또는 `POST /members/1/ratings/1` 요청 시 `405 Method Not Allowed` 발생.
- 원인: 평점 등록은 `POST /members/{memberId}/ratings`, 수정은 `PATCH /members/{memberId}/ratings/{ratingId}`로 매핑되어 있는데 메서드와 URL 조합을 혼동했다.
- 해결: 수정 요청에서 PATCH를 선택하고 URL 끝에 실제 ratingId를 추가했다. Body는 `UpdateRatingRequest`에 맞게 score와 comment만 보냈다. 등록할 때는 POST와 컬렉션 URL을 사용하고 `CreateRatingRequest`에 맞게 movieId도 포함했다.
- 확인 방법: Postman 12에서 200, 13에서 수정값을 조회해 해결 여부를 확인한다. 이전 405 화면과 새 성공 화면을 함께 첨부할 수 있다.

## 검증 기록과 남은 제출물

`gradlew.bat --offline test --tests com.umc.movie.StandardMissionTests`: 16개 테스트 통과. 실제 Controller·Service·DTO·BCrypt를 사용하고 Repository를 대체하여 검증했습니다. 실제 MySQL 저장·제약·서버 기동 검증을 대체하지는 않습니다.

요청/응답 캡처는 Postman에서 실제 실행한 결과를 첨부해야 합니다. 이 문서의 예시는 실제 실행 결과를 가장한 캡처가 아닙니다. DB 확인과 Postman 캡처를 마친 뒤 제출하세요.
