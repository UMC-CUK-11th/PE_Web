package com.wjsguddnr.umclib.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * MySQL의 book 테이블과 연결되는 JPA 엔티티다.
 * ddl-auto=validate이므로 테이블을 생성하거나 수정하지 않고 기존 테이블과 매핑이 일치하는지만 검사한다.
 * Getter는 Lombok이 만들고, JPA용 기본 생성자는 외부에서 함부로 호출하지 못하도록 protected로 제한한다.
 */
@Entity
@Table(name = "book")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Book {

    /**
     * book 테이블의 PK인 book_id와 연결된다.
     * Long은 BIGINT로 추론되며, IDENTITY 전략을 통해 MySQL의 AUTO_INCREMENT 값을 사용한다.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    private Long bookId;

    /**
     * book.category_id FK를 Category 객체와 연결한다.
     * SQL에서는 FK에 UNIQUE가 없으므로 여러 책이 같은 카테고리를 참조할 수 있고, 이것이 N:1 관계가 된다.
     * JPA에서는 이 관계를 @ManyToOne으로 표현하며, LAZY는 category가 실제로 필요할 때 조회한다.
     * nullable=false는 DB의 NOT NULL 제약이고, optional=false는 JPA 객체 관계가 필수임을 나타내는 별도 옵션이다.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    /**
     * String은 VARCHAR로 추론되며, length=100과 nullable=false가 VARCHAR(100) NOT NULL에 대응한다.
     */
    @Column(name = "title", nullable = false, length = 100)
    private String title;

    /**
     * 일반 String은 보통 VARCHAR(255)로 추론되지만 기존 컬럼은 TEXT이므로 타입을 직접 지정한다.
     * nullable=false가 없으므로 description은 NULL을 허용한다.
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Boolean은 MySQLDialect를 통해 TINYINT(1) 계열로 매핑되고 NULL은 허용하지 않는다.
     * true는 Java 객체의 초기값이며, DB의 DEFAULT 1은 SQL로 직접 INSERT할 때 적용되는 별도의 기본값이다.
     */
    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    /**
     * 새 책 생성에 필요한 값만 받는다.
     * bookId는 AUTO_INCREMENT이고 isAvailable은 true로 초기화되므로 매개변수에서 제외한다.
     */
    public Book(Category category, String title, String description) {
        this.category = category;
        this.title = title;
        this.description = description;
    }
}
