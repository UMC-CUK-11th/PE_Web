package com.umc.movie.controller;

import com.umc.movie.dto.*;
import com.umc.movie.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;      // 추가
import io.swagger.v3.oas.annotations.tags.Tag;       // 추가
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "인증", description = "로그인과 토큰 발급 API")      // 추가
public class AuthController {
  private final MemberService memberService;

  @Operation(                                                     // 추가
          summary = "이메일 로그인",
          description = """
          이메일과 비밀번호로 로그인하고 Access Token을 발급받습니다.
          발급받은 토큰은 위쪽 Authorize 버튼에 넣어두면 인증이 필요한 API에 자동으로 실립니다.
          """)
  @PostMapping("/auth/login")
  public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
    return ApiResponse.ok("로그인에 성공했습니다.", memberService.login(request));
  }
}