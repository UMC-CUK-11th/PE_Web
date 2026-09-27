package com.umc.umc11th_workbook.domain.book.service;

import com.umc.umc11th_workbook.domain.book.dto.request.BookReqDto;
import com.umc.umc11th_workbook.domain.book.dto.request.BookReqDto.CreateBookRequest;
import com.umc.umc11th_workbook.domain.book.dto.request.BookReqDto.RentBookRequest;
import com.umc.umc11th_workbook.domain.book.dto.response.BookResDto.BookResponse;
import com.umc.umc11th_workbook.domain.book.entity.Book;
import com.umc.umc11th_workbook.domain.book.entity.BookCategory;
import com.umc.umc11th_workbook.domain.book.repository.BookCategoryRepository;
import com.umc.umc11th_workbook.domain.book.repository.BookRepository;
import com.umc.umc11th_workbook.domain.category.entity.Category;
import com.umc.umc11th_workbook.domain.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service // 비즈니스 로직을 수행하는 메인 셰프 계층
@RequiredArgsConstructor
public class BookService {

  // 창고지기(Repository)를 생성자 주입으로 데려옵니다.
  private final BookRepository bookRepository;
  private final CategoryRepository categoryRepository;

  @Transactional(readOnly = true)
  public List<BookResponse> getBooks() {
    return bookRepository.findAllByOrderByBookIdDesc().stream()
        .map(BookResponse::from)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<BookResponse> getAllBooks() {
    // 지금은 별도 가공 없이 창고지기가 가져온 도서 목록을 그대로 반환합니다.
    return bookRepository.findAll().stream()
        .map(BookResponse::from)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<BookResponse> getBooksByCategory(Long categoryId) {
    // 카테고리별 도서 목록을 가져오는 로직을 구현합니다.
    // 현재는 단순히 모든 도서를 반환하지만, 실제로는 categoryId를 활용하여 필터링해야 합니다.
    return bookRepository.findByBookCategories_Category_CategoryId(categoryId).stream() // 이 부분은 실제 구현에 맞게 수정 필요
        .map(BookResponse::from)
        .toList();
  }

  @Transactional
  public BookResponse createBook(CreateBookRequest request) {
    Book newBook = Book.builder()
        .title(request.title())
        .description(request.description())
        // categoryIds(List<Long>) 처리는 매핑 테이블 저장 로직에서 다루어야 합니다.
        .build();

    // 프론트엔드에서 넘어온 카테고리 ID 리스트(categoryIds)로 실제 Category 객체들을 DB에서 일괄 조회
    List<Category> categories = categoryRepository.findAllById(request.categoryIds());

    // (검증) 요청한 ID 개수와 DB에서 찾은 카테고리 개수가 다르면, 존재하지 않는 ID가 섞여 있다는 뜻입니다.
    if (categories.size() != request.categoryIds().size()) {
      throw new IllegalArgumentException("존재하지 않는 카테고리 ID가 포함되어 있습니다.");
    }

    // (처리) 조회한 Category들을 순회하며 중간 매핑 객체(BookCategory)를 생성하고 Book에 연결
    for (Category category : categories) {
      BookCategory bookCategory = new BookCategory(newBook, category);
      newBook.addBookCategory(bookCategory);
      // 💡 Book 내부의 bookCategories 리스트에 데이터가 담깁니다.
    }
    return BookResponse.from(bookRepository.save(newBook));
  }

  @Transactional
  public void rentBook(RentBookRequest request) { // 대여 로직은 식별자(ID)만 받도록 수정
    Book book = bookRepository.findById(request.bookId())
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 도서입니다."));


    // 도서 대여 상태 업데이트 로직 작성 (예: book.rent())
  }
}