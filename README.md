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
```

```powershell
cd BE/movie
.\gradlew.bat build
.\gradlew.bat bootRun
```

기존 IntelliJ 도서 프로젝트 실행 설정에 DB_URL/DB_USER/DB_PW가 있는 경우, `scripts/prepare-movie-db.ps1`이 그 접속 설정으로 별도 영화 DB와 Git 제외 설정 파일을 준비할 수 있다. 실제 접속 정보는 출력하지 않는다. 시스템 스크립트 실행 정책은 임의로 변경하지 않는다.

## 확인 경로와 기록

- `/`: TMDB 인기 영화, `/search`: 영화 검색, `/movies/155`: 영화 상세
- `/members`: 자체 BE의 닉네임·이메일 중복 확인 및 회원별 평점 조회
- [API 명세와 ERD](docs/api-spec.md)
- [5주차 진행·검증 기록](docs/week05-progress.md)
- `node scripts/verify-week05.mjs`: 실행 중인 로컬 BE와 실제 TMDB를 검증하고 `docs/evidence/week05/api-responses.json`에 결과 저장

Node/API 검증 기록은 브라우저 캡처와 구분한다. 브라우저에서 확인하지 않은 항목은 워크북에서도 미검증으로 기록한다.
