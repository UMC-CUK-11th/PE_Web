package com.wjsguddnr.umclib.dto;

import com.wjsguddnr.umclib.domain.Book;
import lombok.AllArgsConstructor;
import lombok.Getter;

// GET /books 응답에 필요한 값만 담는 응답 DTO다.
// 엔티티를 그대로 반환하지 않아 DB 구조와 API 응답 구조를 분리할 수 있다.
@Getter
@AllArgsConstructor
public class BookResponse {
    private Long bookId;

    private String title;

    private String description;

    private String categoryName;

    private Boolean isAvailable;

    // Book 엔티티 한 개를 API 응답용 BookResponse 한 개로 변환한다.
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
