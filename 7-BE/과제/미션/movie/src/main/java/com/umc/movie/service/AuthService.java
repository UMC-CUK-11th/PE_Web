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

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        // 없는 이메일과 틀린 비밀번호를 같은 응답으로 묶어 가입 여부를 드러내지 않는다
        Member member = memberRepository.findByEmail(request.email())
                .filter(found -> passwordEncoder.matches(request.password(), found.getPassword()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_1",
                        "이메일 또는 비밀번호가 올바르지 않습니다."));

        String accessToken = jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());
        return new LoginResponse(member.getNickname(), accessToken);
    }
}
