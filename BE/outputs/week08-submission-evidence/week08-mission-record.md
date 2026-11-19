# 8주차 미션 기록 초안

GitHub 코드 링크와 캡처를 실제 Notion 페이지에 추가한 뒤 제출하세요.

## 필수 미션

- 기존 회원가입의 isSubmitting/error/success 상태를 useMutation으로 대체했다. 필드 입력값과 중복 확인 상태는 클라이언트 상태로 남겼다.
- 로그인 응답 토큰만 Zustand persist에 저장하고 내 정보는 Query 캐시에서 관리했다. 성공하면 내 정보 invalidateQueries 후 홈으로 이동한다.
- 인증 그룹 폴더와 Layout Route를 만들고 Outlet으로 하위 페이지를 표시했다. beforeLoad에서 토큰이 없으면 로그인으로 이동하고, 화면에서 발생한 401도 토큰 제거와 이동에 반영했다.
- 내 정보 PATCH 응답을 setQueryData로 저장해 헤더와 조회 화면이 즉시 바뀌게 했다.
- 마이페이지 즐겨찾기 목록과 내 평점, 영화 상세의 즐겨찾기/평점 생성·수정·삭제를 서버 API에 연결했다.
- 기존 백엔드에 없는 즐겨찾기를 추가하고, DB의 회원 FK 및 복합 UNIQUE와 함께 검증했다.
- 로그아웃/계정 교체 시 개인 Query를 취소하고 제거해 이전 회원 데이터가 남지 않게 했다.

### 폴더 구조

```text
src/routes/
  (authenticated)/
    _auth.tsx                     # 토큰 검사 + 공통 Layout Route
    _auth.mypage.tsx              # /mypage
    _auth.mypage_.edit.tsx         # /mypage/edit, 같은 auth 부모 아래 렌더링
```

괄호 그룹과 `_auth`는 URL에 포함되지 않는다. 수정 화면 이름의 trailing underscore는 조회 화면 내부 중첩을 피하면서 공통 인증 부모는 유지한다. [TanStack Router 파일 규칙](https://tanstack.com/router/latest/docs/routing/file-naming-conventions)

### 핵심 코드 링크 — 업로드 후 채우기

- `src/hooks/use-signup-mutation.ts`, `use-login-mutation.ts`, `use-update-me-mutation.ts`
- `src/api/mutation-options.ts`, `private-query-options.ts`, `auth-api.ts`
- `src/stores/auth-store.ts`, `src/query-client.ts`
- `src/routes/(authenticated)/_auth.tsx`, `src/components/auth/authenticated-layout.tsx`
- `src/pages/mypage/profile-page.tsx`, `edit-profile-page.tsx`
- `src/components/bookmark-button.tsx`, `src/components/ratings/rating-panel.tsx`
- `tests/e2e/week08.spec.ts`
- `BE/movie/src/main/java/com/umc/movie/controller/FavoriteController.java`
- `BE/movie/database/week08_favorite.sql`

### 최종 결과

실제 Spring Boot/H2로 로그인, 닉네임 수정, 즐겨찾기, 평점 등록/수정/삭제와 재조회 결과를 검증했다. 외부 영화 API는 고정된 TMDB fixture를 사용했다. 캡처와 검증 범위는 week08-submission.md 및 week08-verification.md를 함께 첨부한다.

## 선택 미션

내 정보 수정은 성공 응답으로 setQueryData를 사용했고 추가 내 정보 GET은 0회였다. 즐겨찾기 목록은 invalidateQueries를 사용했고 화면에서 사용 중인 목록은 변경 후 GET이 1회 추가됐다. 비활성 목록은 무효화 후 다음 진입 시 조회될 수 있다. 비교 JSON을 캡처 자료와 함께 첨부한다.

회원가입·로그인·프로필·즐겨찾기·평점의 mutationFn/key/retry 설정을 mutationOptions로 분리했다. 훅은 캐시 갱신과 이동 같은 화면별 후처리를 조합한다.

서버 응답 전 상태를 먼저 변경하는 낙관적 업데이트는 필수/선택 미션과 구분되는 선택 심화 학습이므로 이번에는 적용하지 않았다. 저장이 실패하면 기존 서버 상태를 유지하고 오류를 안내한다.

## 실제 트러블슈팅

**이슈**: 처음 타입 검사에서 `error TS2769: No overload matches this call`이 발생했다. mutationFn이 `Promise<ApiResponse<null>> | Promise<ApiResponse<Favorite>>`를 반환해 mutationOptions가 한 가지 반환형으로 추론하지 못했다. 평점도 같은 문제가 있었다.

**원인**: 등록/수정 응답에는 DTO가 있고 삭제 응답의 result는 null인데, 분기된 Promise 타입을 그대로 반환했다.

**해결**: 비동기 함수의 반환형을 `Promise<ApiResponse<Favorite | null>>`과 `Promise<ApiResponse<RatingResponse | null>>`로 명시했다. 타입 단언으로 오류를 숨기지 않고 실제 성공 응답의 합집합을 표현했다.

**배운 점**: API의 null 결과까지 정확히 모델링해야 mutationOptions에서도 안전하게 타입을 공유할 수 있다. 수정 후 빌드와 린트를 다시 확인했다.

추가로 초기 E2E 실행에서 백엔드 기동 전 요청이 나가 실패했다. global-setup에서 준비 API를 확인한 후 테스트를 시작하도록 수정했다. 기존 홈은 페이지네이션 때문에 `/?page=1`로 정규화되어 pathname으로 홈 이동을 검증했다. 개발 StrictMode의 초기 취소·재실행이 캐시 비교를 왜곡하지 않도록 변경 전후의 GET 차이를 측정했다.
