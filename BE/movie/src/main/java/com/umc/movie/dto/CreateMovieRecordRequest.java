package com.umc.movie.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

public record CreateMovieRecordRequest(
        @Schema(description = "양수 TMDB 영화 ID", example = "550")
        @NotNull @Positive Long movieId,
        @Schema(description = "별점 (1~5)", example = "5")
        @NotNull @Min(1) @Max(5) Integer score,
        @Schema(description = "후기 (최대 500자)", example = "다시 보고 싶은 영화")
        @Size(max = 500) String comment,
        @Schema(description = "즐겨찾기도 함께 등록할지 여부", example = "true")
        @NotNull Boolean addToFavorites
) {}