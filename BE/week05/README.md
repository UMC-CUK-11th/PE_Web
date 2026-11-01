# 5주차 백엔드 미션

Java 21, Spring Boot 3.5, Spring Data JPA, MySQL 기반 영화 서비스 API입니다.

## 구현 내용

- 회원 닉네임 사용 가능 여부: `GET /members/nickname/{nickname}`
- 회원 이메일 사용 가능 여부: `GET /members/email/{email}`
- 회원별 평점 최신순 조회: `GET /members/{memberId}/ratings`
- 존재하지 않는 회원의 평점 조회 시 HTTP 404 응답
- 회원·평점 엔티티와 생성·수정 시각 관리
- `http://localhost:5173` 프론트엔드 CORS 허용

## 실행

MySQL에 엔티티와 일치하는 스키마를 먼저 준비해야 합니다. `ddl-auto: validate`를 사용하므로 테이블이 자동 생성되지 않습니다.

환경변수 `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`로 접속 정보를 설정합니다. 주소와 계정의 기본값은 `src/main/resources/application.yaml`을 참고하세요.

```powershell
$env:DB_URL = 'jdbc:mysql://localhost:3306/movie'
$env:DB_USERNAME = 'root'
$env:DB_PASSWORD = '<로컬 DB 비밀번호>'
.\gradlew.bat bootRun
```

## 검증

```powershell
.\gradlew.bat compileJava testClasses
.\gradlew.bat build
```

소스와 테스트 소스 컴파일을 확인했습니다. 전체 빌드의 `contextLoads` 테스트는 로컬 MySQL 인증 실패로 통과하지 못했습니다. 올바른 접속 정보와 스키마를 설정한 환경에서 재검증해야 합니다.
