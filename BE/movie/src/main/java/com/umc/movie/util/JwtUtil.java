package com.umc.movie.util;

import com.umc.movie.exception.ApiException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    private final SecretKey secretKey;
    private final long accessExpiration;

    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.access-expiration}") long accessExpiration) {
        secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        if (accessExpiration <= 0) throw new IllegalArgumentException("JWT expiration must be positive");
        this.accessExpiration = accessExpiration;
    }

    public String createAccessToken(Long memberId, String email) {
        Instant now = Instant.now();
        return Jwts.builder().subject(memberId.toString()).claim("email", email)
                .issuedAt(Date.from(now)).expiration(Date.from(now.plusSeconds(accessExpiration)))
                .signWith(secretKey).compact();
    }

    public Long getMemberId(String token) {
        try {
            Claims claims = Jwts.parser().verifyWith(secretKey).clockSkewSeconds(60)
                    .build().parseSignedClaims(token).getPayload();
            Long id = Long.valueOf(claims.getSubject());
            if (id <= 0 || claims.getExpiration() == null) throw new IllegalArgumentException();
            return id;
        } catch (ExpiredJwtException ex) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_4", "토큰이 만료되었습니다. 다시 로그인해주세요.");
        } catch (JwtException | IllegalArgumentException ex) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_3", "유효하지 않은 토큰입니다.");
        }
    }
}
