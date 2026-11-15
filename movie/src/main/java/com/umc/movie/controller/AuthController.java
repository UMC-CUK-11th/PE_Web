package com.umc.movie.controller;

import com.umc.movie.dto.auth.LoginRequest;
import com.umc.movie.dto.common.ApiResponse;
import com.umc.movie.dto.auth.LoginResponse;
import com.umc.movie.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login") // [1]
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @RequestBody @Valid LoginRequest request // [2]
    ) {
        LoginResponse response = authService.login(request); // [3]
        return ResponseEntity.ok(ApiResponse.ok("로그인에 성공했습니다.", response)); // [4]
    }
}

/*
 * [1] 클래스의 /auth와 메서드의 /login을 합쳐 POST /auth/login 요청을 받는다.
 * @RequiredArgsConstructor가 생성자를 만들고 Spring이 AuthService Bean을 주입한다.
 *
 * [2] @RequestBody는 JSON을 LoginRequest로 변환하고 @Valid는 DTO의 검증 조건을 검사한다.
 * 검증 실패 시 서비스 호출 전에 예외가 발생하고 기존 전역 핸들러가 공통 실패 응답으로 바꾼다.
 *
 * [3] 서비스가 회원 조회·비밀번호 비교·토큰 발급을 수행하고 닉네임·토큰 DTO를 반환한다.
 * 서비스가 예외를 던지면 성공 응답으로 진행하지 않고 전역 예외 처리기로 전달된다.
 *
 * [4] 안쪽 ApiResponse.ok는 COMMON200·메시지·result를 담은 공통 본문을 만든다.
 * 바깥 ResponseEntity.ok는 그 본문을 실제 HTTP 200으로 반환한다.
 * ApiResponse<LoginResponse>의 result에는 LoginResponse가 들어간다.
 */
