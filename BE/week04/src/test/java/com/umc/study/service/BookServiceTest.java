package com.umc.study.service;

import com.umc.study.dto.BookResponse;
import com.umc.study.dto.CreateBookRequest;
import com.umc.study.entity.Book;
import com.umc.study.entity.Category;
import com.umc.study.exception.CategoryNotFoundException;
import com.umc.study.repository.BookRepository;
import com.umc.study.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private BookService bookService;

    @Test
    void getBooksReturnsResponseDtosInRepositoryOrder() {
        Category category = category(1L, "개발");
        Book newest = book(2L, category, "JPA 실전", "최신 도서");
        Book older = book(1L, category, "스프링 입문", "기존 도서");
        given(bookRepository.findAllByOrderByBookIdDesc()).willReturn(List.of(newest, older));

        List<BookResponse> result = bookService.getBooks();

        assertThat(result).extracting(BookResponse::bookId).containsExactly(2L, 1L);
        assertThat(result.getFirst().categoryName()).isEqualTo("개발");
        verify(bookRepository).findAllByOrderByBookIdDesc();
    }

    @Test
    void createBookSavesBookWhenCategoryExists() {
        Category category = category(1L, "개발");
        CreateBookRequest request = new CreateBookRequest(1L, "ORM 첫걸음", "JPA 도서");
        given(categoryRepository.findById(1L)).willReturn(Optional.of(category));
        given(bookRepository.save(any(Book.class))).willAnswer(invocation -> {
            Book saved = invocation.getArgument(0);
            ReflectionTestUtils.setField(saved, "bookId", 3L);
            return saved;
        });

        BookResponse result = bookService.createBook(request);

        assertThat(result.bookId()).isEqualTo(3L);
        assertThat(result.title()).isEqualTo("ORM 첫걸음");
        assertThat(result.categoryName()).isEqualTo("개발");
        assertThat(result.isAvailable()).isTrue();
        verify(bookRepository).save(any(Book.class));
    }

    @Test
    void createBookThrowsWhenCategoryDoesNotExist() {
        CreateBookRequest request = new CreateBookRequest(999L, "없는 카테고리", null);
        given(categoryRepository.findById(999L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> bookService.createBook(request))
                .isInstanceOf(CategoryNotFoundException.class)
                .hasMessageContaining("categoryId=999");
    }

    private Category category(Long id, String name) {
        Category category = new Category(name);
        ReflectionTestUtils.setField(category, "categoryId", id);
        return category;
    }

    private Book book(Long id, Category category, String title, String description) {
        Book book = new Book(category, title, description);
        ReflectionTestUtils.setField(book, "bookId", id);
        return book;
    }
}
