# Movie — UMC Product Engineering Week 05

기존 `BE/study`와 독립된 NestJS 영화 평점 서버입니다. npm을 사용합니다.

## 실행

Node 24 LTS 또는 Node 22.22.3 이상을 권장합니다. 현재 시스템 Node 22.19.0에서도 빌드와 테스트는 통과했으나, Nest CLI의 하위 의존성에서 엔진 경고가 발생합니다.

```powershell
Set-Location 'C:\Users\proce\OneDrive\문서\ChatGPT\UMC11th\BE\movie'
npm ci
```

로컬 `.env`를 열고 MySQL 접속 정보를 입력합니다. `.env.example`은 공개 가능한 예시이며, 실제 `.env`는 Git에서 제외됩니다.

실행 대상은 Windows 호스트의 `DB_HOST=127.0.0.1`, `DB_PORT=3307`, `DB_USER=root`, `DB_NAME=umc_movie`입니다. TypeORM 기본값과 `.env.example`도 3307로 맞췄습니다. `DB_PASSWORD`는 사용자가 `.env`에 직접 입력하며 실제 환경 파일은 커밋하지 않습니다.

실제 MySQL 연결 및 API 런타임 검증은 사용자가 Windows 로컬 터미널에서 수행합니다. Codex에서는 실제 DB 연결을 재시도하거나, MySQL의 외부 접근 설정을 변경하거나, 새 인스턴스를 만들지 않습니다. DB 없이 가능한 빌드와 테스트 저장소 기반 검증은 별도로 수행합니다.

비밀번호 입력 후 연결 상태를 먼저 확인할 수 있습니다.

```powershell
npm run db:check
```

이 명령은 `.env`에서만 접속 정보를 읽고 MySQL 연결·DB 존재·세 테이블 존재를 조회합니다. 비밀번호나 원본 오류 메시지를 출력하지 않고 DB를 생성하거나 수정하지 않습니다. 비밀번호 미입력, DB/테이블 누락 또는 연결 실패 시 종료 코드는 1입니다. DB가 없다고 나오면 아래 SQL 준비를 진행합니다.

새로운 개발 DB에 `sql/schema.sql`, `sql/seed.sql` 순서로 실행합니다. MySQL Workbench에서 두 SQL 파일을 각각 열어 실행하거나 MySQL CLI를 사용할 수 있습니다. SQL은 기존 테이블을 삭제하지 않습니다. 테이블 생성과 seed 삽입은 최초 한 번만 실행합니다.

CLI 사용 예시(이 폴더에서 시작):

```powershell
mysql --host=127.0.0.1 --port=3307 --user=root --password
```

MySQL 프롬프트에서:

```sql
source sql/schema.sql;
source sql/seed.sql;
USE umc_movie;
SHOW TABLES;
SELECT member_id, email, nickname FROM member;
SELECT rating_id, member_id, movie_id, score, comment FROM rating ORDER BY rating_id DESC;
```

DB 계정이 `CREATE DATABASE` 권한을 가지고 있어야 합니다. 이미 DB가 준비되어 있다면 해당 DB 상태를 확인한 뒤 테이블/seed SQL만 적용하세요. `synchronize: false`이므로 서버가 테이블을 자동 생성하지 않습니다.

```powershell
npm run start:dev
```

기본 주소는 `http://localhost:3000`입니다. `BE/study` 서버와 동시에 같은 3000번 포트를 사용하지 않도록 합니다.

서버 기동 시 TypeORM 연결 오류가 반복되지 않고 Nest의 정상 시작 로그가 표시되는지 확인합니다. 이어서 아래 실제 API 검증을 실행합니다. 터미널의 환경 변수로 DB_* 값을 별도 지정했다면 `.env`보다 우선할 수 있으므로 해당 값도 함께 확인합니다.

## API

| Method | URL | 응답 |
| --- | --- | --- |
| GET | `/members/nickname/:nickname` | `{ "available": boolean }` |
| GET | `/members/email/:email` | `{ "available": boolean }` |
| GET | `/members/:memberId/ratings` | `RatingResponseDto[]` |

- 닉네임 2~12자, 이메일 형식 검증에 실패하면 400을 반환합니다.
- memberId는 양의 안전한 정수여야 합니다. `ParseIntPipe`를 적용했습니다.
- 없는 유저는 404와 `존재하지 않는 유저입니다.`를 반환합니다.
- 존재하는 유저가 평점을 남기지 않았으면 `[]`를 반환합니다.
- 평점은 `rating_id DESC` 순서입니다. Member/비밀번호는 응답에 포함하지 않습니다.
- MySQL BIGINT는 내부적으로 문자열로 보존하고, 응답 DTO에서는 안전한 정수인지 확인한 후 숫자로 반환합니다.
- TMDB `movie_id`는 외부 식별자입니다. Movie Entity/Table/FK는 만들지 않았습니다.
- Favorite는 SQL 테이블만 준비했습니다.

## 브라우저 연결과 CORS

`FE/umcine/.env.local`의 `VITE_BACKEND_API_BASE_URL=http://localhost:3000`을 확인합니다.

프런트엔드를 `http://localhost:5173`에서 열고 `/api-test`로 이동합니다. 세 폼을 제출하면 실제 서버로 요청합니다. `127.0.0.1:5173`은 허용한 Origin과 다르므로 **localhost** 주소를 사용합니다.

`src/configure-app.ts`에서 허용 Origin을 `http://localhost:5173`으로 제한하고 GET/POST/PATCH/DELETE를 허용합니다. `main.ts`가 이 설정을 적용합니다. CORS 오류 실습은 `.env`에서 `CORS_ENABLED=false`로 바꾼 후 서버를 재시작하고 `/api-test` 폼을 제출하면 됩니다. 실습 후 다시 `true`로 바꾸고 재시작합니다.

## 검증

```powershell
npm run build
npm test
```

자동 테스트 7개는 실제 HTTP 서버에 요청하되 TypeORM Repository만 테스트용 데이터로 대체합니다. 실제 MySQL 연결/SQL 실행을 검증한 것으로 해석하면 안 됩니다. 기본 실행 서버에는 이 대체 저장소가 등록되지 않습니다.

Seed 기준 확인:

Postman에서 `postman/week05-movie.postman_collection.json`을 Import하면 요청 10개와 응답 검증 스크립트를 사용할 수 있습니다. 컬렉션은 새 DB에 제공한 seed가 있는 상태를 기준으로 합니다. 세 API의 정상 응답, 없는 회원 404, 잘못된 입력 400, CORS 응답 헤더를 확인합니다. 실제 비밀번호나 토큰은 포함하지 않습니다. 실제 서버가 실행된 후 사용하며, 브라우저 `/api-test` 확인은 별도로 진행합니다.

| 요청 | 예상 결과 |
| --- | --- |
| `/members/nickname/수현` | `available: false` |
| `/members/nickname/꿀범` | `available: true` |
| `/members/email/noco@umc.com` | `available: false` |
| `/members/1/ratings` | ratingId 2, 1 순서 |
| `/members/999/ratings` | 404 |

PowerShell에서 직접 확인하려면 서버 실행용 터미널을 유지한 채 새 터미널에서 실행합니다.

```powershell
$apiBase = 'http://localhost:3000'
$nickname = [uri]::EscapeDataString('수현')
Invoke-RestMethod "$apiBase/members/nickname/$nickname"
Invoke-RestMethod "$apiBase/members/email/noco@umc.com"
Invoke-RestMethod "$apiBase/members/1/ratings" | ConvertTo-Json -Depth 5
curl.exe -i "$apiBase/members/999/ratings"
curl.exe -i "$apiBase/members/nickname/a"
curl.exe -i "$apiBase/members/email/not-an-email"
```

마지막 세 요청의 예상 상태는 각각 404, 400, 400입니다. 999번 회원이 실제 DB에 존재하지 않는다는 전제입니다. 회원은 있지만 평점이 없는 경우에는 별도로 존재하는 회원 ID를 사용해 `[]`를 확인합니다.

프런트 실행도 같은 Windows 호스트에서 해야 한다면 별도 터미널에서 다음을 실행합니다.

```powershell
Set-Location 'C:\Users\proce\OneDrive\문서\ChatGPT\UMC11th\FE\umcine'
pnpm dev --port 5173 --strictPort
```

`http://localhost:5173/api-test`에서 닉네임 `수현`, 이메일 `noco@umc.com`, Member ID `1`의 세 폼을 모두 제출합니다. 제공한 seed 기준으로 중복/중복/평점 2개가 표시되어야 합니다. Network에서 세 응답의 status와 JSON을 캡처합니다. CORS 확인을 위해 주소는 `127.0.0.1` 대신 `localhost:5173`을 사용합니다. 이미 프런트가 5173에서 실행 중이라면 중복 실행하지 않습니다.

설치 시 발견한 Multer 취약점은 같은 메이저의 수정 버전(`^2.5.0`) override로 해결했습니다. Nest 버전을 강제로 다운그레이드하지 않았습니다.
