package com.umc.movie.controller;

import com.umc.movie.dto.*;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.umc.movie.config.OpenApiConfig.BEARER_AUTH;
import static com.umc.movie.config.OpenApiConfig.UNAUTHORIZED;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;

    @Operation(summary = "닉네임 중복 확인", description = "닉네임을 사용할 수 있는지 확인함. 토큰이 필요하지 않음.")
    @GetMapping("/nickname/{nickname}")
    public NicknameCheckResponse checkNickname(@PathVariable String nickname) {
        return memberService.checkNickname(nickname);
    }

    @Operation(summary = "이메일 중복 확인", description = "이메일을 사용할 수 있는지 확인함. 토큰이 필요하지 않음.")
    @GetMapping("/email/{email}")
    public EmailCheckResponse checkEmail(@PathVariable String email) {
        return memberService.checkEmail(email);
    }

    @Operation(summary = "회원가입", description = "이메일, 비밀번호, 닉네임으로 가입함. 토큰이 필요하지 않음.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "회원가입 성공")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 잘못된 요청 본문 또는 입력값 / COMMON400 비밀번호가 72바이트를 초과함",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "MEMBER4091 중복 이메일 / MEMBER4092 중복 닉네임 / COMMON4091 DB 제약 위반",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(
            @Valid @RequestBody SignUpRequest request
    ) {
        MemberResponse response = memberService.signUp(request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("회원가입에 성공했습니다.", response));
    }

    @Operation(summary = "내 정보 조회", description = "로그인한 회원의 정보를 조회함.", security = @SecurityRequirement(name = BEARER_AUTH))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "내 정보 조회 성공")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", ref = UNAUTHORIZED)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원을 찾을 수 없음",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        MemberInfoResponse response = memberService.getMyInfo(memberId);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 조회했습니다.", response));
    }

    @Operation(summary = "내 정보 수정", description = "로그인한 회원의 닉네임을 수정함.", security = @SecurityRequirement(name = BEARER_AUTH))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "내 정보 수정 성공")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 잘못된 요청 본문 또는 닉네임",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", ref = UNAUTHORIZED)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원을 찾을 수 없음",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "MEMBER409_1 중복 닉네임 / COMMON4091 DB 제약 위반",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid MemberUpdateRequest request
    ) {
        MemberInfoResponse response = memberService.updateMyInfo(memberId, request);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 수정했습니다.", response));
    }
}
