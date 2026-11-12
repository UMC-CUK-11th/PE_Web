package com.umc.movie.util;

import com.umc.movie.exception.ApiException; // 프로젝트에서 만든 예외: HTTP 상태·응답 코드·메시지 전달
import io.jsonwebtoken.Claims; // jjwt: payload의 정보 항목(클레임)을 다루는 타입
import io.jsonwebtoken.ExpiredJwtException; // jjwt: 토큰 만료 시 발생하는 예외
import io.jsonwebtoken.Jws; // jjwt: 서명된 JWT를 읽은 결과 타입
import io.jsonwebtoken.JwtException; // jjwt: 토큰 처리 오류의 공통 부모 예외
import io.jsonwebtoken.Jwts; // jjwt: JWT 생성 빌더·검증 파서의 시작점
import io.jsonwebtoken.security.Keys; // jjwt: 서명·검증용 키 객체 생성 도구
import org.springframework.beans.factory.annotation.Value; // Spring: 설정값 주입
import org.springframework.http.HttpStatus; // Spring: HTTP 상태를 나타내는 enum
import org.springframework.stereotype.Component; // Spring: 관리할 Bean으로 등록하는 표시

import javax.crypto.SecretKey; // Java 기본 제공: 비밀키 객체의 규약인 인터페이스
import java.nio.charset.StandardCharsets; // Java 기본 제공: UTF-8 등 표준 문자 인코딩
import java.time.Duration; // Java 기본 제공: 시간의 길이
import java.time.Instant; // Java 기본 제공: 특정 시점
import java.util.Date; // Java 기본 제공: jjwt의 시간 설정에 전달할 시각 타입

@Component // [1]
public class JwtUtil {

    private final SecretKey secretKey;
    private final Duration accessExpiration;

    public JwtUtil( // [2]
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-expiration}") Long accessExpiration
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessExpiration = Duration.ofSeconds(accessExpiration);
    }

    public String createAccessToken(Long memberId, String email) { // [3]
        Instant now = Instant.now();

        return Jwts.builder()
                .subject(String.valueOf(memberId)) // [4]
                .claim("email", email)
                .issuedAt(Date.from(now)) // [5]
                .expiration(Date.from(now.plus(accessExpiration)))
                .signWith(secretKey) // [6]
                .compact();
    }

    public Long getMemberId(String token) {
        try {
            return Long.valueOf(getClaims(token).getPayload().getSubject()); // [7]
        } catch (ExpiredJwtException e) { // [8]
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_4",
                    "토큰이 만료되었습니다. 다시 로그인해주세요.");
        } catch (JwtException | IllegalArgumentException e) { // [9]
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_3",
                    "유효하지 않은 토큰입니다.");
        }
    }

    private Jws<Claims> getClaims(String token) { // [10]
        return Jwts.parser()
                .verifyWith(secretKey)
                .clockSkewSeconds(60)
                .build()
                .parseSignedClaims(token);
    }
}

/*
 * [1] Bean 등록
 * Spring이 JwtUtil 객체를 생성하고 관리한다. 다른 서비스·관문에서 생성자로 주입받아 사용한다.
 *
 * [2] 설정값 주입과 사용 형태 변환
 * 환경변수 → application.yaml의 jwt 설정 → @Value가 생성자 매개변수에 값을 주입한다.
 * secret은 String, 매개변수 accessExpiration은 Long이다.
 * 문자열 키 → UTF-8 바이트 배열 → HMAC 서명용 SecretKey 객체로 바꿔 필드에 보관한다.
 * 유효시간 숫자 → Duration.ofSeconds(...)로 시간 길이 객체를 만들어 보관한다.
 * 이 단계는 해시 계산이 아니다. 서명과 만료 시각 계산에 쓸 형태로 변환하는 것이다.
 * this.accessExpiration은 Duration 필드이고, 오른쪽 accessExpiration은 Long 매개변수다.
 * final 필드는 생성자에서 설정한 뒤 다른 값으로 재할당하지 않는다.
 *
 * [3] 토큰 생성 시작
 * 로그인 서비스가 DB에서 확인한 회원 ID·이메일을 전달하면 최종 JWT 문자열을 반환한다.
 * Instant.now()는 현재 시점을 구한다. Duration은 시간 길이, Instant는 특정 시점이다.
 * Jwts는 클래스이고 builder()는 JWT 빌더 객체를 반환하는 static 메서드다.
 * 이후 메서드들은 반환된 빌더를 통해 설정을 이어간다.
 *
 * [4] payload에 회원 정보 저장
 * subject는 표준 클레임 sub에 회원 ID를 저장한다. 문자열을 받으므로 Long을 String으로 바꾼다.
 * claim("email", email)은 우리가 정한 이름 email로 부가 정보를 넣는다.
 * sub도 클레임이며, subject와 claim 모두 payload를 설정한다. header에 넣는 것이 아니다.
 * email은 참고용이고, 회원 식별에는 sub를 사용한다.
 *
 * [5] 발급·만료 시각 설정
 * issuedAt은 iat, expiration은 exp 클레임을 payload에 넣는다.
 * now.plus(accessExpiration) = 발급 시각 + 유효시간 = 만료 시각이다.
 * jjwt 메서드가 Date를 받으므로 Date.from으로 Instant의 표현 타입을 바꾼다.
 * 생성자에서 만료 시각을 고정하지 않고, 토큰을 만들 때마다 현재 시각을 기준으로 계산한다.
 *
 * [6] 서명과 최종 문자열
 * signWith는 서명용 키를 설정하고 키에 맞는 알고리즘을 선택한다. 알고리즘은 header의 alg에 반영된다.
 * compact는 header·payload를 Base64URL로 인코딩하고 HMAC 서명을 계산해
 * '인코딩된header.인코딩된payload.서명' 형태의 String 하나를 반환한다.
 * 비밀키 자체는 토큰에 포함되지 않는다. payload는 암호화가 아니므로 누구나 읽을 수 있다.
 * 같은 키와 같은 입력이면 같은 서명을 계산할 수 있지만, 서명에서 원본을 복호화하는 것은 아니다.
 *
 * [7] 검증 후 회원 ID만 꺼내기
 * token은 Bearer 접두사를 제외한 JWT 문자열을 전달받는다.
 * 한 줄을 실행 순서대로 풀면 다음과 같다(설명용 예시).
 * Jws<Claims> verifiedToken = getClaims(token); // 서명·시간 검증을 통과한 JWT 객체
 * Claims payload = verifiedToken.getPayload(); // 그 객체에서 payload를 꺼냄
 * String subject = payload.getSubject();       // payload에서 sub 문자열을 꺼냄
 * Long memberId = Long.valueOf(subject);       // 회원 ID 문자열 하나만 Long으로 변환
 * 점(.)은 JWT 문자열의 구분자가 아니라 앞에서 반환된 객체의 메서드를 호출하는 Java 문법이다.
 * 검증에 실패하면 반환을 완료하지 못하고 아래 catch로 넘어간다.
 *
 * [8] 만료 오류 구분
 * jjwt가 던진 ExpiredJwtException을 잡아 AUTH401_4인 ApiException으로 바꿔 던진다.
 * 만료 예외도 JwtException의 자식이므로 넓은 범위인 [9]보다 먼저 잡아야 한다.
 * 예외 생성자의 첫 인자에는 HTTP 상태, 다음에는 본문 code와 message를 전달한다.
 * 전역 처리기가 각각 꺼내 실제 HTTP 상태와 공통 실패 응답 본문을 만든다.
 *
 * [9] 나머지 토큰 오류
 * catch의 |는 조건식의 논리 OR인 ||가 아니라 여러 예외 타입을 함께 잡는 멀티 캐치 문법이다.
 * JwtException은 jjwt의 서명·형식 등 토큰 처리 오류를 잡는다.
 * IllegalArgumentException은 Java가 제공하며 부적절한 인자가 전달됐음을 나타낸다.
 * 라이브러리가 입력을 검사해 던지기도 하고, 우리가 조건을 검사해서 직접 던질 수도 있다.
 * Long.valueOf에서 숫자가 아닌 sub를 변환하면 NumberFormatException이 발생한다.
 * 이 예외는 IllegalArgumentException의 자식이므로 여기에서 함께 잡힌다.
 * 만료 외 이 두 계열의 오류는 401·AUTH401_3으로 응답하게 한다.
 *
 * [10] 토큰 검사기 준비 → 검사 → 결과 반환
 * private이므로 이 클래스 내부에서만 호출한다.
 * parser()                 : 검사기를 만들 빌더를 받는다.
 * verifyWith(secretKey)    : 서명 검증에 사용할 키를 설정한다.
 * clockSkewSeconds(60)     : 시간 검증에 60초 오차를 허용한다.
 *                           발급·검증 서버 등의 시계 차이를 위한 것이며 클라이언트 시계를 비교하지 않는다.
 *                           만료 판정에도 이 여유가 적용된다.
 * build()                  : 설정한 검사기(파서)를 완성한다.
 * parseSignedClaims(token) : 받은 토큰을 읽으면서 실제 서명·만료 여부 등을 검증한다.
 * 통과하면 header·payload·서명 정보를 다루는 Jws<Claims> 객체를 반환한다.
 * compact처럼 점으로 연결된 문자열을 반환하는 것이 아니다.
 * return이 검사를 수행하는 것이 아니라, 오른쪽 코드를 실행한 마지막 결과를 호출한 곳에 반환한다.
 */
