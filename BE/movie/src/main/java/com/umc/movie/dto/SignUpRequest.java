package com.umc.movie.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

@Schema(description = "회원가입 요청")
public record SignUpRequest(
    @Schema(description = "이메일 (최대 254자)", example = "umc@example.com")
        @NotBlank @Email @Size(max = 254) String email,
    @Schema(description = "비밀번호 (영문 대/소문자, 숫자, 특수문자 포함 8~72자)", example = "Umc!1234")
        @NotBlank @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,72}$")
        String password,
    @Schema(description = "닉네임 (2~12자)", example = "유엠씨")
        @NotBlank @Size(min = 2, max = 12) String nickname) {}
