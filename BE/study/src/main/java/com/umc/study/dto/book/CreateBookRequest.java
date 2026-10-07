package com.umc.study.dto.book;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * POST /books의 요청 형식을 정의합니다.
 * Entity와 분리해 DB 구조를 노출하지 않고, Controller 진입 시 잘못된 입력을 차단합니다.
 */
public record CreateBookRequest(
        @NotNull(message = "카테고리 ID는 필수입니다.")
        @Positive(message = "카테고리 ID는 양수여야 합니다.")
        Long categoryId,

        @NotBlank(message = "제목은 비어 있을 수 없습니다.")
        @Size(max = 100, message = "제목은 100자 이하여야 합니다.")
        String title,

        String description
) {
}
