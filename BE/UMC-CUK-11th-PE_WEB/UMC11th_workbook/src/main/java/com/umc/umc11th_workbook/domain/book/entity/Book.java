package com.umc.umc11th_workbook.domain.book.entity;

import com.umc.umc11th_workbook.domain.category.entity.Category;
import com.umc.umc11th_workbook.domain.member.entity.Rent;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "book")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Book {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "book_id")
  private Long bookId;

  @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<BookCategory> bookCategories = new ArrayList<>();

  @Column(nullable = false, length = 100)
  private String title;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(name = "is_available", nullable = false)
  private Boolean isAvailable = true;

  @Builder
  public Book(String title, String description) {
    this.title = title;
    this.description = description;
  }

  public void addBookCategory(BookCategory bookCategory) {
    this.bookCategories.add(bookCategory);
    // 무한 루프 방지를 위한 로직 생략 (필요시 BookCategory 쪽에도 추가)
  }
}