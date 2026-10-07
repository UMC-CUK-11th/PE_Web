package com.umc.study.service;

import com.umc.study.domain.Book;
import com.umc.study.domain.Category;
import com.umc.study.dto.book.BookResponse;
import com.umc.study.dto.book.CreateBookRequest;
import com.umc.study.exception.CategoryNotFoundException;
import com.umc.study.exception.DuplicateBookTitleException;
import com.umc.study.repository.BookRepository;
import com.umc.study.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * 실제 DB 대신 가짜 Repository를 사용해 BookService의 분기와 업무 규칙만 빠르게 검증합니다.
 */
@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private BookService bookService;

    @Test
    void keyword가_없으면_전체_도서를_최신순_메서드로_조회한다() {
        Category category = new Category("소설");
        when(bookRepository.findAllByOrderByBookIdDesc())
                .thenReturn(List.of(new Book(category, "달빛 도서관", "소설")));

        List<BookResponse> responses = bookService.getBooks(null);

        assertThat(responses).hasSize(1);
        assertThat(responses.getFirst().categoryName()).isEqualTo("소설");
        verify(bookRepository).findAllByOrderByBookIdDesc();
    }

    @Test
    void keyword의_앞뒤_공백을_제거하고_제목을_검색한다() {
        when(bookRepository.findAllByTitleContainingOrderByBookIdDesc("스프링"))
                .thenReturn(List.of());

        bookService.getBooks("  스프링  ");

        verify(bookRepository).findAllByTitleContainingOrderByBookIdDesc("스프링");
    }

    @Test
    void 존재하는_카테고리로_도서를_저장한다() {
        Category category = new Category("개발");
        CreateBookRequest request = new CreateBookRequest(1L, "  스프링 입문  ", "JPA 기초");
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(bookRepository.existsByTitle("스프링 입문")).thenReturn(false);
        when(bookRepository.saveAndFlush(org.mockito.ArgumentMatchers.any(Book.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        BookResponse response = bookService.createBook(request);

        assertThat(response.title()).isEqualTo("스프링 입문");
        assertThat(response.categoryName()).isEqualTo("개발");
        assertThat(response.isAvailable()).isTrue();
    }

    @Test
    void 없는_카테고리면_저장하지_않는다() {
        CreateBookRequest request = new CreateBookRequest(999L, "없는 카테고리", null);
        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookService.createBook(request))
                .isInstanceOf(CategoryNotFoundException.class);
        verify(bookRepository, never()).saveAndFlush(org.mockito.ArgumentMatchers.any(Book.class));
    }

    @Test
    void 같은_제목이_있으면_저장하지_않는다() {
        Category category = new Category("개발");
        CreateBookRequest request = new CreateBookRequest(1L, "클린 코드", null);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(bookRepository.existsByTitle("클린 코드")).thenReturn(true);

        assertThatThrownBy(() -> bookService.createBook(request))
                .isInstanceOf(DuplicateBookTitleException.class);
        verify(bookRepository, never()).saveAndFlush(org.mockito.ArgumentMatchers.any(Book.class));
    }
}
