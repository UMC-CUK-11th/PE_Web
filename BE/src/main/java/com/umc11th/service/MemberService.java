package com.umc11th.service;

import com.umc11th.dto.EmailCheckResponse;
import com.umc11th.dto.NicknameCheckResponse;
import com.umc11th.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class MemberService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)+$"
    );

    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public NicknameCheckResponse checkNickname(String nickname) {
        int length = nickname.codePointCount(0, nickname.length());
        if (length < 2 || length > 12) {
            throw new IllegalArgumentException("닉네임은 2자 이상 12자 이하여야 합니다.");
        }

        return new NicknameCheckResponse(!memberRepository.existsByNickname(nickname));
    }

    @Transactional(readOnly = true)
    public EmailCheckResponse checkEmail(String email) {
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("올바른 이메일 형식이 아닙니다.");
        }

        return new EmailCheckResponse(!memberRepository.existsByEmail(email));
    }
}
