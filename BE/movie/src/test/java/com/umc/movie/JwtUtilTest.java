package com.umc.movie;

import com.umc.movie.exception.ApiException;
import com.umc.movie.util.JwtUtil;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtUtilTest {
    static final String SECRET = "unit-test-signing-key-only-0123456789abcdef";
    final JwtUtil jwt = new JwtUtil(SECRET, 3600L);

    @Test
    void expiredTokenHasDistinctCodeIncludingClockSkew() {
        String token = Jwts.builder().subject("1")
                .expiration(Date.from(Instant.now().minusSeconds(120)))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8))).compact();
        assertThatThrownBy(() -> jwt.getMemberId(token)).isInstanceOfSatisfying(ApiException.class,
                exception -> org.assertj.core.api.Assertions.assertThat(exception.getCode()).isEqualTo("AUTH401_4"));
    }

    @Test
    void signedTokenWithInvalidSubjectOrWithoutExpirationIsRejected() {
        var key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
        String invalidSubject = Jwts.builder().subject("not-a-member")
                .expiration(Date.from(Instant.now().plusSeconds(100))).signWith(key).compact();
        String noExpiration = Jwts.builder().subject("1").signWith(key).compact();
        for (String token : new String[]{ invalidSubject, noExpiration }) {
            assertThatThrownBy(() -> jwt.getMemberId(token)).isInstanceOfSatisfying(ApiException.class,
                    exception -> org.assertj.core.api.Assertions.assertThat(exception.getCode()).isEqualTo("AUTH401_3"));
        }
    }
}
