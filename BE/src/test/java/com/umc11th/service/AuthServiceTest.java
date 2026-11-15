package com.umc11th.service;

import com.umc11th.dto.LoginRequest;
import com.umc11th.dto.LoginResponse;
import com.umc11th.entity.Member;
import com.umc11th.exception.ApiException;
import com.umc11th.repository.MemberRepository;
import com.umc11th.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    @Test
    void loginReturnsAccessToken() {
        Member member = member();
        when(memberRepository.findByEmail("member@umc.com")).thenReturn(Optional.of(member));
        when(passwordEncoder.matches("password", "bcrypt-hash")).thenReturn(true);
        when(jwtUtil.createAccessToken(1L, "member@umc.com")).thenReturn("access-token");

        LoginResponse response = authService.login(new LoginRequest("member@umc.com", "password"));

        assertThat(response.nickname()).isEqualTo("회원");
        assertThat(response.accessToken()).isEqualTo("access-token");
    }

    @Test
    void unknownEmailUsesAuth4011() {
        when(memberRepository.findByEmail("none@umc.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(new LoginRequest("none@umc.com", "password")))
                .isInstanceOfSatisfying(ApiException.class, exception ->
                        assertThat(exception.getCode()).isEqualTo("AUTH401_1")
                );
    }

    @Test
    void wrongPasswordUsesAuth4011() {
        Member member = member();
        when(memberRepository.findByEmail("member@umc.com")).thenReturn(Optional.of(member));
        when(passwordEncoder.matches("wrong", "bcrypt-hash")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(new LoginRequest("member@umc.com", "wrong")))
                .isInstanceOfSatisfying(ApiException.class, exception ->
                        assertThat(exception.getCode()).isEqualTo("AUTH401_1")
                );
    }

    private Member member() {
        Member member = Member.builder()
                .email("member@umc.com")
                .password("bcrypt-hash")
                .nickname("회원")
                .build();
        ReflectionTestUtils.setField(member, "memberId", 1L);
        return member;
    }
}
