# UMC 11기 4주차 미션 — 블루/고경민

- FE/: 프론트엔드 미션 (React, TypeScript, TanStack Router, Zustand)
- BE/: 백엔드 ORM/JPA 미션 (Spring Boot, JPA, MySQL)
- FE/previous/week1-typescript/: 기존 1주차 과제 보존

## 프론트엔드

FE 폴더에서 `pnpm install --frozen-lockfile`, `pnpm build`, `pnpm dev`를 실행합니다.

## 백엔드

Java 21을 사용합니다. BE 폴더에서 Windows 기준 `gradlew.bat build -x test`로 컴파일과 패키징을 확인할 수 있습니다.
실행과 DB 연동 테스트에는 `DB_URL`, `DB_USER`, `DB_PW` 환경변수가 필요합니다. 실제 자격증명은 저장소에 포함하지 않습니다.
