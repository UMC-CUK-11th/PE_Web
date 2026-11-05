package com.umc.movie.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record UpdateRatingRequest(
        @NotNull(message = "별점을 입력해주세요.")
        @Min(value = 1, message = "별점은 1점 이상이어야 합니다.")
        @Max(value = 5, message = "별점은 5점 이하여야 합니다.")
        @Digits(integer = 1, fraction = 0, message = "별점은 1부터 5까지의 정수여야 합니다.")
        BigDecimal score,
        @Size(max = 500, message = "후기는 500자 이하로 입력해주세요.")
        String comment
) {}
