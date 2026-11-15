package com.umc11th.service;

import com.umc11th.dto.LoginRequest;
import com.umc11th.dto.LoginResponse;
import com.umc11th.entity.Member;
import com.umc11th.exception.ApiException;
import com.umc11th.repository.MemberRepository;
import com.umc11th.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        Member member = memberRepository.findByEmail(request.email())
                .orElseThrow(this::invalidCredentials);

        if (!passwordEncoder.matches(request.password(), member.getPassword())) {
            throw invalidCredentials();
        }

        String accessToken = jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());
        return new LoginResponse(member.getNickname(), accessToken);
    }

    private ApiException invalidCredentials() {
        return new ApiException(
                HttpStatus.UNAUTHORIZED,
                "AUTH401_1",
                "이메일 또는 비밀번호가 올바르지 않습니다."
        );
    }
}
