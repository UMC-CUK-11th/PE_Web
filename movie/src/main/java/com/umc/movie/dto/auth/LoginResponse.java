package com.umc.movie.dto.auth;

public record LoginResponse( // [1]
        String nickname,
        String accessToken
) {
}

/*
 * [1] 로그인 성공 결과인 닉네임과 JWT 문자열을 담는다.
 * 서비스가 new LoginResponse(member.getNickname(), accessToken)으로 생성한다.
 * 컨트롤러가 ApiResponse로 감싸므로 최종 JSON의 result 안에 nickname과 accessToken이 들어간다.
 */
