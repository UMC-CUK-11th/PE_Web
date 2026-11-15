package com.umc11th.util;

import com.umc11th.exception.ApiException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtUtilTest {

    private static final String SECRET = "week07-test-secret-key-must-be-at-least-32-bytes";

    @Test
    void tokenContainsMemberId() {
        JwtUtil jwtUtil = new JwtUtil(SECRET, 3600L);

        String token = jwtUtil.createAccessToken(7L, "member@umc.com");

        assertThat(jwtUtil.getMemberId(token)).isEqualTo(7L);
    }

    @Test
    void tamperedTokenUsesAuth4013() {
        JwtUtil jwtUtil = new JwtUtil(SECRET, 3600L);
        String token = jwtUtil.createAccessToken(7L, "member@umc.com") + "changed";

        assertThatThrownBy(() -> jwtUtil.getMemberId(token))
                .isInstanceOfSatisfying(ApiException.class, exception ->
                        assertThat(exception.getCode()).isEqualTo("AUTH401_3")
                );
    }

    @Test
    void expiredTokenUsesAuth4014() {
        JwtUtil jwtUtil = new JwtUtil(SECRET, -1L);
        String token = jwtUtil.createAccessToken(7L, "member@umc.com");

        assertThatThrownBy(() -> jwtUtil.getMemberId(token))
                .isInstanceOfSatisfying(ApiException.class, exception ->
                        assertThat(exception.getCode()).isEqualTo("AUTH401_4")
                );
    }
}
