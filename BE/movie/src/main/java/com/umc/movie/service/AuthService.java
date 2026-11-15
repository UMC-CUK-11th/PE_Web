package com.umc.movie.service;

import com.umc.movie.dto.LoginRequest;
import com.umc.movie.dto.LoginResponse;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        Member member = memberRepository.findByEmail(request.email()).orElseThrow(this::invalidLogin);
        // encode()로 새 해시를 만들어 비교하지 않는다. matches()가 저장된 salt를 이용한다.
        if (request.password().getBytes(StandardCharsets.UTF_8).length > 72
                || !passwordEncoder.matches(request.password(), member.getPassword())) {
            throw invalidLogin();
        }
        String accessToken = jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());
        return new LoginResponse(member.getNickname(), accessToken);
    }

    private ApiException invalidLogin() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_1", "이메일 또는 비밀번호가 올바르지 않습니다.");
    }
}
