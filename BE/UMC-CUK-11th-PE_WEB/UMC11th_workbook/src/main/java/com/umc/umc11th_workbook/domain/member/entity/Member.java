package com.umc.umc11th_workbook.domain.member.entity;

import com.umc.umc11th_workbook.domain.member.entity.enums.Gender;
import com.umc.umc11th_workbook.domain.member.entity.enums.SocialProvider;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "member")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "member_id")
  private Long memberId;

  @Column(nullable = false, length = 100)
  private String email;

  @Column(nullable = false, length = 100)
  private String password;

  @Column(nullable = false, length = 100)
  private String name;

  @Column(nullable = false, length = 100)
  private String phoneNumber;

  @Column(nullable = false, length = 100)
  private String nickname;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Gender gender;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private SocialProvider socialProvider;

  @Column(nullable = false, length = 100)
  private String socialUid;

  @Builder
  public Member(String email, String password, String name, String phoneNumber, String nickname, Gender gender, SocialProvider socialProvider, String socialUid) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.nickname = nickname;
    this.gender = gender;
    this.socialProvider = socialProvider;
    this.socialUid = socialUid;
  }

    public Long getId() {
        return memberId;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getNickname() {
        return nickname;
    }
}
