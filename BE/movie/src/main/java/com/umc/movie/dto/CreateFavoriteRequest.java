package com.umc.movie.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Schema(description = "즐겨찾기 등록 요청")
public record CreateFavoriteRequest(
    @Schema(description = "즐겨찾기할 영화 ID (TMDB 영화 ID, 양수)", example = "550")
        @NotNull(message = "영화 ID는 필수입니다.") @Positive(message = "영화 ID는 양수여야 합니다.") Long movieId) {}
