import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 홈 폴더의 다른 lock 파일을 프로젝트 루트로 잘못 잡지 않게 이 폴더를 루트로 지정한다
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
