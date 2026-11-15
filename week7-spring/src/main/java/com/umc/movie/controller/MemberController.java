package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.MemberInfoResponse;
import com.umc.movie.dto.MemberResponse;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.umc.movie.dto.MemberUpdateRequest;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;

    // 닉네임 중복 확인
    @GetMapping("/nickname/{nickname}")
    public NicknameCheckResponse checkNickname(
            @PathVariable String nickname
    ) {
        return memberService.checkNickname(nickname);
    }

    // 이메일 중복 확인
    @GetMapping("/email/{email}")
    public EmailCheckResponse checkEmail(
            @PathVariable String email
    ) {
        return memberService.checkEmail(email);
    }

    // 회원가입
    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(
            @Valid @RequestBody SignUpRequest request
    ) {
        MemberResponse response = memberService.signUp(request);

        return ResponseEntity.status(201)
                .body(ApiResponse.created(
                        "회원가입에 성공했습니다.",
                        response
                ));
    }

    // 로그인한 회원 정보 조회
    @GetMapping("/me")
    public ResponseEntity<MemberInfoResponse> getMyInfo(
            HttpServletRequest request
    ) {
        Long memberId = (Long) request.getAttribute("memberId");

        return ResponseEntity.ok(
                memberService.getMyInfo(memberId)
        );
    }

    // 로그인한 회원 정보 수정
    @PatchMapping("/me")
    public ResponseEntity<MemberInfoResponse> updateMyInfo(
            HttpServletRequest request,
            @Valid @RequestBody MemberUpdateRequest updateRequest
    ) {
        Long memberId = (Long) request.getAttribute("memberId");

        return ResponseEntity.ok(
                memberService.updateMyInfo(memberId, updateRequest)
        );
    }
}