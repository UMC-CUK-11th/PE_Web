package com.umc11th.dto;

public record LoginResponse(
        String nickname,
        String accessToken
) {
}
