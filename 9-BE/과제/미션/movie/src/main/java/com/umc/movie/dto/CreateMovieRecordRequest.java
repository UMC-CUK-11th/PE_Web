package com.umc.movie.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CreateMovieRecordRequest(
        @Schema(description = "TMDB 영화 ID", example = "238")
        @NotNull(message = "영화 ID는 필수입니다.")
        @Positive(message = "영화 ID는 양수여야 합니다.")
        Long movieId,
        @Schema(description = "1점부터 5점까지의 별점", example = "5")
        @NotNull(message = "별점은 필수입니다.")
        @Min(value = 1, message = "별점은 1점 이상이어야 합니다.")
        @Max(value = 5, message = "별점은 5점 이하여야 합니다.")
        Integer score,
        @Schema(description = "500자 이하의 한 줄 후기, 비워도 된다", example = "가족 영화의 교과서")
        @Size(max = 500, message = "후기는 500자 이하로 입력해주세요.")
        String comment,
        @Schema(description = "true면 즐겨찾기도 함께 저장한다", example = "true")
        @NotNull(message = "즐겨찾기 추가 여부는 필수입니다.")
        Boolean addToFavorites
) {}
