package com.umc.movie.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

@Schema(description = "내 정보 수정 요청")
public record UpdateMemberRequest(
    @Schema(description = "바꿀 닉네임 (2~12자, 다른 회원과 중복 불가)", example = "영화덕후")
        @NotBlank @Size(min = 2, max = 12) String nickname) {}
