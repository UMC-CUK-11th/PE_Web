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

## 5주차 TMDB API
- FE/.env.local에 VITE_TMDB_API_READ_ACCESS_TOKEN을 설정합니다. TMDB 설정 → API의 Read Access Token을 사용하며 실제 토큰은 커밋하지 않습니다.
- pnpm install → pnpm dev, 검증: pnpm lint / pnpm build
- 최종 화면은 ky 2.x 공통 클라이언트로 인기 영화(페이지 이동), 검색, 상세 API를 호출합니다.
- 순수 fetch 실습: 개발 서버가 실행된 앱의 개발자 도구 Console에서 아래 코드를 실행하고 Network의 popular 요청 상태와 응답을 확인합니다. Authorization 헤더는 캡처하지 않습니다.

```js
const { getMoviesWithFetch } = await import('/src/api/movies/get-movies-with-fetch.ts');
const result = await getMoviesWithFetch();
console.log({ page: result.page, count: result.results.length });
```

- 요청 언어: ko-KR. 빈 검색어는 요청하지 않으며 검색어/영화 ID 변경 및 화면 이탈 시 이전 요청을 취소합니다.
- 로컬 영화 ID와 TMDB ID의 충돌을 막기 위해 북마크 저장 키를 umcine-tmdb-bookmark-store로 분리했습니다. 예전 저장 데이터는 삭제하지 않습니다.
- 출처: https://developer.themoviedb.org/docs/image-basics / https://developer.themoviedb.org/docs/faq
- ky 2.x 문법: https://github.com/sindresorhus/ky
