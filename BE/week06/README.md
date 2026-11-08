# 6주차 백엔드 미션

[API 명세·Postman 캡처 순서·핵심 코드·트러블 슈팅](docs/SUBMISSION.md) / [Postman 컬렉션](docs/week06.postman_collection.json)

5주차 영화 API를 확장한 Java 21 / Spring Boot 프로젝트입니다.

## 5주차 이후 변경 사항

- 회원가입 API: `POST /members`
- BCrypt 비밀번호 암호화와 회원가입 요청 검증
- 평점 등록: `POST /members/{memberId}/ratings`
- 평점 수정: `PATCH /members/{memberId}/ratings/{ratingId}`
- 평점 삭제: `DELETE /members/{memberId}/ratings/{ratingId}`
- 공통 응답 DTO와 전역 예외 처리

기존 닉네임·이메일 확인 및 회원별 평점 조회 API도 포함합니다.

## 실행

Java 21과 MySQL이 필요합니다. `src/main/resources/application.yaml`의 DB 주소와 계정을 확인하고 `DB_PASSWORD` 환경변수를 설정하세요. `ddl-auto: validate`를 사용하므로 엔티티에 맞는 테이블을 미리 준비해야 합니다.

```powershell
$env:DB_PASSWORD = '<로컬 DB 비밀번호>'
.\gradlew.bat bootRun
```

## 컴파일 및 패키징

```powershell
.\gradlew.bat compileJava testClasses bootJar
```

이 명령은 DB 연결 테스트를 실행하지 않습니다. DB가 준비된 환경에서 `gradlew.bat test`로 별도 검증할 수 있습니다.

## 작업 위치

IntelliJ에서 이 폴더의 `build.gradle`을 열어 작업합니다. Git 저장소 루트는 상위 `PE_Web`이며, 작업 브랜치는 `week06`입니다. `BE/week05`는 지난 제출본으로 보존합니다.
