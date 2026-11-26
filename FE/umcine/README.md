# UMCine · Next.js App Router

9주차 마이그레이션은 `FE/umcine`에서 진행했습니다. 별도 본문 예제는 `FE/nextjs-example`에 있습니다.

```powershell
npm.cmd ci
npm.cmd run dev
```

기본 주소는 http://localhost:5173 입니다. `.env.example`을 참고해 `.env.local`에 기존 Vite의 값을 `NEXT_PUBLIC_TMDB_API_BASE_URL`, `NEXT_PUBLIC_TMDB_ACCESS_TOKEN`, `NEXT_PUBLIC_API_BASE_URL`로 옮깁니다. 영화 조회에는 TMDB 토큰이 필요하고, 회원 기능은 기존 Spring Boot API를 사용합니다.

프로덕션 검증은 `npm.cmd run lint`, `npm.cmd run build`, `npm.cmd run start`로 진행합니다. 환경변수를 변경한 후 프로덕션에서 확인할 때는 다시 빌드하세요.

Chromium 회귀 테스트는 5173 포트를 비운 상태에서 실행합니다. 설정에 있는 모의 TMDB 응답을 사용하려면 먼저 테스트용 자리표시자로 빌드합니다.

```powershell
npx.cmd playwright install chromium
$env:NEXT_PUBLIC_TMDB_ACCESS_TOKEN = 'e2e-placeholder-not-a-real-token'
npm.cmd run build
npm.cmd run test:e2e -- --workers=2
Remove-Item Env:NEXT_PUBLIC_TMDB_ACCESS_TOKEN
```

실제 API 테스트까지 수행하려면 즐겨찾기 API가 포함된 백엔드를 8080에서 실행한 뒤 테스트 셸에 `E2E_LIVE_API=1`을 설정합니다. 테스트는 회원을 생성하므로 테스트 DB에 연결한 서버를 사용하세요.

핵심 코드와 제출 기록은 [9주차 미션 기록](docs/week09-mission-record.md)에 있습니다. 아래는 이전 주차 구현 이력입니다.

## Week 08 인증·변경 요청과 캐시 갱신

회원가입 useMutation 전환, 실제 로그인/내 정보 수정, 인증 그룹 Layout Route,
서버 즐겨찾기 및 평점 API 연동을 구현했습니다. 토큰은 Zustand persist,
서버 데이터는 TanStack Query로 관리합니다.

**MySQL 실행 전에 BE/movie/database/week08_favorite.sql을 실행하세요.**
실행 방법·캡처·제출 안내는 [8주차 제출 안내](docs/week08-submission.md)를 참고하세요.


## Week 07 회원가입과 인증 화면

회원가입 검증·중복 확인·API 연동과 로그인·내 정보 조회/수정 화면을 구현했습니다.
로그인·내 정보는 7주차 퍼블리싱 범위이며 예시 프로필을 사용합니다.

실행 방법, 실제 캡처, 검증 결과 및 제출 순서는 [7주차 제출 안내](docs/week07-submission.md)를 참고하세요.

## Week 06 TanStack Query 미션

영화 목록·검색·상세 요청을 TanStack Query로 관리합니다. 공통 staleTime은 60초,
상세 staleTime은 30초, gcTime은 5분입니다. 개발 환경에서는 React Query Devtools를 사용할 수 있습니다.
`queryOptions`를 분리하는 선택 미션도 적용했습니다.

실행: `npm install` 후 `npm run dev`. 기존 `.env.local`의 TMDB 환경 변수가 필요합니다.
검증: `npm run build`, `npm run lint`.

노션에 옮길 미션 기록, 개념 정리, 화면 확인 방법과 제출 체크리스트는
[6주차 제출 준비](docs/week06-submission.md)를 참고하세요.

## Week 04 상태 관리 미션

### 북마크 상태 공유와 저장

- 목록, 검색, 상세 화면은 하나의 Zustand store를 공유합니다.
- Zustand `persist`가 북마크 영화 ID를 `localStorage`의 `umcine-bookmark-store` 키에 저장합니다.
- 개발자 도구에서 이 키를 삭제하고 새로고침하면 북마크가 초기 빈 상태로 돌아갑니다.

저장값 예시는 다음과 같습니다.

```json
{"state":{"bookmarkedMovieIds":[1,3]},"version":0}
```

### 카드 크기 설정

영화 목록에서 `기본`과 `작게`를 선택할 수 있습니다. 선택값은 `localStorage`의
`umcine-display-preferences` 키에 저장되므로 새로고침하거나 브라우저를 다시 열어도 유지됩니다.

### sessionStorage 비교 실험

저장 수명을 비교하려면 `bookmark-store.ts`의 저장소를 잠시 다음과 같이 바꿉니다.

```ts
storage: createJSONStorage(() => sessionStorage),
```

`sessionStorage`에서는 현재 탭을 새로고침해도 북마크가 유지되지만, 탭을 닫았다가 다시 열면
사라집니다. 실험 후에는 필수 미션 조건을 충족하도록 `localStorage`로 되돌립니다.

최종 구현은 새로고침과 브라우저 재실행 후에도 북마크가 유지되는 `localStorage`를 사용합니다.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
