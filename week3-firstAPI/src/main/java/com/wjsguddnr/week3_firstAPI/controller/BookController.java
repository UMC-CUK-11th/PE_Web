package com.wjsguddnr.week3_firstAPI.controller;

import org.springframework.web.bind.annotation.*;
import com.wjsguddnr.week3_firstAPI.service.BookService;

import java.util.List;
import java.util.Map;

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
    public List<Map<String, Object>> getBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping(value = "/category/{categoryId}")
    public List<Map<String, Object>> getBooksByCategoryId(@PathVariable Long categoryId) {
        return bookService.getBooksByCategoryId(categoryId);
    }

    @PostMapping
    public String createBook(@RequestBody Map<String, Object> body){
        bookService.createBook(body);
        return "도서 등록이 완료되었습니다!";
    }
}
