package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.dto.*;
import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

// 공개 API(회원가입, 중복 확인)와 토큰 API(/members/me)가 섞여 있어
// @SecurityRequirement는 클래스가 아니라 메서드 단위로 붙입니다.
@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
@Validated
@Tag(name = "회원", description = "회원가입, 중복 확인, 내 정보 조회/수정 API")
public class MemberController {
  private final MemberService memberService;

  @Operation(
      summary = "내 정보 조회 (토큰 필요)",
      description = "Authorization 헤더의 Bearer 토큰으로 로그인한 회원 본인의 정보를 조회합니다.")
  @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
  @ApiResponses({
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 회원 조회 성공"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 없음 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 만료된 토큰",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "AUTH401_2", "message": "인증 토큰이 필요합니다.", "result": null}"""))),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 존재하지 않는 회원",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "MEMBER404_1", "message": "존재하지 않는 회원입니다.", "result": null}""")))
  })
  @GetMapping("/me")
  public ApiResponse<MyMemberResponse> me(@RequestAttribute Long memberId) {
    return ApiResponse.ok("회원 조회에 성공했습니다.", memberService.me(memberId));
  }

  @Operation(
      summary = "내 정보 수정 (토큰 필요)",
      description = """
          로그인한 회원 본인의 닉네임(2~12자)을 수정합니다.
          다른 회원이 이미 쓰는 닉네임으로는 바꿀 수 없습니다(MEMBER409_1).
          """)
  @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
  @ApiResponses({
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 회원 수정 성공"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 닉네임 형식 오류",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "COMMON400", "message": "입력 값의 형식과 범위를 확인해 주세요.", "result": null}"""))),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 없음 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 만료된 토큰",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "AUTH401_2", "message": "인증 토큰이 필요합니다.", "result": null}"""))),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 존재하지 않는 회원"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "MEMBER409_1 이미 사용 중인 닉네임",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "MEMBER409_1", "message": "이미 사용 중인 닉네임입니다.", "result": null}""")))
  })
  @PatchMapping("/me")
  public ApiResponse<MyMemberResponse> updateMe(@RequestAttribute Long memberId,
      @Valid @RequestBody UpdateMemberRequest request) {
    return ApiResponse.ok("회원 수정에 성공했습니다.", memberService.updateMe(memberId, request));
  }

  @Operation(
      summary = "회원가입 (공개)",
      description = """
          이메일, 비밀번호, 닉네임으로 회원가입합니다. 토큰 없이 호출할 수 있습니다.
          비밀번호는 영문 대/소문자, 숫자, 특수문자를 모두 포함한 8~72자여야 합니다.
          """)
  @ApiResponses({
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 회원가입 성공"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 입력 값의 형식과 범위 오류"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "MEMBER4091 이미 사용 중인 이메일 / MEMBER4092 이미 사용 중인 닉네임",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "MEMBER4091", "message": "이미 사용 중인 이메일입니다.", "result": null}""")))
  })
  @PostMapping
  public ResponseEntity<ApiResponse<MemberResponse>> signUp(
      @Valid @RequestBody SignUpRequest request) {
    return ResponseEntity.status(201)
        .body(ApiResponse.created("회원가입에 성공했습니다.", memberService.signUp(request)));
  }

  @Operation(summary = "닉네임 중복 확인 (공개)", description = "닉네임 사용 가능 여부를 확인합니다. 토큰 없이 호출할 수 있습니다.")
  @GetMapping("/nickname/{nickname}")
  public NicknameCheckResponse checkNickname(
      @PathVariable @NotBlank @Size(max = 50) String nickname) {
    return memberService.checkNickname(nickname);
  }

  @Operation(summary = "이메일 중복 확인 (공개)", description = "이메일 사용 가능 여부를 확인합니다. 토큰 없이 호출할 수 있습니다.")
  @GetMapping("/email/{email}")
  public EmailCheckResponse checkEmail(
      @PathVariable @NotBlank @Email @Size(max = 254) String email) {
    return memberService.checkEmail(email);
  }
}
