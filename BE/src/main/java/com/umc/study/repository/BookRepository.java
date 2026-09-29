package com.umc.study.repository;

import com.umc.study.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    @Query("""
            SELECT b
            FROM Book b
            JOIN FETCH b.category
            ORDER BY b.bookId DESC
            """)
    List<Book> findAllWithCategoryOrderByBookIdDesc();
}