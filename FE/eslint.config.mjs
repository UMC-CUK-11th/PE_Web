import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "previous/**",
    ".pnpm-store*/**",
    // TODO(9주차 직접 해보기): signup 마이그레이션 전까지 잠깐 제외. 옮긴 뒤 이 줄과 tsconfig.json exclude의 signup 줄을 지우기
    "src/screens/signup-page.tsx",
  ]),
]);

export default eslintConfig;
