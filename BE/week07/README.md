# 7주차 백엔드 작업

6주차 영화 평점 서비스를 기반으로 만든 7주차 작업 폴더입니다. 7주차 기능은 이 폴더에서 구현합니다.

IntelliJ에서 이 폴더의 `build.gradle`을 Gradle 프로젝트로 열고 Java 21을 사용합니다. 서버 실행에는 기존 MySQL 스키마와 `DB_PASSWORD` 환경변수가 필요합니다.

```powershell
.\gradlew.bat bootRun
```

6주차 기능의 회귀 테스트와 JAR 빌드는 DB 없이 다음 명령으로 확인할 수 있습니다.

```powershell
.\gradlew.bat test --tests com.umc.movie.StandardMissionTests bootJar
```
