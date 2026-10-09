// 이 파일은 Vite 개발 서버와 배포용 빌드의 플러그인을 설정한다.
// React 문법, 파일 기반 라우팅, Tailwind CSS를 앱에서 쓰기 위해 연결한다.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    // routes 폴더를 읽어 routeTree.gen.ts를 생성하고 화면별 코드를 나눈다.
    tanstackRouter({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
});
