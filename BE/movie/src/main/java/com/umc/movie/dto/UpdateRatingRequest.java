package com.umc.movie.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

public record UpdateRatingRequest(
        @Schema(description = "별점 (1~5)", example = "4")
        @NotNull(message = "별점을 입력해주세요.")
        @Min(value = 1, message = "별점은 1점 이상이어야 합니다.")
        @Max(value = 5, message = "별점은 5점 이하여야 합니다.") Integer score,
        @Schema(description = "수정한 후기 (최대 500자)", example = "두 번째 감상")
        @Size(max = 500, message = "후기는 500자 이하로 입력해주세요.") String comment
) {}
