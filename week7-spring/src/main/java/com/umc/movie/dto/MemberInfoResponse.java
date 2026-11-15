package com.umc.movie.dto;

public record MemberInfoResponse(
        Long id,
        String email,
        String nickname
) {}