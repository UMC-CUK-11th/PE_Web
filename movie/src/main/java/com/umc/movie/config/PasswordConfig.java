package com.umc.movie.config;

import org.springframework.context.annotation.Bean; // Spring: 메서드가 반환한 객체를 Bean으로 등록
import org.springframework.context.annotation.Configuration; // Spring: 설정 클래스 표시
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Spring Security: bcrypt 구현 클래스
import org.springframework.security.crypto.password.PasswordEncoder; // Spring Security: 비밀번호 처리 규약인 인터페이스

@Configuration // [1]
public class PasswordConfig {
    @Bean // [2]
    public PasswordEncoder passwordEncoder() { // [3]
        return new BCryptPasswordEncoder();
    }
}

/*
 * [1] config는 도구를 준비하는 설정 코드를 모아두는 패키지다. 이름 자체에 특별한 기능은 없다.
 * Spring이 설정 클래스로 인식하게 하는 표시는 @Configuration이다.
 * 여기서는 비밀번호 처리 도구를 준비하고, 서비스에서는 그 도구로 회원가입·로그인 업무를 처리한다.
 *
 * [2] new BCryptPasswordEncoder()로 만든 객체를 반환하면 Spring이 Bean으로 등록해 관리한다.
 * 회원가입·로그인 서비스는 생성자 주입으로 이 객체를 받아 각각 encode()·matches()를 사용한다.
 * 각 서비스에서 직접 new로 생성할 수도 있지만, 여기서 준비하면 생성 방식과 설정을 한 곳에서 관리한다.
 * import만으로 객체가 생성되거나 Bean으로 등록되는 것은 아니다.
 *
 * [3] PasswordConfig는 클래스, passwordEncoder()는 객체를 만들어 반환하는 메서드다.
 * PasswordEncoder는 반환 타입인 인터페이스이고, 실제 생성되는 객체는 이를 구현한 BCryptPasswordEncoder다.
 * 생성자·encode()·matches()는 라이브러리에 이미 구현돼 있으므로 우리가 다시 만들 필요가 없다.
 * 서비스는 구체적인 구현 대신 PasswordEncoder의 기능에 의존한다.
 * 즉, 여러 계산 단계를 추가한 것이 아니라 객체를 준비하는 곳과 사용하는 곳을 나눈 구조다.
 */
