# 7주차 제출·실행 안내

대상 프로젝트: `C:\umc\PE_Web\BE\movie`. Spring Boot로 구현했으므로 NestJS 코드는 추가할 필요가 없습니다.

## 완료 결과

- POST /auth/login: bcrypt 비교, JWT 발급, 200/COMMON200
- GET·PATCH /members/me: 토큰의 회원 ID 사용, 비밀번호 제외, 닉네임 중복 검사
- POST /ratings: 201/COMMON201 + RatingResponse
- PATCH·DELETE /ratings/{ratingId}: 소유권 검사, 삭제도 200 + result:null
- 401 사유 4종과 403/404/409 도메인 코드, 기존 전역 오류 처리 유지
- 공개 회원별 평점 조회 유지
- 선택 미션 `@LoginMember`와 ArgumentResolver 구현
- JUnit 통합·회귀 테스트 38개 통과, 실제 HTTP 요청 19개 통과

실제 HTTP 검증은 H2 메모리 DB(MySQL 호환 모드)에서 수행했습니다. MySQL 접속 검증은 수행하지 않았습니다. MySQL80 서비스는 실행 중이지만 DB_PASSWORD가 프로세스/사용자/시스템 환경변수에 없고, IDE에 조회된 실행 설정·DB 연결도 없었습니다.

## 사용하는 프로그램과 DBMS

| 도구 | 용도 | 현재 확인 상태 |
|---|---|---|
| IntelliJ IDEA | 코드 확인·서버 실행 | 설치 및 실행 확인 |
| Java 21 (Eclipse Adoptium) | Spring Boot 실행 | 실제 빌드·실행에 사용 |
| Gradle Wrapper | 의존성·빌드·JUnit | 실제 사용 |
| Postman 12.35.5 | API 요청·캡처 | 창 실행 확인, 컬렉션은 아래 파일에서 Import 필요 |
| H2 | 이번 자동 검증 DBMS | 서버 내부에서 실행, 별도 설치 불필요 |
| MySQL Server 8.0 | 기본 설정의 DBMS | MySQL80 서비스 Running, 접속 검증 미완료 |
| MySQL Workbench 8.0 | MySQL 접속용 GUI 클라이언트 | 설치 확인, 이번 H2 검증에는 사용하지 않음 |
| Node.js | 실제 HTTP 검증 스크립트 | 19개 요청 검증에 사용 |
| PowerShell | 빌드·서버·검증 명령 실행 | 실제 사용 |
| Notion | 학습 내용·미션 기록·사진 제출 | 아래 초안 복사 및 본인 회고·사진 추가 필요 |

Docker, NestJS, TMDB 키, 별도 movie 테이블은 이번 백엔드 실습에 필요하지 않습니다.

## 지금 바로 Postman으로 캡처하기

1. 서버 주소는 `http://localhost:8080`. 임시 H2 서버를 실행해 둔 상태입니다. 종료되었다면 아래 명령으로 다시 실행하세요.
2. Postman의 Import에서 `postman/week07.postman_collection.json`을 가져옵니다. 기존 6주차 컬렉션은 새 API 경로와 다릅니다.
3. 컬렉션 `UMC 7주차 인증 인가 검증`의 **01부터 19까지 순서대로** 실행합니다. Collection Runner로 한 번에 실행해도 됩니다. 이메일·닉네임·토큰·평점 ID는 스크립트가 자동 저장합니다.
4. 이미 이름이 같은 환경변수가 있으면 컬렉션 변수를 덮어쓸 수 있으므로 No Environment로 실행하세요.
5. 05 등록 화면은 **삭제 요청 12를 실행하기 전에** 캡처하세요. 12 이후에 05를 다시 등록하고 08을 실행해도 재현할 수 있습니다.

| 필수 제출 이미지 | 컬렉션 항목 | 화면에 반드시 포함할 것 |
|---|---|---|
| 1. 로그인 성공 | 03 A 로그인 | POST /auth/login, 200, COMMON200, result.nickname, result.accessToken |
| 2. 토큰 없음 | 09 토큰 없이 내 정보 | GET /members/me, Authorization = No Auth, 401, AUTH401_2 |
| 3. 타인 수정 실패 | 08 B 타인 평점 수정 | PATCH /ratings/{ratingId}, Bearer {{tokenB}}, 403, RATING403_1 |
| 4. 본인 등록 성공 | 05 A 평점 등록 | POST /ratings, Bearer {{tokenA}}, Body에 movieId·score·comment만, 201, COMMON201, result.ratingId |

Postman의 요청 영역과 응답 영역이 함께 보이게 캡처합니다. 05에서는 Body 탭을 열어 **memberId가 없다는 사실**이 보이게 하세요. 08은 Authorization 탭에 tokenB가 보이도록 한 장을 추가해도 좋습니다. 캡처는 이 자동화에서 저장하지 않았습니다. 저장된 JSON 응답은 실제 검증 기록이며 Postman 화면 캡처를 대체한다고 표기하지 마세요.

03의 테스트 전용 토큰은 jwt.io에서 직접 디코딩해 payload의 sub/email/iat/exp를 확인할 수 있습니다. 동일 내용의 로컬 디코딩 결과도 `docs/week07-evidence/jwt-decoded.json`에 저장했습니다. 외부 jwt.io 사이트에 붙여 넣는 동작은 이번 자동화에서 수행하지 않았습니다.

## 서버 재실행

임시 H2: 실제 MySQL 설정 없이 즉시 재현할 수 있습니다. 데이터는 서버 종료 시 사라집니다.

```powershell
cd C:\umc\PE_Web\BE\movie
.\scripts\start-e2e-backend.ps1
```

MySQL: Workbench에서 로컬 DB 연결 후 기존 `database/week06_existing_db_check.sql`로 구조를 확인합니다. 신규 DB에만 `database/week06_schema.sql`을 실행하세요. 7주차에 새 테이블·컬럼은 필요하지 않습니다. 기존 데이터는 자동 삭제하지 않습니다.

```powershell
cd C:\umc\PE_Web\BE\movie
$env:DB_PASSWORD = '본인 MySQL 비밀번호'
# 매 실행 때 임시 키를 생성하는 예시. 서버 재시작 시 기존 토큰은 무효가 됩니다.
$jwtKeyBytes = New-Object byte[] 48
$jwtRng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
try { $jwtRng.GetBytes($jwtKeyBytes) } finally { $jwtRng.Dispose() }
$env:JWT_SECRET = [Convert]::ToBase64String($jwtKeyBytes)
$env:JWT_ACCESS_EXPIRATION = '3600'
.\gradlew.bat --gradle-user-home "$env:USERPROFILE/.gradle" bootRun
```

IntelliJ에서 실행한다면 MovieApplication의 Run/Debug Configurations → Environment variables에 DB_PASSWORD, JWT_SECRET, JWT_ACCESS_EXPIRATION 세 항목을 설정합니다. **Spring Boot는 .env 파일을 자동으로 읽지 않습니다.** 실제 비밀키·비밀번호는 Git에 올리지 마세요. test 프로필의 키는 임시 H2 테스트 전용입니다.

## 재검증 명령과 결과 위치

```powershell
cd C:\umc\PE_Web\BE\movie
.\gradlew.bat --gradle-user-home "$env:USERPROFILE/.gradle" test
# 서버가 실행 중일 때:
node scripts/verify-week07.mjs
```

- 테스트 HTML: `build/reports/tests/test/index.html`
- 실제 HTTP: `docs/week07-evidence/summary.json`, 각 요청 `01.json`~`19.json`
- 토큰 디코딩: `docs/week07-evidence/jwt-decoded.json`
- 토큰을 포함하는 evidence 폴더는 Git에서 제외했습니다.
- 자동 검증은 워크북의 회원 준비 → 로그인 → 등록 → 중복 → 본인 수정 → 타인 수정 → 무토큰 → 없는 대상 삭제 → 본인 삭제 순서를 지켰습니다. 무토큰 내 정보 요청도 중간에 추가 검증했습니다.

## Notion에서 작성할 위치

- **핵심 키워드**: `docs/week07-learning.md` 내용을 복사합니다.
- **미션 기록**: `docs/week07-mission-record.md`를 복사하고 4장 캡처를 순서에 맞춰 삽입합니다. 중간 과정과 검증 결과를 함께 남깁니다.
- **학습 후기**: 초안에 본인이 실제로 이해한 내용과 어려웠던 점을 추가합니다. 직접 하지 않은 jwt.io 확인이나 MySQL 검증을 했다고 적지 마세요.
- **실습 인증**: 위 필수 캡처 4장을 넣습니다.
- **스터디 인증샷**: 스터디 때 실제로 촬영한 사진을 따로 넣어야 합니다.
- **미션 제출 링크**: 실제 Notion 페이지 공유 URL을 본인이 확인하고 UMC 사이트에 제출합니다. 외부 제출·Git push는 수행하지 않았습니다.

## 선택 미션

`@LoginMember`는 적용 완료했습니다. 컨트롤러의 `@LoginMember Long memberId`, ArgumentResolver, WebConfig 등록 화면과 13 내 정보 정상 응답을 추가 캡처하면 됩니다.

변경 전:
```java
@RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
```
변경 후:
```java
@LoginMember Long memberId
```

토큰 만료는 JUnit에서 만료 시각을 과거로 만든 서명된 토큰으로 AUTH401_4를 검증했습니다. **실시간 1분 대기 캡처는 아직 수행하지 않았습니다.** 해당 선택 미션을 제출한다면 JWT_ACCESS_EXPIRATION=60으로 서버를 재실행해 로그인 직후 13을 캡처하고, 같은 토큰으로 약 121초 뒤 다시 호출해 캡처하세요. 현재 clockSkewSeconds(60)이므로 만료 직후 60초까지 더 허용될 수 있습니다. 60초만 기다리면 항상 만료된다는 워크북 설명은 이 설정과 맞지 않습니다.
