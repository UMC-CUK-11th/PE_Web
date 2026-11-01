# 5주차 API 연동 화면

1. MySQL Workbench에서 `database/week05.sql`을 실행합니다.
2. Spring Boot 서버를 `8080` 포트로 실행합니다.
3. `mock-frontend` 폴더에서 아래 명령을 실행합니다.

```bash
npx serve -l 5173
```

4. 브라우저에서 `http://localhost:5173`을 열고 세 API를 호출합니다.

백엔드 CORS 설정은 `http://localhost:5173`만 허용합니다.

## CORS 설정 전·후 확인

- 설정 전: IntelliJ 실행 환경변수에 `CORS_ENABLED=false`를 추가하고 서버를 재시작합니다.
  브라우저 개발자 도구 Console에서 CORS 오류를 캡처합니다.
- 설정 후: `CORS_ENABLED=true`로 바꾸고 서버를 재시작합니다.
  세 API의 정상 응답이 화면에 보이도록 캡처합니다.
