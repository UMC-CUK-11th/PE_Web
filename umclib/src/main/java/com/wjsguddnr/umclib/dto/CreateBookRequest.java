package com.wjsguddnr.umclib.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

// POST /books 요청 본문을 받는 요청 DTO다.
// @Valid와 함께 사용하면 저장 로직 실행 전에 입력값을 검증한다.
@Getter
public class CreateBookRequest{
        @NotNull(message = "categoryId는 필수입니다.")
        @Positive(message = "categoryId는 양수여야 합니다.")
        Long categoryId;

        @NotBlank(message = "title은 필수입니다.")
        @Size(max = 100, message = "title은 100자 이하여야 합니다.")
        String title;

        String description;
}
