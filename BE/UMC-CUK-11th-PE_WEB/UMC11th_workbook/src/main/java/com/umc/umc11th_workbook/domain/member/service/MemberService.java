package com.umc.umc11th_workbook.domain.member.service;

import com.umc.umc11th_workbook.domain.member.dto.response.MemberResDto.MemberResponse;
import com.umc.umc11th_workbook.domain.member.repository.MemberRepository;
import com.umc.umc11th_workbook.domain.member.repository.NotificationAllowListRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberService {
  private MemberRepository memberRepository;

  @Transactional(readOnly = true)
  public List<MemberResponse> getAllMembers() {
    // 지금은 별도 가공 없이 창고지기가 가져온 회원 목록을 그대로 반환합니다.
    return memberRepository.findAll().stream()
        .map(MemberResponse::from)
        .toList();
  }
}
