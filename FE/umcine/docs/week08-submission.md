# 8주차 구현·실행·제출 안내

첨부된 **프론트엔드 8주차 원문**을 기준으로 구현했습니다. 기존 JWT 백엔드에 없던 즐겨찾기 API도 추가해 실제 연동했습니다.

## 구현 범위

- 회원가입의 요청 진행·성공·실패 상태를 useMutation으로 전환. 입력/중복 검증과 연속 제출 방지는 유지
- 로그인 API 연결, Zustand persist 토큰 저장, 홈 이동, 내 정보 invalidateQueries 갱신
- 로그인 상태의 /login 접근은 홈으로 이동. 비로그인 상태의 /mypage, /mypage/edit 접근은 로그인으로 이동
- Route Group `(authenticated)` 안에 `_auth` Layout Route를 두고 Outlet으로 마이페이지·수정 화면 렌더링
- 내 정보 조회·수정을 실제 서버에 연결. PATCH 응답을 setQueryData로 반영
- 즐겨찾기 목록·여부 조회·등록·해제와 회원별 평점 조회·등록·수정·삭제 연결
- 401 시 토큰 해제, 로그아웃·계정 교체 시 개인 캐시 취소/제거, 다른 탭의 인증 삭제 반영
- 선택 미션: invalidateQueries와 setQueryData 비교, mutationOptions 분리

로그아웃 상태의 북마크 버튼은 로그인으로 이동합니다. 이전 주차의 브라우저 로컬 북마크는 서버에 자동 업로드하지 않습니다. 로그인 후에는 해당 회원의 서버 즐겨찾기가 원본입니다. 영화 목록·검색·상세의 기존 TanStack Query 조회는 유지했습니다.

## 직접 실행하려면

### 1. MySQL에 favorite 테이블 추가 — 이번에 필요한 DB 작업

Workbench에서 `BE/movie/database/week08_favorite.sql`을 열고 실행하세요. 기존 member/rating 데이터는 삭제하지 않습니다. favorite에는 회원 FK와 (member_id, movie_id) 복합 UNIQUE가 필요합니다. 별도 movie 테이블은 만들지 않습니다.

application.yaml은 ddl-auto: validate이므로 서버를 실행해도 테이블이 자동 생성되지 않습니다. IF NOT EXISTS는 기존 테이블의 다른 구조를 수정하지 않으므로 기존 favorite이 있다면 SHOW CREATE TABLE 결과를 확인하세요.

### 2. 백엔드 실행

IntelliJ MovieApplication의 환경 변수에 아래 값을 설정합니다.

```text
DB_PASSWORD=본인 MySQL 비밀번호
JWT_SECRET=본인이 생성한 충분히 긴 비밀키(UTF-8 32바이트 이상)
JWT_ACCESS_EXPIRATION=3600
```

만료 시간 단위는 초입니다. 비밀키는 이전 7주차에 사용하던 값을 유지할 수 있습니다. 환경 변수 값과 실제 토큰은 커밋하거나 제출 이미지에 노출하지 마세요. Started MovieApplication 및 8080 포트 시작 로그를 확인합니다.

### 3. 프론트엔드 실행

```powershell
cd C:\umc\PE_Web\FE\umcine
npm ci
npm run dev
```

FE 상위 폴더가 아니라 **FE/umcine**에서 실행해야 합니다. .env.local의 회원 서버 주소는 VITE_API_BASE_URL=http://localhost:8080입니다. 실제 영화 조회에는 기존 VITE_TMDB_API_BASE_URL 및 VITE_TMDB_ACCESS_TOKEN도 설정해야 합니다.

| 화면 | 주소 |
|---|---|
| 회원가입 | http://localhost:5173/signup |
| 로그인 | http://localhost:5173/login |
| 마이페이지 | http://localhost:5173/mypage |
| 내 정보 수정 | http://localhost:5173/mypage/edit |
| 영화 상세 예시 | http://localhost:5173/movies/550 |

## 무엇을 캡처·인증해야 하나요?

**원문은 정해진 캡처 장수를 지정하지 않았습니다.** 필수 미션의 핵심 코드와 최종 결과를 미션 기록에 넣으면 됩니다. 아래 자료를 준비했습니다.

`docs/week08-evidence`에는 데스크톱·모바일 이미지와 토큰을 제외한 통신 요약 JSON이 있습니다. `BE/movie/build/outputs/week08-submission-evidence.zip`에도 묶었습니다.

| 파일 이름의 번호 | 보여주는 내용 | 검증 구분 |
|---|---|---|
| 01-login-required | 로그아웃 상태에서 인증 화면 접근 시 로그인 화면 | 브라우저 가드 |
| 02-login-error-mocked | 잘못된 로그인 응답과 재시도 가능 상태 | 실패 응답 모의 처리 |
| 03-login-pending-mocked | 로그인 중 입력·버튼 비활성화 | 지연 응답 모의 처리 |
| 04-expired-session-mocked | 401 뒤 토큰 제거 및 로그인 안내 | 인증 만료 모의 처리 |
| 05-profile-updated-mocked | 수정 후 프로필 반영 | 모의 서버 |
| 06-favorites-mocked | 즐겨찾기 목록과 해제 버튼 | 모의 서버 |
| 07-rating-created-mocked | 평점 등록 후 수정/삭제 버튼 | 모의 서버 |
| 08-login-success-live-h2 | 실제 로그인 성공 후 홈·로그아웃 버튼 | 실제 Spring Boot/H2 |
| 09-profile-updated-live-h2 | 실제 닉네임 수정 성공 | 실제 Spring Boot/H2 |
| 10-rating-updated-live-h2 | 실제 평점 수정 결과 | 실제 Spring Boot/H2 |
| 11-mypage-live-h2 | 실제 프로필·즐겨찾기·내 평점 목록 | 실제 Spring Boot/H2 |

**Notion에는 08~11 실제 연동 화면을 우선 첨부하고**, 01~04로 접근 제한과 오류·진행 상태를 보여 주세요. 파일 이름의 mocked/live-h2를 구분해 설명하세요. 학습용 영화 데이터는 TMDB 응답을 고정한 fixture를 사용했습니다. 실제 TMDB API나 운영 MySQL을 검증한 캡처는 아닙니다.

선택 미션의 캐시 비교에는 다음 JSON을 같이 넣으면 됩니다.

- `*-cache-setQueryData-mocked.json`: 닉네임 PATCH 뒤 추가 내 정보 GET = 0
- `*-cache-invalidateQueries-mocked.json`: 활성 즐겨찾기 목록 변경 뒤 추가 GET = 1
- `*-live-network-sanitized.json`: 실제 서버 요청 method/path/status, 인증 헤더 존재 여부, 토큰 저장 여부, 변경 후 추가 GET 수, 삭제 후 서버 목록이 비었는지 확인한 결과

통신 요약에는 비밀번호나 토큰 원문을 기록하지 않습니다. 실제 Network 탭 캡처를 추가하려면 다음을 확인하세요.

1. 로그인 POST /auth/login 성공, 토큰 저장 후 인증 GET /members/me
2. 닉네임 PATCH /members/me 직후 추가 GET 없이 헤더·조회 화면 갱신
3. 즐겨찾기 POST/DELETE 뒤 목록 갱신. 비활성 목록은 다음 화면 진입 시 조회될 수 있음
4. POST /ratings, PATCH /ratings/{ratingId}, DELETE /ratings/{ratingId} 및 이후 목록 반영

Network·Application 탭을 공유할 때 Authorization, accessToken, password 값은 가리세요.

## Notion·GitHub·UMC 제출

1. `week08-mission-record.md`의 필수 미션 기록과 핵심 코드 목록을 옮깁니다.
2. 위 실제 결과·접근 제한 캡처를 첨부하고 검증 환경을 정확히 적습니다.
3. 선택 미션 토글에 캐시 비교 JSON과 mutationOptions 코드 링크를 넣습니다.
4. `week08-learning.md`의 개념 정리와 학습 후기를 본인의 이해에 맞게 수정합니다.
5. 스터디 리더가 남기는 **실제 스터디 인증샷**을 확인해 첨부합니다.
6. week08 변경을 커밋·푸시하고 PR base를 **체컵/고원준**으로 선택합니다. 변경은 FE/umcine 및 BE/movie에 있습니다.
7. 핵심 코드의 GitHub URL을 Notion에 채운 뒤 공유 링크를 https://umc.ai.kr/ 에 제출합니다.

GitHub 업로드·PR 생성, Notion 편집, UMC 제출은 아직 실행하지 않았습니다. 스터디 인증샷은 실제 활동 사진을 직접 추가해야 합니다.

## 검증을 다시 실행하기

모의 응답 테스트는 아래 명령만으로 실행합니다. 실제 API 테스트는 기본적으로 건너뜁니다.

```powershell
cd C:\umc\PE_Web\FE\umcine
npx playwright install chromium
npm run build
npm run lint
npm run test:e2e -- --workers=2
```

실제 API 테스트까지 수행하려면 8080 포트의 기존 앱을 직접 확인한 후, 별도 터미널에서 임시 H2 서버를 시작합니다.

```powershell
cd C:\umc\PE_Web\BE\movie
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/start-e2e-backend.ps1
```

프론트엔드 터미널에서는:

```powershell
$env:E2E_LIVE_API = '1'
npm run test:e2e -- --workers=2
Remove-Item Env:E2E_LIVE_API
```

global-setup이 백엔드 준비를 기다립니다. 실제 회원 기능은 H2에 저장되며 종료하면 테스트 데이터가 사라집니다. 테스트 종료 뒤 임시 백엔드는 Ctrl+C로 종료합니다. 테스트가 남긴 trace에는 학습용 계정의 입력이 포함될 수 있으므로 제출 ZIP에는 trace를 넣지 않았습니다.
