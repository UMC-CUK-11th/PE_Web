package com.umc.movie.dto.member;

public record MemberResponse(
        Long memberId,
        String email,
        String nickname
) {}
