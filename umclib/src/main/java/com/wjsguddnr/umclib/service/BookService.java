package com.wjsguddnr.umclib.service;

import com.wjsguddnr.umclib.domain.Book;
import com.wjsguddnr.umclib.domain.Category;
import com.wjsguddnr.umclib.dto.BookResponse;
import com.wjsguddnr.umclib.dto.CreateBookRequest;
import com.wjsguddnr.umclib.repository.BookRepository;
import com.wjsguddnr.umclib.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service // 비즈니스 로직을 수행하는 메인 셰프 계층
public class BookService {

    // 창고지기(Repository)를 생성자 주입으로 데려옵니다.
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public BookService(BookRepository bookRepository, CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<BookResponse> getAllBooks() {
        // bookId 내림차순으로 Book 엔티티를 조회한다.
        List<Book> books = bookRepository.findAllByOrderByBookIdDesc();
        List<BookResponse> responses = new ArrayList<>();

        // 각 Book 엔티티를 외부에 반환할 BookResponse DTO로 변환한다.
        for (Book book : books) {
            responses.add(BookResponse.from(book));
        }

        return responses;
    }

    // Book의 Category 관계는 기본적으로 LAZY지만 Repository의 @EntityGraph가 이번 조회에서는 Category도 함께 가져온다.
    // readOnly=true는 엔티티 조회와 DTO 변환을 하나의 읽기 전용 트랜잭션 안에서 수행한다는 뜻이다.
    @Transactional(readOnly = true)
    public List<BookResponse> getBooksByCategoryId(Long categoryId) {
        List<Book> books = bookRepository.findAllByCategoryCategoryId(categoryId);
        List<BookResponse> responses = new ArrayList<>();

        for (Book book : books) {
            responses.add(BookResponse.from(book));
        }

        return responses;
    }

    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        // 요청으로 받은 categoryId가 실제 DB에 존재하는지 먼저 검사한다.
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "존재하지 않는 카테고리입니다. categoryId=" + request.getCategoryId()
                ));

        // 검증된 Category와 요청 DTO의 값으로 Book 엔티티를 생성해 저장한다.
        Book book = new Book(category, request.getTitle(), request.getDescription());
        Book savedBook = bookRepository.save(book);

        return BookResponse.from(savedBook);
    }
}
