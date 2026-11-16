# 8주차 백엔드 작업

7주차 JWT 인증을 기반으로 즐겨찾기와 영화 기록 API를 구현한 프로젝트입니다.

- `POST /favorites`: 즐겨찾기 등록
- `GET /favorites`: 내 즐겨찾기 목록 조회
- `GET /favorites/{movieId}`: 즐겨찾기 여부 조회
- `DELETE /favorites/{movieId}`: 즐겨찾기 해제
- `POST /movie-records`: 평점과 선택적 즐겨찾기 저장

모든 API는 `Authorization: Bearer <accessToken>`으로 인증한 회원을 기준으로 동작합니다. 영화 기록 요청에서 `addToFavorites`가 `true`이면 평점과 즐겨찾기를 같은 트랜잭션에서 저장합니다.

IntelliJ에서 이 폴더의 `build.gradle`을 Gradle 프로젝트로 열고 Java 21을 사용합니다. 서버 실행에는 엔티티에 맞는 MySQL 스키마와 `DB_PASSWORD`, `JWT_SECRET`, `JWT_ACCESS_EXPIRATION` 환경변수가 필요합니다.

```powershell
.\gradlew.bat bootRun
```
