package com.umc.study.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

// 4: 카테고리 ID는 필수 양수, 제목은 비어 있지 않고 100자 이하.
public record CreateBookRequest(
    @NotNull @Positive Long categoryId,
    @NotBlank @Size(max = 100) String title,
    String description
) {}
