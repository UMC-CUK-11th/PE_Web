# React + TypeScript + Vite

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
