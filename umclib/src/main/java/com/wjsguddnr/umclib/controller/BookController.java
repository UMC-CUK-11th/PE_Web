package com.wjsguddnr.umclib.controller;

import com.wjsguddnr.umclib.dto.BookResponse;
import com.wjsguddnr.umclib.dto.CreateBookRequest;
import com.wjsguddnr.umclib.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController // 1. "나는 데이터를 JSON으로 서빙하는 API 카운터야!"
@RequestMapping("/books") // 2. 이 컨트롤러로 들어오는 요청의 기본 주소는 /books
public class BookController {

    // 주방장(Service)을 주입받아 카운터 옆에 대기시킵니다.
    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // 3. HTTP GET 방식으로 /books 요청이 들어왔을 때 이 메서드가 실행됩니다.
    @GetMapping
    public ResponseEntity<List<BookResponse>> getBooks() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(bookService.getAllBooks());
    }

    @GetMapping(value = "/category/{categoryId}")
    public List<BookResponse> getBooksByCategoryId(@PathVariable Long categoryId) {
        return bookService.getBooksByCategoryId(categoryId);
    }

    @PostMapping
    public ResponseEntity<BookResponse> createBook(
            @Valid @RequestBody CreateBookRequest request
    ) {
        BookResponse response = bookService.createBook(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
