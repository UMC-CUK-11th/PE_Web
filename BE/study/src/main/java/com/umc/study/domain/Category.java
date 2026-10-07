package com.umc.study.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * category 테이블을 표현하는 JPA Entity입니다.
 * 한 카테고리가 여러 도서를 가질 수 있어 Book과 1:N 관계를 맺습니다.
 */
@Entity
@Table(name = "category")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @Column(nullable = false, length = 50)
    private String name;

    // 실제 FK는 book.category_id에 있으므로 Book.category가 연관관계의 주인입니다.
    @OneToMany(mappedBy = "category")
    private List<Book> books = new ArrayList<>();

    public Category(String name) {
        this.name = name;
    }
}
