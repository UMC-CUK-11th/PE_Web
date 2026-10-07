package com.umc.umc11th_workbook.domain.member.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notification_allow_list")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NotificationAllowList {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "notification_allow_list_id")
  private Long notificationAllowListId;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "member_id", nullable = false)
  private Member member;

  @Column(nullable = false)
  private Boolean isAllowNotice = true; // 공지사항 알림 기본 허용

  @Column(nullable = false)
  private Boolean isAllowBookReturn = true; // 도서 반납 알림 기본 허용

  @Column(nullable = false)
  private Boolean isAllowMarketing = false; // 마케팅 알림 기본 거부 (법적 권장사항)

  @Builder
  public NotificationAllowList(Member member, Boolean isAllowNotice, Boolean isAllowBookReturn, Boolean isAllowMarketing) {
    this.member = member;

    // 값이 외부에서 주입되었을 때만 덮어쓰고, 안 들어오면 위에서 설정한 기본값을 유지합니다.
    if (isAllowNotice != null) this.isAllowNotice = isAllowNotice;
    if (isAllowBookReturn != null) this.isAllowBookReturn = isAllowBookReturn;
    if (isAllowMarketing != null) this.isAllowMarketing = isAllowMarketing;
  }

  // 알림 설정을 변경할 때 사용할 비즈니스 편의 메서드 (Setter 대용)
  public void updateMarketingAllow(boolean isAllow) {
    this.isAllowMarketing = isAllow;
  }

  public Long getNotificationAllowListId() {
      return notificationAllowListId;
  }

  public void setNotificationAllowListId(Long notificationAllowListId) {
      this.notificationAllowListId = notificationAllowListId;
  }
}
