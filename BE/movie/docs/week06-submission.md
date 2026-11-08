# 6주차 구현 및 제출 안내

`movie` 프로젝트에 Spring Boot로 구현했습니다. `study`는 이번 과제 대상이 아닙니다.

## 완료한 코드

- POST /members: DTO 검증, bcrypt 해시 저장, 비밀번호 없는 DTO, 201
- POST /members/{memberId}/ratings: 회원 존재 확인, 중복 확인, 201 및 ratingId
- PATCH /members/{memberId}/ratings/{ratingId}: 소유자 확인, 검증, 수정, 200
- DELETE /members/{memberId}/ratings/{ratingId}: 소유자 확인, 삭제, 본문 없는 204
- 400/403/404/409 공통 오류 응답, 이메일/닉네임 중복 코드 구분
- DB UNIQUE/FK 제약 확인 및 DB 저장 실패의 공통 오류 변환
- 5주차 GET API의 경로와 성공 응답 유지

## 1. DBMS에서 할 일

1. MySQL Workbench에서 로컬 MySQL에 접속합니다.
2. 신규 DB면 `database/week06_schema.sql`을 열어 실행합니다. `umc_movie`와 두 테이블을 생성합니다.
3. 이미 `umc_movie`가 있다면 `database/week06_existing_db_check.sql`로 기존 구조와 중복 데이터를 점검합니다. `CREATE TABLE IF NOT EXISTS`는 기존 테이블의 구조를 고치지 않습니다.
4. 반드시 필요한 DB 규칙은 `member.email UNIQUE`, `member.nickname UNIQUE`, `rating(member_id,movie_id) UNIQUE`, `rating.member_id → member.member_id FK`입니다. password는 VARCHAR(60), score는 TINYINT여야 합니다. 기존 DB에 없는 규칙만 점검 SQL 하단의 ALTER 문을 선택 실행하세요.
5. 기존 데이터에 중복 또는 고아 평점이 있다면 내용을 확인해 수동 정리한 다음 제약을 추가합니다. 제공 SQL은 기존 데이터를 자동 삭제하지 않습니다.
6. `movie_id`는 TMDB ID입니다. 별도 movie 테이블이나 TMDB API 키는 이번 백엔드 과제에 필요하지 않습니다.

`ddl-auto: validate`를 유지하므로 서버가 테이블을 자동 생성하지 않습니다. DB 설정은 `src/main/resources/application.yaml`에 있습니다. 실제 DB 사용자명이 root가 아니라면 username을 로컬 설정에 맞추세요.

## 2. 실행

PowerShell에서:

```powershell
cd C:\umc\PE_Web\BE\movie
$env:DB_PASSWORD = '본인 MySQL 비밀번호'
.\gradlew.bat --gradle-user-home "$env:USERPROFILE\.gradle" bootRun
```

비밀번호는 실행하는 터미널에만 설정합니다. IntelliJ로 실행한다면 Run/Debug Configurations → MovieApplication → Environment variables에 `DB_PASSWORD`를 등록하세요. `.env` 파일만 만드는 것으로 Spring Boot가 자동으로 읽지는 않습니다.

서버 기본 주소는 `http://localhost:8080`입니다. 프론트 연결은 localhost:5173의 CORS를 허용합니다. Postman만으로 실습·제출할 수 있습니다.

## 3. Postman 실행과 캡처

`postman/week06.postman_collection.json`을 Import합니다. 컬렉션 변수 `baseUrl`을 확인하고 01 → 17 순서로 실행하세요. 회원 ID와 평점 ID는 응답에서 자동으로 저장합니다. 새로 시작할 때 01부터 다시 실행하면 새로운 테스트 이메일과 닉네임을 만듭니다. 테스트 회원 2명은 DB에 남고 마지막 요청에서 평점은 삭제됩니다.

워크북의 필수 인증 3장:

- **01 회원가입 성공:** 요청 JSON, HTTP 201, 응답 DTO에 password가 없음을 보이게 캡처
- **04 이메일 검증 실패:** 잘못된 이메일 요청, HTTP 400, 공통 오류 JSON을 캡처
- **05 평점 등록 성공** 또는 **11 평점 수정 성공:** 요청, HTTP 201/200, 응답을 캡처

Standard Mission 증빙도 남기려면 다음 응답을 추가 캡처하세요.

- 02 이메일 중복, 03 닉네임 중복: 서로 다른 code를 가진 409
- 06 중복 평점 409, 07 잘못된 별점 400: 실패 종류 2가지 이상 증빙
- 09/10 타인 평점 변경: 403
- 13/14 없는 평점 변경: 404
- 12 수정 결과 조회: score=4 확인
- 16 삭제: 204 및 빈 본문, 17 재조회: []

캡처는 서버 실행 후 실제 Postman 화면에서 직접 남겨야 합니다. 테스트 결과나 문서의 응답 예시를 실제 캡처로 대신 제출하지 마세요.

## 4. Notion에 넣을 제출물

- API 명세: `docs/week06-api.md` 내용
- 위 실제 요청/응답 캡처 3장 이상과 실패·삭제 확인 기록
- GitHub에 올린 핵심 코드 링크: 아래 목록
- 트러블슈팅 1건: `docs/week06-mission-record.md`의 실제 해결 기록 사용 가능
- 학습 후기: 같은 문서에 초안을 두었으니 실제 이해한 내용에 맞게 수정
- 스터디 인증샷: 스터디 리더가 대표로 남길 사진을 확인

핵심 코드 링크로 넣을 파일:

- `src/main/java/com/umc/movie/dto/SignUpRequest.java`
- `src/main/java/com/umc/movie/dto/CreateRatingRequest.java`, `UpdateRatingRequest.java`
- `src/main/java/com/umc/movie/config/PasswordConfig.java`
- `src/main/java/com/umc/movie/service/MemberService.java`, `RatingService.java`
- `src/main/java/com/umc/movie/controller/MemberController.java`, `RatingController.java`, `GlobalExceptionHandler.java`
- `src/main/java/com/umc/movie/dto/ApiResponse.java`
- `src/main/java/com/umc/movie/entity/Member.java`, `Rating.java`
- `database/week06_schema.sql`

아직 GitHub에 커밋/푸시하거나 Notion/UMC에 제출하지 않았습니다. 현재 작업 브랜치는 `week05`입니다. 6주차를 별도 브랜치로 관리한다면 커밋 전에 `week06` 브랜치를 만드세요. GitHub 업로드 시 이번 변경은 `BE/movie` 경로만 선택하세요. 작업 전에 이미 있던 FE 변경은 이번 과제 작업에 포함하지 않았습니다.

Notion 미션 기록을 완성한 뒤 공유 → 링크 복사 → 워크북에서 안내한 https://umc.ai.kr/ 에 **Notion 페이지 URL**을 제출하세요. CodeRabbit 리뷰와 블로그 챌린지는 워크북 안내에 따라 선택 진행합니다.

## 5. 검증 결과와 한계

```powershell
cd C:\umc\PE_Web\BE\movie
.\gradlew.bat --gradle-user-home "$env:USERPROFILE\.gradle" test
```

자동 테스트는 `test` 프로필의 H2(MySQL 모드)에서 실행하므로 DB_PASSWORD나 로컬 MySQL 없이 가능합니다. 운영 설정은 MySQL + validate를 유지했습니다. 테스트 보고서는 `build/reports/tests/test/index.html`에서 확인합니다.

H2와 MySQL은 서로 다른 DBMS이므로 실제 MySQL의 접속, 기존 스키마, 정렬 규칙까지 검증한 결과는 아닙니다. 로컬 MySQL 서비스는 실행 중이지만 작업 환경에 DB_PASSWORD가 없어 실제 MySQL 연결과 Postman 캡처는 미확인 상태입니다.

## 6. 선택 Challenge 증빙

이메일 사전 중복은 MEMBER4091, 닉네임은 MEMBER4092, DB 제약 위반은 COMMON4091로 응답합니다. DB 제약 위반도 성공/실패 공통 구조를 사용합니다.

`DatabaseConflictApiTests`는 첫 가입 후 사전 조회만 false로 고정해 오래된 조회 결과를 재현하고, 두 번째 저장은 **실제 H2 DB UNIQUE 제약**에서 실패하게 합니다. 이를 통해 공통 409 변환을 검증합니다. 실제 동시 요청을 보낸 테스트는 아닙니다.

선택 미션을 제출하려면 실제 MySQL에서 동일 이메일로 동시 가입 요청을 보내 DB UNIQUE 위반 로그와 409 응답을 함께 캡처하세요. 두 요청이 모두 사전 조회를 통과해야 DB 제약을 재현할 수 있습니다. 단순 반복 요청의 MEMBER4091은 서비스 검사 결과이므로 DB 제약 위반 증거와 구분해야 합니다. 테스트용 우회 코드는 실제 API에 추가하지 않았습니다.
