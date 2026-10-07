package com.umc.umc11th_workbook.domain.book.repository;

import com.umc.umc11th_workbook.domain.book.entity.Book;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
  List<Book> findAllByOrderByBookIdDesc();
  List<Book> findByBookCategories_Category_CategoryId(Long categoryId);
}