package com.umc.study.controller;

import com.umc.study.dto.book.BookResponse;
import com.umc.study.dto.book.CreateBookRequest;
import com.umc.study.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * /books HTTP 요청과 응답을 담당합니다.
 * 입력 검증 후 Service에 업무를 맡기고 Entity가 아닌 Response DTO만 외부에 반환합니다.
 */
@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public List<BookResponse> getBooks(@RequestParam(required = false) String keyword) {
        return bookService.getBooks(keyword);
    }

    // 3주차에 만든 추가 기능도 삭제하지 않고 ORM과 DTO 방식으로 유지합니다.
    @GetMapping("/category/{categoryId}")
    public List<BookResponse> getBooksByCategory(@PathVariable Long categoryId) {
        return bookService.getBooksByCategoryId(categoryId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookResponse createBook(@Valid @RequestBody CreateBookRequest request) {
        return bookService.createBook(request);
    }
}
