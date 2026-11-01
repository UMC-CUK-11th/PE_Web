package com.umc.movie.controller;
import com.umc.movie.dto.AvailabilityResponse;
import com.umc.movie.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {
    private final MemberService memberService;
    @GetMapping("/nickname/{nickname}")
    public AvailabilityResponse checkNickname(@PathVariable String nickname) {
        return memberService.checkNickname(nickname);
    }
    @GetMapping("/email/{email}")
    public AvailabilityResponse checkEmail(@PathVariable String email) {
        return memberService.checkEmail(email);
    }
}
