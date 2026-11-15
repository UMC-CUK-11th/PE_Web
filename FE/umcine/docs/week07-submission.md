# 7주차 프론트엔드 제출 안내

이번 첨부 원문은 **프론트엔드 7주차**입니다. 아래 구현은 이 원문을 기준으로 합니다. 별도의 백엔드 7주차 JWT 과제는 전달되지 않았으므로 범위에 포함하지 않았습니다.

## 구현한 내용

| 구분 | 구현 | 확인 주소 |
|---|---|---|
| 본문 실습 | 회원가입 폼 및 이메일/닉네임/비밀번호/비밀번호 확인 검증 | http://localhost:5173/signup |
| 본문 실습 | 이메일·닉네임 중복 확인 GET API 연동 | /signup의 중복 확인 버튼 |
| 본문 실습 | 두 확인을 모두 통과한 뒤 POST /members 제출 | /signup의 가입하기 버튼 |
| 본문 실습 | 중복 확인/가입 진행 상태, 버튼·입력 잠금, 실패 메시지와 재시도 | /signup |
| 필수 미션 | 로그인 화면, 입력값 반영 | http://localhost:5173/login |
| 필수 미션 | 내 정보 조회 화면 | http://localhost:5173/mypage |
| 필수 미션 | 내 정보 수정 화면, 입력·저장·취소 결과 확인 | http://localhost:5173/mypage/edit |
| 선택 미션 | 내 정보 화면·모델을 pages/mypage 아래에 묶는 폴더 설계 | docs/week07-mission-record.md |

요청 상태는 useState/useRef로 직접 관리합니다. 회원가입에 useMutation이나 RHF를 사용하지 않았습니다. 성공/실패 안내는 브라우저 alert 대신 화면에 계속 보이는 status/alert 영역으로 표시합니다.

로그인은 화면 퍼블리싱만 구현했습니다. 내 정보는 **예시 회원 데이터**로 동작하며 변경은 브라우저 메모리에서만 유지됩니다. 실제 로그인/회원 조회·수정 API, JWT 발급/저장, 인증 레이아웃, 접근 제한은 이 원문의 8주차 또는 제외 범위입니다. 새로고침하면 예시 프로필이 초기화됩니다.

원문에 언급된 디자인 이미지가 첨부 텍스트에는 포함되지 않았습니다. 기존 UMCine의 파란색·흰색 테마와 공통 헤더/푸터를 사용했으며, 특정 시안과 픽셀 단위로 일치함을 검증한 결과는 아닙니다.

## 실행하기

프론트엔드 PowerShell:

```powershell
cd C:\umc\PE_Web\FE\umcine
npm ci
npm run dev
```

회원가입의 실제 저장에는 기존 6주차 movie 백엔드가 필요합니다. MovieApplication에 DB_PASSWORD를 설정하고 실행하세요. **이번 프론트엔드 과제 때문에 추가할 DB 테이블이나 컬럼은 없습니다.** 기존 member 테이블과 중복 제약을 그대로 사용합니다.

회원 서버 기본 주소는 http://localhost:8080입니다. 바꾸려면 `.env.local`에 `VITE_API_BASE_URL=http://localhost:8080`을 넣고 Vite를 재시작하세요. 이전 `VITE_BACKEND_API_BASE_URL`도 호환되지만 새 변수가 우선합니다. `.env.example`에 필요한 항목이 있습니다. DB 비밀번호는 프론트엔드 VITE 변수에 넣지 않습니다.

TMDB 토큰은 영화 화면에서만 필요합니다. 토큰이 없어도 회원가입/로그인/내 정보 화면은 열립니다.

## 무엇을 캡처해야 하나요?

**이번 원문은 필수 캡처 장수를 지정하지 않았고, 필수 미션의 핵심 코드와 최종 확인 결과를 기록하라고 안내합니다.** 이전 백엔드 6주차의 캡처 3장 규칙과는 다릅니다.

제출 기록에 아래 순서로 넣으면 구현과 동작을 모두 설명할 수 있습니다. 실제 Chromium에서 저장한 화면을 `docs/week07-evidence`에 준비했습니다.

| 우선순위 | 캡처 | 준비된 파일 |
|---|---|---|
| 필수 미션 증빙 | 로그인 화면: 이메일 입력, 비밀번호 마스킹, 로그인 버튼 | 01-login-desktop.png |
| 필수 미션 증빙 | 내 정보 조회 화면 | 02-profile-desktop.png |
| 필수 미션 증빙 | 내 정보 수정 화면: 닉네임을 바꾼 상태 | 03-profile-edit-desktop.png |
| 필수 미션 결과 | 저장 후 조회 화면에 바뀐 닉네임 반영 | 04-profile-updated-desktop.png |
| 본문 실습 증빙 | 잘못된 입력과 오류 안내, 가입 버튼 비활성화 | 05-signup-validation-desktop.png |
| 본문 실습 증빙 | 두 중복 확인 통과 및 가입 버튼 활성화 | 06-signup-available-live-h2.png |
| 본문 실습 결과 | 회원가입 성공 메시지 | 07-signup-success-live-h2.png |
| 본문 실습 실패 | 가입한 이메일·닉네임을 다시 확인하면 중복 안내 | 08-signup-duplicates-live-h2.png |
| 추가 검증 | 가입 중 버튼 비활성화 | 09-signup-pending-mocked.png |

모바일 로그인·내 정보 수정 화면도 같은 폴더에 추가했습니다. 실제 회원가입 캡처의 테스트 계정은 example.com 주소를 사용합니다.

**검증 환경을 정확히 적으세요.** `live-h2` 파일은 실제 Spring Boot에 HTTP 요청해 임시 H2 DB에 가입한 결과입니다. 로컬 운영 MySQL에 저장됐다는 증거는 아닙니다. `mocked`는 지연 응답을 모의 처리한 화면입니다. MySQL 실습 기록이 필요하면 본인 MovieApplication을 MySQL로 실행하고 직접 다시 캡처하세요.

Network 증빙을 추가하려면 개발자 도구 → Network → Fetch/XHR를 열고 회원가입을 진행한 뒤 다음을 확인하면 됩니다.

- GET /members/email/{email}, GET /members/nickname/{nickname}: available=true
- POST /members: 201, Request Payload에는 email/nickname/password만 존재
- passwordConfirm은 전송되지 않으며 응답에 password가 없음

Network 캡처를 공유할 때 Password 값은 가리세요. 브라우저 DOM에는 비밀번호가 마스킹되지만 Network Payload에는 입력한 비밀번호가 표시됩니다.

## Notion과 UMC 제출 순서

1. 필수 미션 토글에 로그인·내 정보 조회·수정 화면과 결과, 핵심 코드 링크를 넣습니다.
2. 회원가입 구현/검증 결과를 함께 기록합니다. 위 표의 캡처를 첨부하고 검증 DB를 H2 또는 MySQL로 정확히 표시합니다.
3. 선택 미션 토글에 pages/mypage 폴더 설계를 기록합니다.
4. `week07-mission-record.md`와 `week07-learning.md`의 초안을 옮기고 본인이 이해한 내용에 맞게 수정합니다.
5. 스터디 리더의 주차 인증샷을 확인해 첨부합니다.
6. 변경 코드를 week07에 커밋·푸시하고, PR의 base가 체컵/고원준인지 확인합니다.
7. GitHub의 핵심 코드 링크를 실제 URL로 채웁니다.
8. Notion 공유 링크를 복사해 워크북에서 지정한 https://umc.ai.kr/ 에 제출합니다.

GitHub 푸시, PR 생성, Notion 편집, UMC 제출은 아직 실행하지 않았습니다.

## 검증 재실행

```powershell
cd C:\umc\PE_Web\FE\umcine
npm run build
npm run lint
npx playwright install chromium
npm run test:e2e -- --workers=2
```

기본 E2E 명령은 서버 응답을 모의 처리하는 20개 검증을 수행하고 실제 API 테스트 2개는 건너뜁니다.

실제 Spring Boot/H2 연동도 검증하려면 별도 PowerShell에서 아래 서버를 먼저 실행하세요. 8080 포트에 기존 앱이 있으면 직접 확인해 종료한 후 실행해야 합니다. 임시 메모리 DB는 서버 종료 시 사라집니다.

```powershell
cd C:\umc\PE_Web\BE\movie
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/start-e2e-backend.ps1
```

프론트엔드 PowerShell에서:

```powershell
$env:E2E_LIVE_API = '1'
npm run test:e2e -- --workers=2
Remove-Item Env:E2E_LIVE_API
```

테스트 서버는 localhost:8080으로 고정하며 프론트는 localhost:5173에서 실행합니다. 기본 HTML 보고서는 `playwright-report/index.html`입니다. 테스트 종료 후 임시 백엔드는 Ctrl+C로 종료하세요. 캡처와 테스트 결과 파일은 제출 문서 외에는 Git에서 제외합니다.
