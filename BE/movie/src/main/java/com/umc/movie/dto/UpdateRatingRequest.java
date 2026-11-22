package com.umc.movie.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

@Schema(description = "평점 수정 요청")
public record UpdateRatingRequest(
    @Schema(description = "수정할 평점 (1~5점)", example = "4", minimum = "1", maximum = "5")
        @NotNull @Min(1) @Max(5) Integer score,
    @Schema(description = "수정할 한줄평 (선택, 최대 500자)", example = "다시 보니 조금 아쉬웠어요.", maxLength = 500)
        @Size(max = 500) String comment) {}
