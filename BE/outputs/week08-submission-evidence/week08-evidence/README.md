# 8주차 캡처·통신 기록

실제 Chromium에서 2026-11-18에 저장한 데스크톱/모바일 캡처 22장과 통신 요약 JSON 6개입니다.

Notion에 우선 넣을 실제 연동 화면:

- desktop-08-login-success-live-h2.png: 로그인 후 홈
- desktop-09-profile-updated-live-h2.png: 닉네임 수정 성공
- desktop-10-rating-updated-live-h2.png: 평점 수정과 삭제 버튼
- desktop-11-mypage-live-h2.png: 서버 프로필·즐겨찾기·평점 목록

01~04는 접근 제한, 로그인 실패/진행 상태, 인증 만료를 보여줍니다. 같은 번호의 mobile 파일은 모바일 뷰포트입니다. 05~07은 캐시/목록/평점의 모의 응답 검증입니다.

cache-setQueryData-mocked.json은 수정 후 추가 내 정보 GET=0, cache-invalidateQueries-mocked.json은 활성 즐겨찾기 목록 변경 뒤 GET=1을 기록합니다. live-network-sanitized.json은 실제 API의 method/path/status, 인증 헤더 유무와 서버 삭제 결과를 기록하며 비밀번호나 토큰 원문을 포함하지 않습니다.

live-h2는 실제 Spring Boot + 임시 H2 DB를 의미합니다. 운영 MySQL이나 외부 TMDB 실통신 결과가 아닙니다. mocked는 테스트용 모의 응답입니다. 인증 토큰을 노출하는 Application 탭 캡처와 실패 trace는 포함하지 않았습니다.

워크북은 정해진 캡처 장수를 요구하지 않습니다. 핵심 코드와 최종 결과를 기록하고 실제 스터디 인증샷은 별도로 첨부하세요.
