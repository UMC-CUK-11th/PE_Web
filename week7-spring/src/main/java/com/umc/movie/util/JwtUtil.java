package com.umc.movie.util;

import com.umc.movie.exception.ApiException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long accessExpiration;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-expiration}") long accessExpiration
    ) {
        this.secretKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
        this.accessExpiration = accessExpiration;
    }

    // Access Token 발급
    public String createAccessToken(Long memberId, String email) {
        Date now = new Date();

        return Jwts.builder()
                .subject(memberId.toString())
                .claim("email", email)
                .issuedAt(now)
                .expiration(new Date(
                        now.getTime() + accessExpiration * 1000
                ))
                .signWith(secretKey)
                .compact();
    }

    // Access Token 검증 및 회원 ID 추출
    public Long getMemberId(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return Long.parseLong(claims.getSubject());

        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "AUTH401_4",
                    "만료된 토큰입니다."
            );

        } catch (Exception e) {
            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "AUTH401_3",
                    "유효하지 않은 토큰입니다."
            );
        }
    }
}