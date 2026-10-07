package com.umc.umc11th_workbook.domain.book.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public class BookReqDto {
  public record CreateBookRequest(
      @NotEmpty(message = "최소 1개 이상의 카테고리를 선택해야 합니다.")
      List<Long> categoryIds,

      @NotBlank(message = "책 제목은 필수 입력값입니다.")
      @Size(max = 100, message = "책 제목은 100자를 초과할 수 없습니다.")
      String title,

      String description
  ) {}

  public record RentBookRequest(
      @NotNull(message = "책 ID는 필수 입력값입니다.")
      Long bookId
  ) {}
}
