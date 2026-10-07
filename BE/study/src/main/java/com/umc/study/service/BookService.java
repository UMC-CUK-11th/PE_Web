package com.umc.study.service;

import com.umc.study.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import com.umc.study.dto.BookResponse;
import com.umc.study.repository.BookJpaRepository;
import org.springframework.transaction.annotation.Transactional;
import com.umc.study.dto.CreateBookRequest;
import com.umc.study.entity.Book;
import com.umc.study.entity.Category;
import com.umc.study.repository.CategoryRepository;

@Service //비즈니스 로직을 수행하는 메인 셰프 계층
@RequiredArgsConstructor
public class BookService {

    //창고지기(Repository)를 생성자 주입으로 데려옵니다.
    private final BookRepository bookRepository;
    private final BookJpaRepository bookJpaRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<BookResponse> getBooks() {
        return bookJpaRepository.findAllByOrderByBookIdDesc()
                .stream()
                .map(BookResponse::from)
                .toList();
    }

    //필수미션1
    public List<Map<String, Object>> getBooksByCategoryId(Integer categoryId) {
        return bookRepository.findByCategoryId(categoryId);
    }

    //필수미션2
    public void createRental(Map<String, Object> body) {
        bookRepository.rentalSave(body);
    }


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

        return BookResponse.from(bookJpaRepository.save(book));
    }
}
