package com.umc.study.repository;

import com.umc.study.domain.Book;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Book Entity의 조회와 저장을 담당하는 DB 창구입니다.
 * JpaRepository가 기본 CRUD SQL을 생성하고, 메서드 이름으로 추가 조회 조건을 표현합니다.
 */
public interface BookRepository extends JpaRepository<Book, Long> {

    // 응답 변환에서 categoryName을 사용하므로 Category를 같은 조회 흐름에서 함께 가져옵니다.
    @EntityGraph(attributePaths = "category")
    List<Book> findAllByOrderByBookIdDesc();

    @EntityGraph(attributePaths = "category")
    List<Book> findAllByTitleContainingOrderByBookIdDesc(String keyword);

    @EntityGraph(attributePaths = "category")
    List<Book> findAllByCategory_CategoryIdOrderByBookIdDesc(Long categoryId);

    boolean existsByTitle(String title);
}
