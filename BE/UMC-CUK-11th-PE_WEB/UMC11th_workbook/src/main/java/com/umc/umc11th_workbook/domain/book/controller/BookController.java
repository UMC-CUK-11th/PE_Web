package com.umc.umc11th_workbook.domain.book.controller;

import com.umc.umc11th_workbook.domain.book.dto.request.BookReqDto;
import com.umc.umc11th_workbook.domain.book.dto.request.BookReqDto.CreateBookRequest;
import com.umc.umc11th_workbook.domain.book.dto.response.BookResDto.BookResponse;
import com.umc.umc11th_workbook.domain.book.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

@RestController // 1. "나는 데이터를 JSON으로 서빙하는 API 카운터야!"
@RequestMapping("/books") // 2. 이 컨트롤러로 들어오는 요청의 기본 주소는 /books
@RequiredArgsConstructor
public class BookController {

  // 주방장(Service)을 주입받아 카운터 옆에 대기시킵니다.
  private final BookService bookService;

  // HTTP GET 방식으로 /books 요청이 들어왔을 때 이 메서드가 실행됩니다.
  @GetMapping
  public List<BookResponse> getBooks() {
    return bookService.getAllBooks();
  }

  @GetMapping("/category/{categoryId}")
  public List<BookResponse> getBooksByCategory(@PathVariable("categoryId") Long categoryId) {
    return bookService.getBooksByCategory(categoryId);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public BookResponse createBook(@Valid @RequestBody CreateBookRequest request) {
    return bookService.createBook(request);
  }

  @PostMapping("/rentals")
  public String rentBook(@Valid @RequestBody BookReqDto.RentBookRequest body) {
    // 여기에 도서 대여 로직을 구현합니다.
    bookService.rentBook(body);
    return "도서 대여가 완료되었습니다!";
  }
}