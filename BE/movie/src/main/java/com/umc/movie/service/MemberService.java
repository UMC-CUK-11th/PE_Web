package com.umc.movie.service;

import com.umc.movie.dto.MemberInfoResponse;
import com.umc.movie.dto.MemberUpdateRequest;
import com.umc.movie.exception.ApiException;

import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.dto.MemberResponse;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.DuplicateMemberException;

import java.nio.charset.StandardCharsets;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import com.umc.movie.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberInfoResponse getMyInfo(Long memberId) {
        return MemberInfoResponse.from(findMember(memberId));
    }

    @Transactional
    public MemberInfoResponse updateMyInfo(Long memberId, MemberUpdateRequest request) {
        Member member = findMember(memberId);
        if (memberRepository.existsByNicknameAndMemberIdNot(request.nickname(), memberId)) {
            throw new ApiException(HttpStatus.CONFLICT, "MEMBER409_1", "이미 사용 중인 닉네임입니다.");
        }
        member.updateNickname(request.nickname());
        memberRepository.saveAndFlush(member);
        return MemberInfoResponse.from(member);
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId).orElseThrow(() ->
                new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1", "해당 회원을 찾을 수 없습니다."));
    }

    @Transactional
    public MemberResponse signUp(SignUpRequest request) {
        // BCrypt는 문자 수가 아니라 UTF-8 바이트 수로 72바이트까지 처리합니다.
        if (request.password().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "비밀번호는 UTF-8 기준 72바이트 이하여야 합니다.");
        }
        if (memberRepository.existsByEmail(request.email())) {
            throw new DuplicateMemberException("MEMBER4091", "이미 사용 중인 이메일입니다.");
        }
        if (memberRepository.existsByNickname(request.nickname())) {
            throw new DuplicateMemberException("MEMBER4092", "이미 사용 중인 닉네임입니다.");
        }
        Member member = Member.builder().email(request.email())
                .password(passwordEncoder.encode(request.password())).nickname(request.nickname()).build();
        Member saved = memberRepository.save(member);
        return new MemberResponse(saved.getMemberId(), saved.getEmail(), saved.getNickname());
    }

    public NicknameCheckResponse checkNickname(String nickname) {
        return new NicknameCheckResponse(!memberRepository.existsByNickname(nickname));
    }

    public EmailCheckResponse checkEmail(String email) {
        return new EmailCheckResponse(!memberRepository.existsByEmail(email));
    }
}
