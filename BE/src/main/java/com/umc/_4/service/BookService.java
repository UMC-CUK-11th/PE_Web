package com.umc._4.service;

import com.umc._4.dto.BookResponse;
import com.umc._4.dto.CreateBookRequest;
import com.umc._4.entity.Book;
import com.umc._4.entity.Category;
import com.umc._4.repository.BookRepository;
import com.umc._4.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    // GET /books
    @Transactional(readOnly = true)
    public List<BookResponse> getBooks() {
        return bookRepository.findAllByOrderByBookIdDesc()
                .stream()
                .map(BookResponse::from)
                .toList();
    }

    // POST /books
    @Transactional
    public BookResponse createBook(CreateBookRequest request) {

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() ->
                        new IllegalArgumentException("존재하지 않는 카테고리입니다."));

        Book book = new Book(
                category,
                request.title(),
                request.description()
        );

        Book savedBook = bookRepository.save(book);

        return BookResponse.from(savedBook);
    }
}