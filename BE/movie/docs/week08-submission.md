# 8주차 백엔드 제출 안내

PowerShell에서 `C:\umc\PE_Web\BE\movie`로 이동한 뒤 아래 명령을 실행합니다.

```powershell
.\scripts\start-e2e-backend.ps1 -Port 8088
```

실습 서버 주소는 http://127.0.0.1:8088 입니다. 기존 8080 서버를 켜 둔 상태에서도 실행할 수 있습니다. Postman에서 [8주차 컬렉션](../postman/week08.postman_collection.json)을 Import하고 No Environment 상태로 01부터 순서대로 실행합니다. 01–04에서 테스트 회원 두 명을 만들고 로그인 토큰을 저장합니다. 기존 계정을 준비할 필요가 없습니다.

증빙 ZIP은 `BE/outputs/week08-be-evidence.zip`에 있습니다. `06`–`18` 등 번호가 붙은 PNG는 실제 H2 서버의 요청과 응답을 정리한 화면입니다. Postman 데스크톱 캡처가 필수라면 표의 6개 응답을 Postman에서 촬영합니다. `transaction-code.png`와 `swagger-*.png`는 바로 첨부할 수 있습니다.

| 첨부 순서 | Postman 항목 | 캡처할 내용 |
| --- | --- | --- |
| 1 | 06 | POST /favorites, movieId만 있는 바디, 201 및 favoriteId |
| 2 | 07 | 같은 바디에서 409 FAVORITE409_1 |
| 3 | 08 | GET /favorites, 200 및 내 목록 |
| 4 | 09 | GET /favorites/550, 200 및 isFavorite: true |
| 5 | 12 | DELETE /favorites/550, 200 및 result: null |
| 6 | 18 | POST /movie-records, addToFavorites: true, 201 및 rating과 favorite |
| 7 | MovieRecordService.create | @Transactional과 두 서비스 호출이 한 화면에 보이도록 |
| 보충 | 05, 13, 21–23 | false → true → false 변화 및 평점 롤백 증거 |

코드 캡처 아래에는 “즐겨찾기 저장이 실패하면 먼저 저장한 평점도 취소해 사용자가 요청한 기록이 일부만 남지 않도록 두 작업을 하나의 트랜잭션에 묶었다.”를 적습니다.

선택 미션 화면은 http://127.0.0.1:8088/swagger-ui/index.html 에서 확인합니다. API 목록과 `POST /movie-records`를 펼친 요청·응답 예시를 첨부합니다. 공개 로그인은 토큰 없이 호출하고 나머지 8주차 API는 **Authorize**에 JWT를 입력합니다.

Notion의 **핵심 키워드**에는 [학습 정리](week08-learning.md), **미션 기록·트러블 슈팅**에는 [실습 기록](week08-mission-record.md)을 붙여 넣습니다. **학습 후기**에는 초안을 참고해 본인이 이해한 점을 적고, **실습 인증**에는 위 순서로 사진을 첨부합니다. 스터디 단체 사진은 실제 촬영한 사진을 추가합니다. 코드 링크는 제출 브랜치를 올린 뒤 아래 파일의 GitHub URL로 연결합니다.

- [Favorite 엔티티](../src/main/java/com/umc/movie/entity/Favorite.java), [Repository](../src/main/java/com/umc/movie/repository/FavoriteRepository.java), [서비스](../src/main/java/com/umc/movie/service/FavoriteService.java), [컨트롤러](../src/main/java/com/umc/movie/controller/FavoriteController.java)
- [영화 기록 서비스](../src/main/java/com/umc/movie/service/MovieRecordService.java), [롤백 통합 테스트](../src/test/java/com/umc/movie/MovieRecordIntegrationTests.java)

| 환경 | 용도 |
| --- | --- |
| IntelliJ IDEA · Java 21 · Gradle Wrapper | 코드 편집, 서버 실행 및 JUnit |
| PowerShell · Node.js | 실행 및 실제 HTTP 검증 |
| Postman | 로컬 REST 요청 및 과제 캡처 |
| Chrome · Swagger UI | 선택 미션 및 증빙 이미지 |
| H2 2.3.232 | 검증한 인메모리 DB. 종료하면 실습 데이터가 없어집니다. |
| MySQL Server 8.0 | 기본 설정의 DBMS. MySQL80 실행은 확인했고 DB 인증 정보가 없어 실접속은 미검증입니다. |
| MySQL Workbench 8.0 | MySQL 접속 및 SQL 실행에 사용하는 클라이언트 |

MySQL로 실행할 때는 Workbench에서 기존 `umc_movie`의 `member`와 `rating` 테이블을 확인한 후 [즐겨찾기 스키마](../database/week08_favorite.sql)를 실행합니다. 기존 `favorite`는 `SHOW CREATE TABLE favorite`로 확인하며, 복합 UNIQUE `(member_id, movie_id)`와 `member_id` FK가 필요합니다. 새 DB라면 먼저 [6주차 스키마](../database/week06_schema.sql)를 실행합니다. 이후 기존 `DB_PASSWORD`, `JWT_SECRET`, `JWT_ACCESS_EXPIRATION` 설정으로 기본 프로필을 실행합니다.

검증을 다시 실행하려면 서버를 켠 뒤 `node scripts/verify-week08.mjs`를 실행합니다. 실제 HTTP 결과는 `build/week08-evidence/http-results.json`에 저장됩니다.
