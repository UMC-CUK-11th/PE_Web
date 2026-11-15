package com.umc.movie.service;

import com.umc.movie.dto.*;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.umc.movie.dto.MemberUpdateRequest;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberInfoResponse getMyInfo(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "MEMBER404_1",
                        "회원을 찾을 수 없습니다."
                ));

        return new MemberInfoResponse(
                member.getMemberId(),
                member.getEmail(),
                member.getNickname()
        );
    }

    // 기존 닉네임 중복 확인 API
    @Transactional(readOnly = true)
    public NicknameCheckResponse checkNickname(String nickname) {
        boolean exists = memberRepository.existsByNickname(nickname);
        return new NicknameCheckResponse(!exists);
    }

    // 기존 이메일 중복 확인 API
    @Transactional(readOnly = true)
    public EmailCheckResponse checkEmail(String email) {
        boolean exists = memberRepository.existsByEmail(email);
        return new EmailCheckResponse(!exists);
    }

    // 6주차 추가: 회원가입 API
    @Transactional
    public MemberResponse signUp(SignUpRequest request) {

        // 이메일 중복 검사
        if (memberRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException(
                    "이미 사용 중인 이메일입니다."
            );
        }

        // 닉네임 중복 검사
        if (memberRepository.existsByNickname(request.nickname())) {
            throw new IllegalArgumentException(
                    "이미 사용 중인 닉네임입니다."
            );
        }

        // 비밀번호 bcrypt 해시 처리
        Member member = Member.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .nickname(request.nickname())
                .build();

        // DB 저장
        Member savedMember = memberRepository.save(member);

        // 비밀번호를 제외한 회원 정보 반환
        return new MemberResponse(
                savedMember.getMemberId(),
                savedMember.getEmail(),
                savedMember.getNickname()
        );
    }
    @Transactional
    public MemberInfoResponse updateMyInfo(
            Long memberId,
            MemberUpdateRequest request
    ) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "MEMBER404_1",
                        "회원을 찾을 수 없습니다."
                ));

        if (!member.getNickname().equals(request.nickname())
                && memberRepository.existsByNickname(request.nickname())) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "MEMBER409_1",
                    "이미 사용 중인 닉네임입니다."
            );
        }

        member.updateNickname(request.nickname());

        return new MemberInfoResponse(
                member.getMemberId(),
                member.getEmail(),
                member.getNickname()
        );
    }
}
