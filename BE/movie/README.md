# 영화 평점 서비스 백엔드

Java 21·Spring Boot 3.5.0·JPA·MySQL을 사용하는 5주차 필수 미션입니다.

## 실행

MySQL에 `umc_movie` 데이터베이스를 만들고, `src/main/resources/db/schema.sql`과 `seed.sql`을 순서대로 실행합니다. 시드는 빈 학습 DB에 한 번만 실행합니다.

`.env.example`을 `.env.local`로 복사하고 본인의 DB 접속 정보를 입력한 뒤 이 폴더에서 실행합니다.

```powershell
.\run-local.ps1
```

IntelliJ에서는 MovieApplication을 실행합니다. 작업 경로가 `BE` 또는 `BE/movie`이면 기존 `.env.local`을 자동으로 읽습니다. `BE` 프로젝트에서는 `MovieServer-Gradle` 실행 설정도 사용할 수 있습니다. 기본 포트는 8080입니다.

## 프론트 연결

FE 개발 서버를 실행하고 `http://localhost:5173/members`를 엽니다. CORS는 `http://localhost:5173`을 허용합니다.

화면에서 닉네임·이메일 중복 확인과 회원별 평점 조회를 사용할 수 있습니다. 시드의 `수현`, `noco@umc.com`은 이미 등록된 값이며, 회원 1은 평점 2개, 회원 3은 빈 목록, 회원 999는 404를 반환합니다.

## 빌드·검증

```powershell
.\gradlew.bat test bootJar
```

실제 서버는 MySQL을 사용하고, 통합 테스트에서만 별도 H2 DB를 사용합니다. `.env.local`은 Git에서 제외됩니다.
