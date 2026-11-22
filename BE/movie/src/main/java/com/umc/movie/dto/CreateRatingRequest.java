package com.umc.movie.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

@Schema(description = "평점 등록 요청")
public record CreateRatingRequest(
    @Schema(description = "평점을 남길 영화 ID (TMDB 영화 ID, 양수)", example = "550")
        @NotNull @Positive Long movieId,
    @Schema(description = "평점 (1~5점)", example = "5", minimum = "1", maximum = "5")
        @NotNull @Min(1) @Max(5) Integer score,
    @Schema(description = "한줄평 (선택, 최대 500자)", example = "인생 영화예요!", maxLength = 500)
        @Size(max = 500) String comment) {}
