package com.umc11th.dto;

import com.umc11th.entity.Member;

public record MemberResponse(
        Long memberId,
        String email,
        String nickname
) {
    public static MemberResponse from(Member member) {
        return new MemberResponse(
                member.getMemberId(),
                member.getEmail(),
                member.getNickname()
        );
    }
}
