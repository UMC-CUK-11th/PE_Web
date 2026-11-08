package com.umc11th.service;

import com.umc11th.dto.EmailCheckResponse;
import com.umc11th.dto.MemberResponse;
import com.umc11th.dto.NicknameCheckResponse;
import com.umc11th.dto.SignUpRequest;
import com.umc11th.entity.Member;
import com.umc11th.exception.BusinessException;
import com.umc11th.exception.ErrorCode;
import com.umc11th.repository.MemberRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.ArgumentMatchers.any;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private MemberService memberService;

    @Test
    void existingNicknameIsUnavailable() {
        when(memberRepository.existsByNickname("수현")).thenReturn(true);

        NicknameCheckResponse response = memberService.checkNickname("수현");

        assertThat(response.available()).isFalse();
        verify(memberRepository).existsByNickname("수현");
    }

    @Test
    void newEmailIsAvailable() {
        when(memberRepository.existsByEmail("new@umc.com")).thenReturn(false);

        EmailCheckResponse response = memberService.checkEmail("new@umc.com");

        assertThat(response.available()).isTrue();
        verify(memberRepository).existsByEmail("new@umc.com");
    }

    @Test
    void invalidNicknameIsRejectedBeforeQuery() {
        assertThatThrownBy(() -> memberService.checkNickname("a"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("닉네임은 2자 이상 12자 이하여야 합니다.");

        verifyNoInteractions(memberRepository);
    }

    @Test
    void invalidEmailIsRejectedBeforeQuery() {
        assertThatThrownBy(() -> memberService.checkEmail("not-email"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("올바른 이메일 형식이 아닙니다.");

        verifyNoInteractions(memberRepository);
    }

    @Test
    void signUpHashesPasswordAndExcludesItFromResponse() {
        SignUpRequest request = new SignUpRequest("new@umc.com", "Umc!1234", "새회원");
        when(memberRepository.existsByEmail(request.email())).thenReturn(false);
        when(memberRepository.existsByNickname(request.nickname())).thenReturn(false);
        when(passwordEncoder.encode(request.password())).thenReturn("bcrypt-hash");
        when(memberRepository.save(any(Member.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MemberResponse response = memberService.signUp(request);

        assertThat(response.email()).isEqualTo("new@umc.com");
        assertThat(response.nickname()).isEqualTo("새회원");
        verify(passwordEncoder).encode("Umc!1234");
    }

    @Test
    void duplicateEmailUsesDedicatedErrorCode() {
        SignUpRequest request = new SignUpRequest("noco@umc.com", "Umc!1234", "새회원");
        when(memberRepository.existsByEmail(request.email())).thenReturn(true);

        assertThatThrownBy(() -> memberService.signUp(request))
                .isInstanceOfSatisfying(BusinessException.class, exception ->
                        assertThat(exception.getErrorCode())
                                .isEqualTo(ErrorCode.MEMBER_EMAIL_DUPLICATE)
                );
    }

    @Test
    void duplicateNicknameUsesDedicatedErrorCode() {
        SignUpRequest request = new SignUpRequest("new@umc.com", "Umc!1234", "수현");
        when(memberRepository.existsByEmail(request.email())).thenReturn(false);
        when(memberRepository.existsByNickname(request.nickname())).thenReturn(true);

        assertThatThrownBy(() -> memberService.signUp(request))
                .isInstanceOfSatisfying(BusinessException.class, exception ->
                        assertThat(exception.getErrorCode())
                                .isEqualTo(ErrorCode.MEMBER_NICKNAME_DUPLICATE)
                );
    }
}
