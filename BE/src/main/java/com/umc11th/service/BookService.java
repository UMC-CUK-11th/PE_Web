package com.umc11th.service;

import com.umc11th.dto.CreateBookRequest;
import com.umc11th.dto.BookResponse;
import com.umc11th.repository.BookJdbcRepository;
import com.umc11th.repository.BookRepository;
import com.umc11th.repository.CategoryRepository;
import com.umc11th.entity.Book;
import com.umc11th.entity.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service // 비즈니스 로직을 수행하는 메인 셰프 계층
@RequiredArgsConstructor
public class BookService {

    // 창고지기(Repository)를 생성자 주입으로 데려옵니다.
    private final BookRepository bookRepository;
    private final BookJdbcRepository bookJdbcRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<BookResponse> getBooks() {
        return bookRepository.findAllByOrderByBookIdDesc().stream()
                .map(BookResponse::from)
                .toList();
    }

    public List<Map<String, Object>> getBooksByCategory(Long categoryId) {
        return bookJdbcRepository.findByCategoryId(categoryId);
    }

    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));

        Book book = new Book(category, request.title(), request.description());
        return BookResponse.from(bookRepository.save(book));
    }
}
