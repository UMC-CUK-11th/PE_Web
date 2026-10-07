package com.umc.umc11th_workbook.domain.member.controller;

import com.umc.umc11th_workbook.domain.book.dto.response.BookResDto.BookResponse;
import com.umc.umc11th_workbook.domain.member.dto.response.MemberResDto.MemberResponse;
import com.umc.umc11th_workbook.domain.member.service.MemberService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // 1. "나는 데이터를 JSON으로 서빙하는 API 카운터야!"
@RequestMapping("/members") // 2. 이 컨트롤러로 들어오는 요청의 기본 주소는 /members
@RequiredArgsConstructor
public class MemberController {
  private final MemberService memberService;

  // HTTP GET 방식으로 /members 요청이 들어왔을 때 이 메서드가 실행됩니다.
  @GetMapping
  public List<MemberResponse> getMembers() {
    return memberService.getAllMembers();
  }
}
