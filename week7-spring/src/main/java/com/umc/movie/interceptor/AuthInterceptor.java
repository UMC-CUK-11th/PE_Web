package com.umc.movie.interceptor;

import com.umc.movie.exception.ApiException;
import com.umc.movie.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler
    ) {
        String authorization = request.getHeader("Authorization");

        if (authorization == null ||
                !authorization.startsWith("Bearer ")) {
            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "AUTH401_2",
                    "인증 토큰이 필요합니다."
            );
        }

        String token = authorization.substring(7);
        Long memberId = jwtUtil.getMemberId(token);

        request.setAttribute("memberId", memberId);

        return true;
    }
}