package com.umc.movie.dto;

import com.umc.movie.entity.Member;

import java.time.LocalDateTime;

public record MemberInfoResponse(
        // 8주차: 프론트가 GET /members/{memberId}/ratings로 내 평점을 찾을 수 있도록 함께 내려줘요.
        Long memberId,
        String email,
        String nickname,
        LocalDateTime createdAt
) {
    // 엔티티를 그대로 응답하면 password까지 나가므로 DTO로 옮겨 담아요.
    public static MemberInfoResponse from(Member member) {
        return new MemberInfoResponse(member.getMemberId(), member.getEmail(), member.getNickname(), member.getCreatedAt());
    }
}
