package com.umc11th.controller;

import com.umc11th.config.OpenApiConfig;
import com.umc11th.dto.ApiResponse;
import com.umc11th.dto.EmailCheckResponse;
import com.umc11th.dto.MemberResponse;
import com.umc11th.dto.MemberInfoResponse;
import com.umc11th.dto.MemberUpdateRequest;
import com.umc11th.dto.NicknameCheckResponse;
import com.umc11th.dto.SignUpRequest;
import com.umc11th.service.MemberService;
import com.umc11th.auth.LoginMember;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
@Tag(name = "회원", description = "회원가입, 중복 확인과 내 정보 API")
public class MemberController {

    private final MemberService memberService;

    @Operation(summary = "닉네임 사용 가능 여부 확인", description = "토큰 없이 호출하는 공개 API입니다.")
    @GetMapping("/nickname/{nickname}")
    public NicknameCheckResponse checkNickname(@PathVariable String nickname) {
        return memberService.checkNickname(nickname);
    }

    @Operation(summary = "이메일 사용 가능 여부 확인", description = "토큰 없이 호출하는 공개 API입니다.")
    @GetMapping("/email/{email}")
    public EmailCheckResponse checkEmail(@PathVariable String email) {
        return memberService.checkEmail(email);
    }

    @Operation(
            summary = "회원가입",
            description = "이메일, 비밀번호, 닉네임으로 회원을 등록하는 공개 API입니다."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "201", description = "COMMON201 - 회원가입 성공"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "409", description = "MEMBER4091 또는 MEMBER4092 - 이메일/닉네임 중복"
    )
    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(
            @Valid @RequestBody SignUpRequest request
    ) {
        MemberResponse response = memberService.signUp(request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("회원가입에 성공했습니다.", response));
    }

    @Operation(summary = "내 정보 조회", description = "토큰으로 식별한 회원의 정보를 조회합니다.")
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200", description = "COMMON200 - 조회 성공"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401", description = "AUTH401_2/3/4 - 토큰 누락, 위조 또는 만료"
    )
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(
            @Parameter(hidden = true) @LoginMember Long memberId
    ) {
        MemberInfoResponse response = memberService.getMyInfo(memberId);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 조회했습니다.", response));
    }

    @Operation(summary = "내 정보 수정", description = "토큰의 회원 닉네임을 변경합니다.")
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200", description = "COMMON200 - 수정 성공"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "409", description = "MEMBER409_1 - 이미 사용 중인 닉네임"
    )
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
            @Parameter(hidden = true) @LoginMember Long memberId,
            @RequestBody @Valid MemberUpdateRequest request
    ) {
        MemberInfoResponse response = memberService.updateMyInfo(memberId, request);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 수정했습니다.", response));
    }
}
