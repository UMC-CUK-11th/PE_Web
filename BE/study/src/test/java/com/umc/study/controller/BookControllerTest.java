package com.umc.study.controller;

import com.umc.study.dto.book.BookResponse;
import com.umc.study.dto.book.CreateBookRequest;
import com.umc.study.exception.CategoryNotFoundException;
import com.umc.study.exception.DuplicateBookTitleException;
import com.umc.study.service.BookService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 서버 전체를 띄우지 않고 /books의 요청 검증, 상태 코드, JSON 응답 계약을 확인합니다.
 */
@WebMvcTest(BookController.class)
class BookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BookService bookService;

    @Test
    void 전체_도서를_DTO로_조회한다() throws Exception {
        BookResponse response = new BookResponse(5L, "스프링 입문", "JPA 기초", "개발", true);
        when(bookService.getBooks(null)).thenReturn(List.of(response));

        mockMvc.perform(get("/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].bookId").value(5))
                .andExpect(jsonPath("$[0].categoryName").value("개발"));
    }

    @Test
    void keyword를_Service에_전달한다() throws Exception {
        when(bookService.getBooks("스프링")).thenReturn(List.of());

        mockMvc.perform(get("/books").param("keyword", "스프링"))
                .andExpect(status().isOk());
    }

    @Test
    void 정상_도서_등록은_201을_반환한다() throws Exception {
        BookResponse response = new BookResponse(6L, "스프링 입문", "JPA 기초", "개발", true);
        when(bookService.createBook(any(CreateBookRequest.class))).thenReturn(response);

        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": 1,
                                  "title": "스프링 입문",
                                  "description": "JPA 기초"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookId").value(6))
                .andExpect(jsonPath("$.isAvailable").value(true));
    }

    @Test
    void 빈_제목은_400을_반환한다() throws Exception {
        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": 1,
                                  "title": "   ",
                                  "description": null
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("INVALID_REQUEST"))
                .andExpect(jsonPath("$.fieldErrors.title").exists());
    }

    @Test
    void 없는_카테고리는_404를_반환한다() throws Exception {
        when(bookService.createBook(any(CreateBookRequest.class)))
                .thenThrow(new CategoryNotFoundException(999L));

        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": 999,
                                  "title": "없는 카테고리 도서",
                                  "description": null
                                }
                                """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("CATEGORY_NOT_FOUND"));
    }

    @Test
    void 중복_제목은_409를_반환한다() throws Exception {
        when(bookService.createBook(any(CreateBookRequest.class)))
                .thenThrow(new DuplicateBookTitleException("클린 코드"));

        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": 1,
                                  "title": "클린 코드",
                                  "description": null
                                }
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("DUPLICATE_BOOK_TITLE"));
    }
}
