# 7주차 미션 기록 초안

캡처를 Notion에 올리고 실제 GitHub 링크를 채운 뒤 제출하세요. 후기는 본인의 경험과 이해에 맞게 수정하세요.

## 필수 미션

### 구현 내용

- `/login`: 이메일과 비밀번호를 입력하는 로그인 화면. 입력 상태를 useState로 관리하고 형식이 맞으면 버튼을 활성화했다. 이번 주차에는 로그인 API를 연결하지 않아 실제 인증 요청은 하지 않는다.
- `/mypage`: 예시 회원의 이메일과 닉네임을 보여주는 내 정보 화면.
- `/mypage/edit`: 닉네임을 입력·검증하는 수정 화면. 저장하면 메모리의 예시 프로필을 갱신하고 조회 화면에 반영한다. 취소하면 변경하지 않는다. 새로고침하면 예시 값으로 초기화된다.
- `/signup`: 입력 검증, 이메일·닉네임 중복 확인, 실제 회원가입 API를 연결했다. 요청 상태는 useState/useRef로 직접 관리했다.

### 핵심 코드 링크 — GitHub 업로드 후 URL 추가

- `src/pages/auth/login-page.tsx`: [로그인 화면 코드 링크]
- `src/pages/mypage/profile-page.tsx`: [조회 화면 코드 링크]
- `src/pages/mypage/edit-profile-page.tsx`: [수정 화면 코드 링크]
- `src/pages/mypage/model/profile-preview-store.ts`: [예시 프로필 상태 코드 링크]
- `src/pages/auth/signup-page.tsx`: [회원가입 폼 코드 링크]
- `src/pages/auth/signup-validation.ts`: [검증 규칙 코드 링크]
- `src/api/api-client.ts`, `src/api/members/*`: [API 코드 링크]
- `tests/e2e/week07.spec.ts`: [브라우저 검증 코드 링크]

### 최종 확인 결과

- 로그인/조회/수정 화면에 직접 접속할 수 있다.
- 입력한 이메일·비밀번호·닉네임이 화면에 반영된다.
- 유효하지 않은 닉네임은 저장할 수 없다.
- 저장한 예시 닉네임은 조회 화면에 반영되며 취소는 기존 값을 유지한다.
- 이메일 또는 닉네임을 수정하면 해당 중복 확인 결과가 초기화된다.
- 중복 확인 중에는 해당 입력/버튼이, 가입 중에는 폼 입력/가입 버튼이 비활성화된다.
- 연속 제출 이벤트가 발생해도 회원가입 POST는 한 번만 전송된다.
- 회원가입 Payload에서 passwordConfirm을 제외하고, 성공 응답에는 password가 없다.
- 실제 Spring Boot/H2에서 회원가입 201과 가입 후 중복 확인을 검증했다. MySQL을 직접 검증한 결과는 아니다.

캡처 파일과 검증 범위는 `week07-submission.md`를 참고한다.

## 선택 미션

```text
src/pages/
  auth/
    login-page.tsx
    signup-page.tsx
    signup-validation.ts
  mypage/
    profile-page.tsx
    edit-profile-page.tsx
    model/
      profile-preview-store.ts
```

공개 회원가입/로그인은 auth에, 향후 인증이 필요한 내 정보 화면은 mypage에 묶었다. 예시 프로필 모델도 같은 기능 폴더 안에 두었다. 이번 주차에는 인증 layout이나 로그인 접근 제한을 추가하지 않았다. `routes/mypage_.edit.tsx`의 접미사 `_`는 수정 화면이 조회 화면 안에 중첩되지 않게 한다. [TanStack Router 공식 설명](https://tanstack.com/router/latest/docs/routing/routing-concepts#non-nested-routes)

## 학습 후기 초안

회원가입에서 입력 형식이 올바른 상태와 서버가 실제로 저장 가능한 상태가 다르다는 점을 확인했다. 이메일 형식을 통과해도 중복 확인이 필요하고, 확인 후에도 다른 요청이 먼저 가입할 수 있어 서버의 409 응답을 처리해야 한다. 확인한 값을 바꾸면 이전 결과를 무효화해야 한다. 요청 중 버튼 잠금뿐 아니라 제출 함수에서도 중복 실행을 막아야 한다. 화면용 예시 데이터와 실제 회원 정보를 구분하고, 아직 구현하지 않은 로그인을 성공한 것처럼 표시하지 않도록 했다.

## 실제 트러블슈팅: 한글 문서 인코딩

**이슈**

문서 생성 후 README를 다시 읽자 새로 추가한 한글이 `## Week 07 ????? ?? ??`처럼 표시됐다.

**원인**

Windows PowerShell에서 한글 문자열을 포함한 스크립트를 외부 Node 프로세스의 표준 입력으로 전달할 때 기본 출력 인코딩 때문에 문자가 손실됐다. 기존 UTF-8 문서와 파일 복사로 반영한 소스 코드는 정상이었다.

**해결**

PowerShell 문자열에서 UTF-8 파일로 직접 쓰는 방식으로 수정하고 Get-Content -Encoding utf8로 README와 제출 문서의 한글을 다시 확인했다.

**배운 점**

한글 파일은 쓰는 쪽과 읽는 쪽뿐 아니라 외부 프로세스 사이의 파이프 인코딩도 확인해야 한다. 문서 생성이 성공했다는 종료 코드만으로는 내용을 검증한 것이 아니다.
