package com.umc.umc11th_workbook.domain.member.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // 1. "나는 데이터를 JSON으로 서빙하는 API 카운터야!"
@RequestMapping("/notification-allow-list") // 2. 이 컨트롤러로 들어오는 요청의 기본 주소는 /notification-allow-list
@RequiredArgsConstructor
public class NotificationAllowListController {

}
