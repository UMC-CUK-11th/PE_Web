package com.umc.study.repository;

import com.umc.study.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Category Entity의 조회를 담당합니다.
 * POST /books에서 전달된 categoryId가 실제로 존재하는지 확인할 때 사용합니다.
 */
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
