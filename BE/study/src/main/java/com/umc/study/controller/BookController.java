package com.umc.study.controller;

import com.umc.study.service.BookService;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable; // 필수미션에서 사용
import java.util.List;
import java.util.Map;
import com.umc.study.dto.BookResponse;
import com.umc.study.dto.CreateBookRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    // GET http://localhost:8080/books
    @GetMapping
    public List<BookResponse> getBooks() {
        return bookService.getBooks();
    }

    // POST http://localhost:8080/books
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookResponse createBook(
            @Valid @RequestBody CreateBookRequest request
    ) {
        return bookService.createBook(request);
    }

    // 필수미션1
    // GET http://localhost:8080/books/category/1
    @GetMapping("/category/{categoryId}")
    public List<Map<String, Object>> getBooksByCategoryId(
            @PathVariable("categoryId") Integer categoryId
    ) {
        return bookService.getBooksByCategoryId(categoryId);
    }


}