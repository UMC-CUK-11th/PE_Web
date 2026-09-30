package com.umc.umc11th_workbook.domain.book.repository;

import com.umc.umc11th_workbook.domain.book.entity.BookCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookCategoryRepository extends JpaRepository<BookCategory, Long> {

}
