package com.wjsguddnr.umclib.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * MySQL의 category 테이블과 연결되는 JPA 엔티티다.
 * ddl-auto=validate이므로 테이블을 생성하거나 수정하지 않고 기존 테이블과 매핑이 일치하는지만 검사한다.
 * Getter는 Lombok이 만들고, JPA용 기본 생성자는 외부에서 함부로 호출하지 못하도록 protected로 제한한다.
 */
@Entity
@Table(name = "category")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Category {

    /**
     * category 테이블의 PK인 category_id와 연결된다.
     * Long은 BIGINT로 추론되며, IDENTITY 전략을 통해 MySQL의 AUTO_INCREMENT 값을 사용한다.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    /**
     * String은 VARCHAR로 추론되며, length=50과 nullable=false가 VARCHAR(50) NOT NULL에 대응한다.
     */
    @Column(name = "name", nullable = false, length = 50)
    private String name;

    /**
     * 새 카테고리 생성에 필요한 이름만 받는다.
     * categoryId는 AUTO_INCREMENT이므로 생성자에서 직접 받지 않는다.
     */
    public Category(String name) {
        this.name = name;
    }
}
