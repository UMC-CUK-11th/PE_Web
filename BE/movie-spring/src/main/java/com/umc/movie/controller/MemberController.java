package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.MemberInfoResponse;
import com.umc.movie.dto.MemberResponse;
import com.umc.movie.dto.MemberUpdateRequest;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(
        name = "회원",
        description = "회원가입과 내 정보 API"
)
public class MemberController {

    private final MemberService memberService;

    @Operation(
            summary = "닉네임 중복 확인",
            description = "회원가입 전에 해당 닉네임을 사용할 수 있는지 확인합니다."
    )
    @GetMapping("/members/nickname/{nickname}")
    public NicknameCheckResponse checkNickname(
            @PathVariable String nickname
    ) {
        return memberService.checkNickname(nickname);
    }

    @Operation(
            summary = "이메일 중복 확인",
            description = "회원가입 전에 해당 이메일을 사용할 수 있는지 확인합니다."
    )
    @GetMapping("/members/email/{email}")
    public EmailCheckResponse checkEmail(
            @PathVariable String email
    ) {
        return memberService.checkEmail(email);
    }

    @Operation(
            summary = "회원가입",
            description = "이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 토큰 없이 호출할 수 있는 공개 API입니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "회원가입 성공"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = "이미 사용 중인 이메일 또는 닉네임"
            )
    })
    @PostMapping("/members")
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(
            @Valid
            @RequestBody
            SignUpRequest request
    ) {
        MemberResponse response =
                memberService.signUp(request);

        return ResponseEntity.status(201)
                .body(
                        ApiResponse.created(
                                "회원가입에 성공했습니다.",
                                response
                        )
                );
    }

    @Operation(
            summary = "내 정보 조회",
            description = "JWT Access Token에 해당하는 로그인 회원의 정보를 조회합니다."
    )
    @SecurityRequirement(
            name = SwaggerConfig.BEARER_AUTH
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "내 정보 조회 성공"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "AUTH401_2 - 로그인이 필요한 요청"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "MEMBER404_1 - 해당 회원을 찾을 수 없음"
            )
    })
    @GetMapping("/members/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(
            @RequestAttribute(AuthInterceptor.MEMBER_ID)
            Long memberId
    ) {
        MemberInfoResponse response =
                memberService.getMyInfo(memberId);

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "회원 정보를 조회했습니다.",
                        response
                )
        );
    }

    @Operation(
            summary = "내 정보 수정",
            description = "JWT Access Token에 해당하는 로그인 회원의 닉네임을 수정합니다."
    )
    @SecurityRequirement(
            name = SwaggerConfig.BEARER_AUTH
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "회원 정보 수정 성공"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "AUTH401_2 - 로그인이 필요한 요청"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "MEMBER404_1 - 해당 회원을 찾을 수 없음"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = "MEMBER409_1 - 이미 사용 중인 닉네임"
            )
    })
    @PatchMapping("/members/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
            @RequestAttribute(AuthInterceptor.MEMBER_ID)
            Long memberId,

            @Valid
            @RequestBody
            MemberUpdateRequest request
    ) {
        MemberInfoResponse response =
                memberService.updateMyInfo(
                        memberId,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "회원 정보를 수정했습니다.",
                        response
                )
        );
    }
}