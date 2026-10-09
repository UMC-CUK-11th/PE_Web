package com.umc.study.service;

import com.umc.study.domain.Book;
import com.umc.study.domain.Category;
import com.umc.study.dto.book.BookResponse;
import com.umc.study.dto.book.CreateBookRequest;
import com.umc.study.exception.CategoryNotFoundException;
import com.umc.study.exception.DuplicateBookTitleException;
import com.umc.study.repository.BookRepository;
import com.umc.study.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 도서 조회·등록의 업무 규칙을 담당합니다.
 * Controller는 HTTP 처리에 집중하고, DB 작업 순서와 Entity→DTO 변환은 여기에서 수행합니다.
 */
@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<BookResponse> getBooks(String keyword) {
        String normalizedKeyword = keyword == null ? "" : keyword.trim();

        List<Book> books = normalizedKeyword.isEmpty()
                ? bookRepository.findAllByOrderByBookIdDesc()
                : bookRepository.findAllByTitleContainingOrderByBookIdDesc(normalizedKeyword);

        return books.stream()
                .map(BookResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookResponse> getBooksByCategoryId(Long categoryId) {
        return bookRepository.findAllByCategory_CategoryIdOrderByBookIdDesc(categoryId).stream()
                .map(BookResponse::from)
                .toList();
    }

    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(request.categoryId()));

        String title = request.title();
        if (bookRepository.existsByTitle(title)) {
            throw new DuplicateBookTitleException(title);
        }

        Book book = new Book(category, title, request.description());

        try {
            // saveAndFlush로 INSERT를 이 지점에서 실행해 DB UNIQUE 위반도 409로 바꿀 수 있습니다.
            return BookResponse.from(bookRepository.saveAndFlush(book));
        } catch (DataIntegrityViolationException exception) {
            throw new DuplicateBookTitleException(title, exception);
        }
    }
}
