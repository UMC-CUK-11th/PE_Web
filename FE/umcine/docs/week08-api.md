# 8주차 실제 연결 API

서버: http://localhost:8080. JSON 요청은 Content-Type: application/json을 사용합니다. 인증 요청은 Authorization: Bearer {accessToken}을 전송합니다. 회원 ID는 토큰 검증 결과를 사용합니다.

| Method | 경로 | 요청 Body | 성공 result |
|---|---|---|---|
| POST | /members | email, nickname, password | 201, memberId/email/nickname |
| POST | /auth/login | email, password | 200, nickname/accessToken |
| GET | /members/me | 없음 | 200, memberId/email/nickname/createdAt |
| PATCH | /members/me | nickname | 200, 갱신된 내 정보 |
| GET | /favorites | 없음 | 200, Favorite 배열 |
| GET | /favorites/{movieId} | 없음 | 200, {movieId,isFavorite} |
| POST | /favorites | movieId | 201, 생성한 Favorite |
| DELETE | /favorites/{movieId} | 없음 | 200, null |
| GET | /members/{memberId}/ratings | 없음 | 200, 평점 DTO 배열(기존 공개 조회) |
| POST | /ratings | movieId, score, comment(선택) | 201, 평점 DTO |
| PATCH | /ratings/{ratingId} | score, comment(선택) | 200, 갱신된 평점 DTO |
| DELETE | /ratings/{ratingId} | 없음 | 200, null |

평점 쓰기 URL은 현재 7주차 JWT 백엔드의 /ratings 계약을 사용합니다. 6주차의 /members/{memberId}/ratings 쓰기 URL을 사용하지 않습니다. 삭제 상태도 현재 서버 계약에 맞춰 200을 처리합니다.

즐겨찾기는 기존 백엔드에 없어 이번에 추가했습니다. 원문에 endpoint 이외의 응답 필드가 제공되지 않아 FE/BE가 위 계약을 함께 사용하도록 구현했습니다. Favorite은 favoriteId, movieId, createdAt을 포함하며 한 회원/영화 조합은 한 건입니다. movieId는 TMDB ID이고 로컬 movie FK가 없습니다.

내 정보 응답에는 기존 필드 외에 memberId를 추가했습니다. 클라이언트가 서버가 검증한 회원 ID로 내 평점을 조회할 수 있게 하며, JWT를 임의 디코딩한 ID를 인증 근거로 사용하지 않습니다.

평점 DTO: ratingId, movieId, score, comment, createdAt, updatedAt.

회원별 평점 공개 조회 외의 내 정보/즐겨찾기/평점 쓰기는 인증이 필요합니다. 즐겨찾기 삭제는 토큰 회원과 movieId 조건을 함께 사용하므로 다른 회원의 즐겨찾기를 삭제하지 않습니다. 평점 수정/삭제는 기존 소유자 검사로 다른 회원 요청을 403으로 거부합니다.

성공·실패는 isSuccess/code/message/result 구조입니다. 기존 공개 중복 확인은 {available:boolean}, 공개 평점 조회는 DTO 배열 계약을 유지합니다. 잘못된 형식은 400, 인증 오류는 401, 평점 소유권 위반은 403, 없는 데이터는 404, 중복 저장은 409로 처리합니다.
