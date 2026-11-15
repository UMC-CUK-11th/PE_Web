# PE_Web
UMC CUK 11th PE_Web

## 프로젝트

- `FE/umcine`: React · TypeScript · Vite 영화 웹 앱
- `FE/week1-typescript`: 1주차 TypeScript 실습 보존
- `BE/study`: 3~4주차 도서 대여 프로젝트 보존
- `BE/movie`: 5주차부터 사용하는 별도 Spring Boot 3.5.0 · Java 21 영화 프로젝트

## 프론트 실행

`FE/umcine/.env.local`에 아래 변수 이름으로 본인의 TMDB API Read Access Token을 설정한다. 값은 Git에 올리지 않는다.

```dotenv
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_ACCESS_TOKEN=본인이_발급받은_토큰
VITE_API_BASE_URL=http://localhost:8080
```

```powershell
cd FE/umcine
corepack.cmd pnpm@12.4.2 install
corepack.cmd pnpm@12.4.2 dev
# 빌드: corepack.cmd pnpm@12.4.2 build
```

pnpm이 PATH에 설치되어 있으면 `pnpm install`, `pnpm dev`, `pnpm build`로 실행해도 된다.

## 백엔드 실행

로컬 MySQL에서 `umc_movie` DB를 준비하고 `BE/movie/sql/schema.sql`, `seed.sql`을 순서대로 실행한다. 기존 도서 DB는 변경하지 않는다.

`BE/movie/.env.local`에 로컬 설정을 작성한다. 이 파일도 Git 제외 대상이다.

```properties
DB_URL=jdbc:mysql://localhost:3306/umc_movie
DB_USER=본인_DB_사용자
DB_PASSWORD=본인_DB_비밀번호
JWT_SECRET=직접_생성한_32바이트_이상_무작위_비밀키
JWT_ACCESS_EXPIRATION=3600
```

```powershell
cd BE/movie
$env:GRADLE_USER_HOME = "$env:USERPROFILE\.gradle"
.\gradlew.bat build
.\gradlew.bat bootRun
```

기존 IntelliJ 도서 프로젝트 실행 설정에 DB_URL/DB_USER/DB_PW가 있는 경우, `scripts/prepare-movie-db.ps1`이 그 접속 설정으로 별도 영화 DB와 Git 제외 설정 파일을 준비할 수 있다. 실제 접속 정보는 출력하지 않는다. 시스템 스크립트 실행 정책은 임의로 변경하지 않는다.

## 확인 경로와 기록

- `/`: TMDB 인기 영화, `/search`: 영화 검색, `/movies/155`: 영화 상세
- `/members`: 자체 BE의 닉네임·이메일 중복 확인 및 회원별 평점 조회
- `/signup`: 입력 검증·중복 확인·실제 회원가입 API 연결
- `/login`, `/mypage`, `/mypage/edit`: 7주차 필수 화면. 로그인 FE API 연결은 8주차 범위이며, 내 정보는 예시 데이터의 입력·변경을 확인한다.
- [API 명세와 ERD](docs/api-spec.md)
- [5주차 진행·검증 기록](docs/week05-progress.md)
- [6주차 진행·검증 기록](docs/week06-progress.md)
- [7주차 진행·검증 기록](docs/week07-progress.md)
- [7주차 Postman v3 컬렉션](<docs/postman/UMC 11기 7주차 필수 인증·인가/.resources/definition.yaml>): Postman Local Mode에서 `docs/postman/UMC 11기 7주차 필수 인증·인가`를 펼쳐 요청을 위에서 아래로 실행하고 캡처한다. 기존 JSON은 Postman의 Upgrade to v3로 17개 YAML 요청 파일로 변환됐다.
- `node scripts/verify-week07.mjs`: 현재 토큰 기반 API와 실제 MySQL을 검증한다. 검증용 회원 2명을 만들고 평점은 삭제한다. 토큰·비밀번호는 기록에서 가린다.
- `node scripts/verify-week05.mjs`: 실행 중인 로컬 BE와 실제 TMDB를 검증하고 `docs/evidence/week05/api-responses.json`에 결과 저장
- `node scripts/verify-week06.mjs`: 6주차 커밋의 이전 API 계약용 검증기. 7주차 서버에는 `verify-week07.mjs`를 사용한다.
- `node scripts/verify-query-cache.mjs`: 실제 QueryClient·TMDB를 이용한 1→2→1 캐시 재사용 확인
- `/api-check.html`: 개발 서버에서만 직접 여는 API 요청·응답 확인 도구. 프로덕션 빌드 엔트리에 포함하지 않는다.

Node/API 검증 기록은 브라우저 캡처와 구분한다. 브라우저에서 확인하지 않은 항목은 워크북에서도 미검증으로 기록한다.
