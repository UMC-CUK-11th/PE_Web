package com.umc.study.controller;

import com.umc.study.dto.BookResponse;
import com.umc.study.dto.CreateBookRequest;
import com.umc.study.exception.CategoryNotFoundException;
import com.umc.study.exception.GlobalExceptionHandler;
import com.umc.study.service.BookService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class BookControllerTest {

    private BookService bookService;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        bookService = mock(BookService.class);
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();

        mockMvc = MockMvcBuilders.standaloneSetup(new BookController(bookService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .setValidator(validator)
                .build();
    }

    @Test
    void getBooksReturnsResponseDtos() throws Exception {
        given(bookService.getBooks()).willReturn(List.of(
                new BookResponse(2L, "JPA 실전", "최신 도서", "개발", true),
                new BookResponse(1L, "스프링 입문", "기존 도서", "개발", true)
        ));

        mockMvc.perform(get("/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].bookId").value(2))
                .andExpect(jsonPath("$[0].categoryName").value("개발"));
    }

    @Test
    void createBookReturnsCreated() throws Exception {
        given(bookService.createBook(any(CreateBookRequest.class)))
                .willReturn(new BookResponse(3L, "ORM 첫걸음", "JPA 도서", "개발", true));

        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": 1,
                                  "title": "ORM 첫걸음",
                                  "description": "JPA 도서"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookId").value(3))
                .andExpect(jsonPath("$.title").value("ORM 첫걸음"));
    }

    @Test
    void createBookRejectsBlankTitle() throws Exception {
        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": 1,
                                  "title": " ",
                                  "description": "잘못된 요청"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors.title").value("제목은 필수입니다."));
    }

    @Test
    void createBookReturnsNotFoundForUnknownCategory() throws Exception {
        given(bookService.createBook(any(CreateBookRequest.class)))
                .willThrow(new CategoryNotFoundException(999L));

        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": 999,
                                  "title": "없는 카테고리",
                                  "description": null
                                }
                                """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("존재하지 않는 카테고리입니다. categoryId=999"));
    }
}
