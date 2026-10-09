package com.umc.study.dto.book;

import com.umc.study.domain.Book;

/**
 * 도서 API의 응답 형식입니다.
 * Entity 대신 필요한 값만 골라 반환해 DB 컬럼과 API 계약을 분리합니다.
 */
public record BookResponse(
        Long bookId,
        String title,
        String description,
        String categoryName,
        Boolean isAvailable
) {

    public static BookResponse from(Book book) {
        return new BookResponse(
                book.getBookId(),
                book.getTitle(),
                book.getDescription(),
                book.getCategory().getName(),
                book.getIsAvailable()
        );
    }
}
