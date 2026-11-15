# 7주차 핵심 키워드 정리

## 인증과 인가

인증은 요청자가 누구인지 확인하는 절차다. 로그인에서 비밀번호를 확인하고 이후 요청에서도 JWT의 서명·만료를 검증한다. 인가는 그 사람이 특정 행동을 할 수 있는지 확인하는 절차다. 이 프로젝트에서는 DB에서 읽은 평점 작성자와 토큰의 회원 ID를 비교한다. 인증을 통과해도 다른 사람의 평점은 수정·삭제할 수 없다.

따라서 '인증은 로그인 때 한 번만'이라는 설명은 단순화다. 이 서버에서는 보호 API를 호출할 때마다 인증도 다시 수행한다.

## 해시·salt·bcrypt

해시는 입력을 일방향으로 변환한다. bcrypt는 비용 계수를 조절해 비밀번호 추측의 계산 비용을 높인다. 무작위 salt를 사용하므로 같은 비밀번호를 가입시켜도 저장되는 문자열은 다르다. 비교할 때 새 salt로 다시 encode한 문자열끼리 비교하지 않는다. PasswordEncoder.matches(raw, storedHash)가 저장된 salt와 비용을 이용해 검증한다.

참고: [Spring Security Password Storage](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html)

## JWT·Claim·서명

이번 JWT는 header.payload.signature 세 부분의 JWS다. header에는 알고리즘, payload에는 sub(회원 ID), email, iat(발급 시각), exp(만료 시각)를 담았다. Claim은 토큰에 담는 정보 항목이다. header와 payload는 Base64URL 인코딩이어서 서명용 비밀키 없이 읽을 수 있다. 서명은 내용 변경을 검출하며 비밀번호를 숨기는 암호화 기능은 아니다.

이번 구현은 HMAC 비밀키를 이용한다. HS256/384/512 키의 최소 길이는 각각 32/48/64 **바이트**이며 JJWT signWith(key)는 키 길이를 보고 적절한 알고리즘을 선택한다. 문자 수와 UTF-8 바이트 수는 다를 수 있다. 워크북의 예시 문자열 umc-11th-movie-rating-secret-key-please-change-me는 ASCII 49바이트이므로 그 값 그대로라면 HS384이다. 테스트 전용 키로 실제 발급한 결과도 HS384였다.

토큰은 상태를 적게 유지할 수 있지만 유출된 토큰을 만료 전에 즉시 취소하려면 별도 정책·저장소가 필요하다. 이번 실습은 Access Token만 구현했으며 Refresh Token과 로그아웃 폐기는 범위 밖이다.

참고: [JWT RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519), [JJWT 공식 문서](https://github.com/jwtk/jjwt)

## Authorization과 Bearer

Authorization: Bearer {accessToken} 형식으로 모든 보호 요청에 토큰을 보낸다. 이 서버는 Bearer 뒤의 한 칸과 토큰을 분리한 뒤 검증한다. 토큰을 들고 있는 사람이 사용할 수 있으므로 실제 비밀번호·비밀키와 함께 관리에 주의해야 한다. 등록·수정 요청의 memberId는 클라이언트가 보내는 값으로 신뢰하지 않는다.

## HandlerInterceptor와 ArgumentResolver

인터셉터 preHandle은 컨트롤러 실행 전 공통 검증을 수행한다. 검증된 memberId를 request attribute에 저장한다. 커스텀 @LoginMember와 HandlerMethodArgumentResolver가 이를 컨트롤러 인자로 전달한다. 소유권 비교는 DB가 필요한 업무 규칙이어서 RatingService에 둔다.

Spring MVC는 먼저 핸들러를 선택한다. 이미 제거된 POST /members/{id}/ratings는 허용 메서드 불일치로 인터셉터 전에 405가 날 수 있다. 이는 인증을 우회해 쓰기가 실행된다는 뜻이 아니다.

참고: [Spring MVC 인터셉터](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-config/interceptors.html). 본 실습은 워크북의 인터셉터 방식을 따른다. 공식 문서는 실제 보안 계층으로 Spring Security 또는 Servlet filter chain 접근을 권장한다.

## 401·403·404

- 401: 로그인 실패·토큰 없음·서명 불일치·만료. AUTH401_1~4로 이유를 구분한다.
- 403: 토큰으로 요청자를 확인했지만 평점 소유자가 다르다. RATING403_1.
- 404: 회원이나 평점 자체를 찾지 못했다. MEMBER404_1 / RATING404_1.
- 409: 이미 같은 영화에 평가했거나 닉네임이 충돌한다.

내가 이해한 핵심은 '요청자의 신원'과 '대상 데이터에 대한 권한'이 별도 검사라는 것이다. API 경로를 줄인 이유도 단순한 가독성이 아니라 클라이언트가 회원 ID를 지정해 다른 사람으로 행동하는 구조를 없애기 위해서다.
