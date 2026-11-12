package com.umc.movie.interceptor;

import com.umc.movie.exception.ApiException; // 프로젝트: 공통 실패 응답용 예외
import com.umc.movie.util.JwtUtil; // 프로젝트: JWT 생성·검증 도구
import jakarta.servlet.http.HttpServletRequest; // Servlet API: HTTP 요청 정보·서버 내부 속성 접근
import jakarta.servlet.http.HttpServletResponse; // Servlet API: HTTP 응답 작성
import lombok.RequiredArgsConstructor; // Lombok: final 필드를 받는 생성자 생성
import org.springframework.http.HttpHeaders; // Spring: Authorization 등 HTTP 헤더 이름 상수
import org.springframework.http.HttpMethod; // Spring: HTTP 메서드 표현·비교
import org.springframework.http.HttpStatus; // Spring: HTTP 상태 enum
import org.springframework.stereotype.Component; // Spring: Bean 등록
import org.springframework.web.servlet.HandlerInterceptor; // Spring MVC: 컨트롤러 전후 처리 규약

@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor { // [1]

    public static final String MEMBER_ID = "memberId"; // [2]
    private static final String BEARER_PREFIX = "Bearer "; // [3]

    private final JwtUtil jwtUtil;

    @Override // [4]
    public boolean preHandle(
            HttpServletRequest request, // [5]
            HttpServletResponse response, // [6]
            Object handler // [7]
    ) {
        if (HttpMethod.OPTIONS.matches(request.getMethod())) { // [8]
            return true;
        }

        String header = request.getHeader(HttpHeaders.AUTHORIZATION); // [9]

        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_2",
                    "로그인이 필요한 요청입니다.");
        }

        Long memberId = jwtUtil.getMemberId(header.substring(BEARER_PREFIX.length())); // [10]
        request.setAttribute(MEMBER_ID, memberId); // [11]

        return true;
    }
}

/*
 * [1] @Component로 Bean을 등록하고 Lombok 생성자를 통해 JwtUtil Bean을 주입받는다.
 * HandlerInterceptor의 preHandle을 구현하고 WebConfig에 등록하면 Spring이 컨트롤러 실행 전에 호출한다.
 * 인터셉터가 controller.getMe(memberId)처럼 컨트롤러를 직접 호출하는 구조는 아니다.
 *
 * [2] MEMBER_ID는 실제 회원 번호가 아니라 요청에 저장한 값을 찾을 이름표다.
 * public이라 이후 컨트롤러도 AuthInterceptor.MEMBER_ID로 같은 이름을 사용할 수 있다.
 * static final은 객체마다 따로 두지 않는 고정값이다. 토큰이나 회원 번호가 이 상수에 저장되는 것은 아니다.
 *
 * [3] HTTP Authorization 헤더의 값은 'Bearer aaa.bbb.ccc' 형태다.
 * Bearer 뒤 공백까지 접두사에 포함한다. JWT 내부 구분자인 점(.)과는 관계없다.
 *
 * [4] @Override는 인터페이스의 메서드를 재정의했다는 표시다. 어노테이션 자체가 호출하는 것은 아니다.
 * 정해진 메서드 형태를 따라야 하므로 사용하지 않는 response·handler도 매개변수로 받는다.
 * true는 다음 처리로 진행, false는 진행 중단이다. 우리 코드는 실패 시 예외를 던진다.
 *
 * [5] request는 HTTP 요청 전반을 다루는 객체다. 요청마다 Spring이 preHandle 인자로 전달한다.
 * 현재 내장 Tomcat이 요청 처리용으로 제공하는 객체이며, 서비스처럼 생성자로 주입받는 일반 Bean이 아니다.
 * getMethod·getHeader 등으로 메서드·헤더를 읽고 setAttribute로 서버 내부 정보를 붙일 수 있다.
 * LoginRequest 같은 DTO는 바디의 특정 데이터를 담는 우리 객체이고, 이 request는 요청 전체를 다루는 객체다.
 * Tomcat은 JVM 기본 구성품이 아니라 Spring Boot에 포함되어 JVM 안에서 함께 실행되는 서블릿 컨테이너다.
 *
 * [6] response는 나갈 HTTP 응답의 상태·헤더·본문을 다루는 객체다. Tomcat이 제공하고 Spring이 전달한다.
 * 여기서는 직접 응답하지 않고 ApiException을 전역 처리기에 맡기므로 사용하지 않는다.
 * 다른 인터셉터에서는 응답 헤더 추가·리다이렉트 등에 사용할 수 있다.
 *
 * [7] handler는 Spring이 경로를 보고 미리 찾은 처리 대상이다.
 * 일반 컨트롤러 요청에서는 컨트롤러 메서드 정보를 담은 HandlerMethod 객체가 들어온다.
 * 여러 종류의 처리 대상을 받을 수 있어 Object 타입이며, 여기서는 사용하지 않는다.
 * 필요하면 대상 메서드의 어노테이션 등을 확인할 때 사용한다.
 *
 * [8] OPTIONS 사전 요청에는 인증 토큰이 없을 수 있으므로 인증 검사 없이 통과시킨다.
 *
 * [9] HttpHeaders.AUTHORIZATION은 문자열 'Authorization'을 나타내는 상수다.
 * 요청 헤더에서 그 이름에 해당하는 값만 읽는다. 예: 'Bearer aaa.bbb.ccc'.
 * 헤더가 없거나 Bearer 접두사 형식이 아니면 인증 정보가 없는 요청으로 처리해 AUTH401_2를 던진다.
 *
 * [10] substring으로 'Bearer ' 길이만큼 앞을 제거한 JWT 전체를 JwtUtil에 전달한다.
 * 여기서 header·payload·서명을 직접 나눌 필요는 없다.
 * JwtUtil 내부의 parseSignedClaims가 읽기·서명·시간 검증을 하고 sub를 Long으로 바꿔 반환한다.
 * 실패하면 예외가 발생하므로 아래 저장 단계로 진행하지 않는다.
 *
 * [11] 검증한 회원 ID를 다음 처리 단계에 전달하기 위해 같은 요청 객체에 남긴다.
 * request에는 회원 전용 memberId 필드나 setMemberId가 미리 정의돼 있지 않다.
 * 대신 Map 같은 범용 속성 저장 공간에 이름과 값을 추가한다. 새 Java 필드를 만드는 것은 아니다.
 * request.setAttribute("memberId", 1L);처럼 이름표와 실제 값을 저장하는 것이다.
 * 이후 컨트롤러에서 @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId로 받으면
 * Spring이 같은 요청의 'memberId' 속성을 찾아 매개변수에 넣어준다(이후 구현할 사용 예시).
 * 상수는 문자열 이름표 그대로이며, 실제 번호는 지역변수 memberId와 요청 속성의 값이다.
 * 클라이언트의 바디·헤더를 바꾸는 것이 아니라 해당 요청 처리 중 서버 내부에서 정보를 전달한다.
 *
 * 전체 흐름: 요청 도착 → Spring이 처리 대상 찾기 → 인터셉터 실행 → 토큰 검증·회원 ID 저장
 * → true 반환 → Spring이 다음 단계 진행 → 컨트롤러가 요청 속성의 회원 ID 사용.
 */
