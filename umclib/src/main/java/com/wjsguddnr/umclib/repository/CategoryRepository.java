package com.wjsguddnr.umclib.repository;

import com.wjsguddnr.umclib.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Category 엔티티의 기본 CRUD와 categoryId를 이용한 조회를 담당한다.
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
