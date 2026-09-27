package com.umc.umc11th_workbook.domain.book.dto.response;

import com.umc.umc11th_workbook.domain.book.entity.Book;

public class BookResDto {
  public record BookResponse(
      Long bookId,
      String title,
      String description,
      Boolean isAvailable
  ) {
    public static BookResponse from(Book book) {
      return new BookResponse(
          book.getBookId(),
          book.getTitle(),
          book.getDescription(),
          book.getIsAvailable()
      );
    }
  }
}
