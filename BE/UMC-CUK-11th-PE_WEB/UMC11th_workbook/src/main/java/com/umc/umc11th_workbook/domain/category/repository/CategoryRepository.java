package com.umc.umc11th_workbook.domain.category.repository;

import com.umc.umc11th_workbook.domain.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}
