package com.umc11th.controller;

import com.umc11th.dto.ApiResponse;
import com.umc11th.dto.LoginRequest;
import com.umc11th.dto.LoginResponse;
import com.umc11th.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "인증", description = "로그인과 토큰 발급 API")
public class AuthController {

    private final AuthService authService;

    @Operation(
            summary = "이메일 로그인",
            description = "이메일과 비밀번호를 확인하고 인증 API에서 사용할 Access Token을 발급합니다."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200", description = "COMMON200 - 로그인 성공"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401", description = "AUTH401_1 - 이메일 또는 비밀번호 불일치"
    )
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @RequestBody @Valid LoginRequest request
    ) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("로그인에 성공했습니다.", response));
    }
}
