package com.umc.umc11th_workbook.domain.member.dto.response;

import com.umc.umc11th_workbook.domain.member.entity.Member;

public class MemberResDto {
  public record MemberResponse(
      Long memberId,
      String name,
      String email
  ) {
    public static MemberResponse from(Member member) {
      return new MemberResponse(
          member.getMemberId(),
          member.getName(),
          member.getEmail()
      );
    }
  }
}
