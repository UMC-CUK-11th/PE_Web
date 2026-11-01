# movie — 5주차 영화 평점 서비스

기존 BE 도서 대여 프로젝트와 독립된 Spring Boot 3.5.0 / Java 21 / Gradle 프로젝트입니다.
기존 BE의 소스와 데이터베이스는 변경하지 않습니다.

## 로컬 실행 (PowerShell)
1. .env.example을 참고해 .env.local에 DB_USER, DB_PW를 입력합니다. 실제 비밀번호는 커밋하지 않습니다.
2. ./setup-db.ps1: umc_movie와 member/rating/favorite를 없을 때만 생성하고 더미 데이터를 중복 없이 추가합니다. 기존 데이터는 덮어쓰지 않습니다.
3. ./run-local.ps1 -Build: MySQL을 사용하는 통합 테스트와 빌드를 실행합니다.
4. ./run-local.ps1: localhost:8080으로 실행합니다.

환경 변수를 이미 설정했다면 gradlew.bat build / gradlew.bat bootRun도 가능합니다.
DB_URL 기본값은 로컬 umc_movie이며 필요하면 .env.local에서 지정할 수 있습니다.
SQL 스크립트는 MySQL의 CREATE DATABASE 권한이 있는 로컬 계정으로 실행합니다.
시드의 TEST_ONLY_NOT_A_PASSWORD는 테스트 표식이며 실제 인증용 비밀번호/해시가 아닙니다.

## API
- GET /members/nickname/{nickname}: available boolean
- GET /members/email/{email}: available boolean
- GET /members/{memberId}/ratings: ratingId DESC, 미존재 회원 404, 평점 없으면 []
- API 응답에 Member 엔티티나 password를 노출하지 않습니다.
- movie_id는 TMDB 영화 ID 일반 컬럼입니다. 별도 movie FK는 없습니다.
- favorite는 다음 주차용 스키마만 생성합니다.

## React 연동
FE에서 개발 서버를 localhost:5173으로 실행한 후 /backend-check에 접속합니다.
닉네임/이메일/회원 ID를 입력하고 각 버튼을 누르면 실제 fetch로 백엔드를 호출합니다.
localhost와 127.0.0.1은 서로 다른 origin입니다.
CORS는 http://localhost:5173만 허용하며 GET/POST/PATCH/DELETE 및 요청 헤더를 허용합니다.
기존 TMDB 영화 화면과 Zustand 북마크 코드는 유지합니다.

## 테스트
MovieApiIntegrationTest는 실제 MySQL과 전체 Spring 컨텍스트를 사용합니다.
닉네임/이메일, 평점 정렬·DTO, 404, 빈 배열, 입력 오류, CORS 허용·차단을 검증합니다.
테스트가 추가한 회원은 트랜잭션 롤백됩니다.

Java 21 테스트 환경에서는 Mockito의 동적 attach를 피하도록 테스트 JVM 시작 시 javaagent를 지정합니다. 애플리케이션 실행이나 보안 기능에는 영향을 주지 않습니다.
