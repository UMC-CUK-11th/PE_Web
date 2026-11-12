// src/main/java/com/umc/movie/config/WebConfig.java
package com.umc.movie.config;

import com.umc.movie.interceptor.AuthInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // [1]
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer { // [2]

    private final AuthInterceptor authInterceptor;

    @Override
    public void addCorsMappings(CorsRegistry registry) { // [3]
        registry.addMapping("/**") // [4]
                .allowedOrigins("http://localhost:5173") // [5]
                .allowedMethods("GET", "POST", "PATCH", "DELETE") // [6]
                .allowedHeaders("*"); // [7]
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) { // [8]
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(
                        "/auth/**",
                        "/members",
                        "/members/nickname/**",
                        "/members/email/**",
                        "/members/*/ratings",
                        "/error"
                );
    }
}

// 이 파일의 역할
// 5173 프론트에서 8080 Spring 서버로 요청할 때 적용할 CORS 허용 정책을 설정한다.
// 프론트가 아니라 응답을 보내는 서버 쪽에 설정하는 것이다.
//=========================================================================================
// Registry 개요
// registry는 '등록부'라는 뜻으로, Spring에 웹 처리 규칙을 등록하는 도구다.
// 서버 시작 시 Spring이 아래 설정 메서드들을 호출하며 각 등록 도구를 인자로 전달한다.
// 우리가 규칙을 등록하면 Spring이 그 설정을 바탕으로 이후 요청을 처리한다.
// registry 자체가 직접 토큰을 검사하거나 CORS 오류를 없애는 것은 아니다.
//
// CorsRegistry        : 허용할 출처·HTTP 메서드·헤더 등 CORS 정책 등록
// InterceptorRegistry : 인터셉터와 적용·제외 경로 등록
//
// 두 메서드의 registry는 이름만 같을 뿐, 타입과 객체가 다른 별개의 매개변수다.
// 이름을 corsRegistry·interceptorRegistry로 바꿔도 된다. 사용 가능한 기능은 타입이 결정한다.
//
//=========================================================================================
//
// 경로 패턴 읽는 법
// 경로는 /로 구분한다. 아래 문자열은 API를 만드는 주소 선언이 아니라 설정을 적용할 경로의 조건이다.
// /members             : 정확히 /members 경로
// *                    : /를 넘지 않는 범위에서 글자들을 대신한다.
// /members/*/ratings   : /members/1/ratings, /members/25/ratings 등에 해당한다.
//                        *가 숫자인지 검사하는 것은 아니다. /members/abc/ratings도 패턴에는 맞는다.
//                        /members/1/detail/ratings처럼 중간에 /가 하나 더 있으면 맞지 않는다.
// **                   : 여러 단계의 하위 경로까지 포함한다. 여기서는 경로 끝에 사용한다.
// /auth/**             : /auth 및 그 아래 /auth/login, /auth/a/b 같은 경로
// /**                  : 모든 경로
//
// CORS의 addMapping("/**")는 모든 경로에 아래 CORS 정책을 적용한다는 뜻이다.
// 인터셉터의 addPathPatterns("/**")는 모든 경로를 검사 대상으로 등록한다는 뜻이다.
// excludePathPatterns(...)는 그 대상에서 나열한 경로 패턴을 제외한다.
// 같은 /**라도 어느 설정 메서드에 전달하는지에 따라 적용되는 규칙이 다르다.
// 경로 패턴은 HTTP 메서드를 구분하지 않는다. /members를 제외하면 POST뿐 아니라 GET 등도 제외된다.
//
// 두 설정의 적용 범위 비교
// CORS: addMapping("/**")로 모든 경로를 고른 뒤, 그 경로에 허용 출처·메서드·헤더 정책을 적용한다.
// 인터셉터: addPathPatterns("/**")로 모든 경로를 검사 대상으로 고른 뒤,
// excludePathPatterns(...)에 나열한 경로만 이 인증 인터셉터를 거치지 않게 한다.
// 즉, 둘 다 적용할 경로를 정하지만 현재 인터셉터 설정에는 일부 경로를 제외하는 단계가 더 있다.
// 새 API도 기본적으로 인증 검사를 받으며, 로그인 없이 사용할 경로만 제외 목록에 넣는다.
//
// CORS에서 적용할 '경로 범위'를 정하는 것은 addMapping이다.
// allowedHeaders("*")는 모든 요청·응답에 적용한다는 뜻이 아니라,
// 허용된 교차 출처 요청에서 Authorization·Content-Type 등 모든 요청 헤더 이름을 허용한다는 뜻이다.
// allowedMethods는 교차 출처 요청에 허용할 HTTP 메서드를 정한다.
// allowedOrigins에는 프론트의 출처(프로토콜 + 호스트 + 포트)를 적는다. 페이지 경로는 포함하지 않는다.
// 우리가 규칙과 범위를 정해두면, 실제 요청에서 해당 정책을 적용하는 일은 Spring이 수행한다.
//
//=========================================================================================
// [1] @Configuration: Spring이 읽고 관리할 설정 클래스라는 표시다.
// 이 클래스는 @SpringBootApplication의 컴포넌트 탐색 범위 안에 있으므로 자동으로 발견된다.
//
// [2] implements WebMvcConfigurer: Spring MVC의 웹 설정을 필요한 부분만 추가·조정하기 위한 인터페이스다.
// 여기서는 CORS 설정과 인증 인터셉터 등록 메서드를 재정의한다. API를 만드는 클래스는 아니다.
//
// [3] addCorsMappings: Spring이 웹 설정을 구성할 때 호출하는 메서드다.
// registry는 우리가 new로 만들거나 프론트에서 보내는 값이 아니라 Spring이 인자로 전달하는 설정 등록 객체다.
// @Override는 인터페이스에 정의된 메서드를 재정의한다는 Java 표시다.
// 우리가 컨트롤러나 서비스에서 이 메서드를 직접 호출할 필요는 없다.
//
// [4] addMapping("/**"): 이 CORS 정책을 모든 경로에 적용한다.
// 아래 메서드들을 점으로 이어 쓰는 것은 함수를 인자로 넘기는 것이 아니라 메서드 호출을 연결하는 방식이다.
// addMapping이 반환한 설정 객체에 allowedOrigins, allowedMethods, allowedHeaders를 차례로 호출한다.
// 경로를 등록했다고 해당 API가 생기는 것은 아니다. 컨트롤러가 없으면 여전히 404일 수 있다.
//
// [5] allowedOrigins: 응답을 읽도록 허용할 프론트의 출처(Origin)를 지정한다.
// 여기에는 요청 대상인 8080 서버가 아니라 요청을 보내는 5173 프론트 주소를 적는다.
// Origin은 프로토콜 + 호스트 + 포트다. 127.0.0.1:5173이나 localhost:5174는 이 주소와 다른 Origin이다.
// 허용된 교차 출처 요청에는 Spring이 Access-Control-Allow-Origin 등의 응답 헤더를 제공하고,
// 브라우저가 이를 확인해 프론트 코드에 응답을 제공할지 판단한다.
// 이것은 로그인·권한 검사나 외부 도구의 접근을 차단하는 방화벽 설정이 아니다.
//
// [6] allowedMethods: 교차 출처 요청에 허용할 HTTP 메서드 목록이다.
// GET은 조회, POST는 생성, PATCH는 일부 수정, DELETE는 삭제에 사용한다.
// 이 설정만으로 각 메서드의 API가 구현되지는 않는다. PUT은 현재 허용 목록에 없다.
// 사전 요청(OPTIONS)이 필요한 경우 Spring의 CORS 처리가 실제 요청 메서드의 허용 여부를 확인한다.
//
// [7] allowedHeaders("*"): 교차 출처 요청에서 보낼 요청 헤더 이름을 모두 허용한다.
// 예를 들어 Content-Type, Authorization 같은 헤더를 사용할 수 있도록 하는 설정이다.
// 응답 헤더를 모두 공개하거나, 토큰을 자동으로 넣거나, 인증을 통과시켜 준다는 뜻은 아니다.
//
// [8] Spring이 전달한 registry에 AuthInterceptor Bean과 적용 경로를 등록한다.
// @Component는 객체 등록이고, 이 설정은 그 객체를 실제 요청 처리에 연결하는 것이다.
// 모든 경로에 적용한 뒤 로그인·회원가입·중복 확인·회원별 평점 목록·내부 오류 경로는 제외한다.
// 경로로만 제외하므로 /members의 POST뿐 아니라 같은 경로의 다른 HTTP 메서드도 제외된다.
//
// 설정을 바꾼 뒤에는 Spring 서버를 재시작하고 프론트에서 다시 요청해 확인한다.
// CORS가 해결되어도 API 경로 오류(404), DB 오류 등은 별도로 해결해야 한다.
