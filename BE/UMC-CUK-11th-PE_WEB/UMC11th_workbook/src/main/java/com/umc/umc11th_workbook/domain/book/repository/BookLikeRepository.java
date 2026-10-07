package com.umc.umc11th_workbook.domain.book.repository;

import com.umc.umc11th_workbook.domain.book.entity.BookLike;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookLikeRepository extends JpaRepository<BookLike, Long> {

}
