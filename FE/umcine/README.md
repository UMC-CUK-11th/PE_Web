# UMCine — Week 05

기존 React + TypeScript + Vite 화면에 TMDB 목록/검색/상세 API를 연결했습니다. 패키지 관리는 pnpm을 사용합니다.

```powershell
pnpm install --frozen-lockfile
```

`.env.example`을 참고해 로컬 `.env.local`의 `VITE_TMDB_ACCESS_TOKEN`을 입력하세요. 실제 환경 파일은 Git에서 제외됩니다. TMDB 토큰이 비어 있으면 영화 요청 화면에 설정 오류를 표시합니다. 환경 파일 변경 후 개발 서버를 재시작하세요.

```powershell
pnpm dev
pnpm lint
pnpm build
```

`http://localhost:5173`에서 영화 목록, `/search?query=스파이더맨`에서 검색, `/movies/550`에서 상세를 확인합니다. `/api-test`는 별도 Nest 영화 서버의 세 API를 직접 호출하는 확인 화면입니다. 백엔드 실행/DB 준비 방법은 [영화 서버 README](../../BE/movie/README.md)를 참고하세요. 이 링크는 저장소 루트 기준 `BE/movie/README.md`입니다.

전체 변경 파일, 검증 결과와 남은 실제 API/DB 검증 항목은 [5주차 구현 보고](../../WEEK05.md)에 있습니다.

---

# React + TypeScript + Vite

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
