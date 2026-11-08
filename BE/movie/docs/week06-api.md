# 6주차 API 명세

기본 주소: `http://localhost:8080`. JSON 요청은 `Content-Type: application/json`을 사용합니다. 현재 로그인 기능은 없으며 memberId를 URL로 전달합니다.

## 공통 응답

POST/PATCH 성공 및 API 오류의 구조:

```json
{"isSuccess":true,"code":"COMMON201","message":"회원가입에 성공했습니다.","result":{"memberId":1,"email":"umc@example.com","nickname":"moviefan"}}
```

```json
{"isSuccess":false,"code":"MEMBER4091","message":"이미 사용 중인 이메일입니다.","result":null}
```

위 ID는 설명용 예시입니다. 실제 생성 ID는 DB와 실행 순서에 따라 다릅니다. DELETE 성공은 HTTP 204이므로 JSON 본문이 없습니다. 5주차 GET 성공은 기존 계약을 유지합니다.

| Method | 경로 | 요청 | 성공 응답 |
|---|---|---|---|
| POST | /members | email, password, nickname | 201, result: {memberId,email,nickname} |
| POST | /members/{memberId}/ratings | movieId, score, comment(선택) | 201, result: ratingId 숫자 |
| PATCH | /members/{memberId}/ratings/{ratingId} | score, comment(선택) | 200, result: null |
| DELETE | /members/{memberId}/ratings/{ratingId} | 없음 | 204, 본문 없음 |
| GET | /members/nickname/{nickname} | 없음 | 200, {available: boolean} |
| GET | /members/email/{email} | 없음 | 200, {available: boolean} |
| GET | /members/{memberId}/ratings | 없음 | 200, 평점 DTO 배열 |

GET 평점 DTO는 ratingId, movieId, score, comment, createdAt, updatedAt을 포함하고, ratingId 내림차순입니다. 없는 회원의 조회는 404입니다.

## 회원가입

```http
POST /members
Content-Type: application/json

{"email":"umc@example.com","password":"Umc!1234","nickname":"moviefan"}
```

- email: 필수, 공백 불가, 이메일 형식, 254자 이하
- nickname: 필수, 공백 불가, 2~12자
- password: 필수, 영문 대문자·소문자·숫자·특수문자(!@#$%^&*)를 모두 포함하고 8자 이상
- bcrypt의 입력 제한에 맞춰 비밀번호는 UTF-8 기준 72바이트 이하. 저장되는 해시는 60자
- 응답에는 password 및 해시를 포함하지 않음

## 평점 등록

```http
POST /members/1/ratings
Content-Type: application/json

{"movieId":550,"score":5,"comment":"재미있게 봤어요."}
```

성공 예: `{"isSuccess":true,"code":"COMMON201","message":"평점 등록에 성공했습니다.","result":1}`

- movieId: 필수 양의 정수(Long), TMDB ID. 로컬 movie FK 없음
- score: 필수 정수, 1~5
- comment: 선택, null 또는 500자 이하 문자열
- 회원이 존재해야 하며, 같은 회원/영화 조합은 한 건만 허용
- JSON의 1.5 같은 소수 점수/영화 ID는 400으로 거부

## 평점 수정

```http
PATCH /members/1/ratings/1
Content-Type: application/json

{"score":4,"comment":"수정한 후기입니다."}
```

성공 예: `{"isSuccess":true,"code":"COMMON200","message":"평점 수정에 성공했습니다.","result":null}`

score는 필수입니다. comment를 생략하거나 null로 전달하면 기존 후기를 지웁니다. memberId와 작성자가 다르면 403, ratingId가 없으면 404입니다. 영화 ID는 수정하지 않습니다.

## 평점 삭제

```http
DELETE /members/1/ratings/1
```

성공: `204 No Content`, 본문 없음. 소유자가 다르면 403, 없는 평점이면 404입니다.

## 오류 코드

| HTTP | code | 발생 조건 |
|---|---|---|
| 400 | COMMON4001 | DTO 검증 실패, 잘못된 JSON/경로 ID 자료형, 소수 정수 입력 |
| 400 | COMMON400 | 비밀번호 UTF-8 72바이트 초과 |
| 403 | COMMON403 | 타인의 평점 수정/삭제 |
| 404 | COMMON404 | 회원 또는 평점 없음 |
| 409 | MEMBER4091 | 이메일 사전 중복 검사 실패 |
| 409 | MEMBER4092 | 닉네임 사전 중복 검사 실패 |
| 409 | COMMON409 | 같은 회원/영화 평점 사전 중복 검사 실패 |
| 409 | COMMON4091 | DB UNIQUE/FK 등 무결성 제약 위반 |

검증 오류가 여러 개면 그중 첫 번째 메시지를 반환하며, 오류 순서에 의존하지 않습니다. DB 오류의 SQL과 내부 메시지는 응답에 노출하지 않습니다.

## DB와 트랜잭션

서비스의 사전 검사는 사용자에게 이해하기 쉬운 오류를 줍니다. 두 요청의 사전 검사가 동시에 통과할 수 있으므로 DB UNIQUE가 최종 중복 저장을 막습니다. 서비스의 쓰기 메서드는 트랜잭션 안에서 동작하고, 실패하면 롤백됩니다. 수정은 JPA 변경 감지를 사용합니다. BCrypt는 내부 salt를 사용하므로 같은 비밀번호도 다른 해시로 저장될 수 있습니다.
