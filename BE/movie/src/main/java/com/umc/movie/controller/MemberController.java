package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.AvailabilityResponse;
import com.umc.movie.dto.MemberResponse;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.dto.MemberInfoResponse;
import com.umc.movie.dto.UpdateMemberRequest;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import com.umc.movie.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/me")
    public ApiResponse<MemberInfoResponse> getMe(@RequestAttribute("memberId") Long memberId) {
        return ApiResponse.ok("내 정보를 조회했습니다.", memberService.getMe(memberId));
    }

    @PatchMapping("/me")
    public ApiResponse<MemberInfoResponse> updateMe(@RequestAttribute("memberId") Long memberId,
                                                  @Valid @RequestBody UpdateMemberRequest request) {
        return ApiResponse.ok("내 정보를 수정했습니다.", memberService.updateMe(memberId, request));
    }

    @GetMapping("/nickname/{nickname}")
    public AvailabilityResponse checkNickname(@PathVariable String nickname) {
        return memberService.checkNickname(nickname);
    }

    @GetMapping("/email/{email}")
    public AvailabilityResponse checkEmail(@PathVariable String email) {
        return memberService.checkEmail(email);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(
            @Valid @RequestBody SignUpRequest request
    ) {
        MemberResponse response = memberService.signUp(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("회원가입에 성공했습니다.", response));
    }
}
