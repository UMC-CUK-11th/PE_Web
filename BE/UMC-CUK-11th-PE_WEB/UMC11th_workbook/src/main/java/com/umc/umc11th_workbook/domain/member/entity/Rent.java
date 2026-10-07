package com.umc.umc11th_workbook.domain.member.entity;

import com.umc.umc11th_workbook.domain.book.entity.Book;
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

@Entity
@Table(name = "rent")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Rent {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "rent_id")
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "member_id", nullable = false)
  private Member memberId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "book_id", nullable = false)
  private Book bookId;

  public Rent(Long id, Member memberId, Book bookId) {
    this.id = id;
    this.memberId = memberId;
    this.bookId = bookId;
  }

  public Long getId() {
    return id;
  }

  public Member getMemberId() {
    return memberId;
  }

  public Book getBookId() {
    return bookId;
  }
}
