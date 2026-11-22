package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.dto.*;
import com.umc.movie.service.RatingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

// 공통 응답 DTO 이름도 ApiResponse라서, Swagger의 @ApiResponse는 풀네임으로 씁니다.
// 공개 API(GET /members/{memberId}/ratings)가 섞여 있어 @SecurityRequirement는 메서드 단위로 붙입니다.
@RestController
@RequiredArgsConstructor
@Validated
@Tag(name = "평점", description = "영화 평점 등록/수정/삭제/조회 API")
public class RatingController {
  private final RatingService ratingService;

  @Operation(
      summary = "평점 등록 (토큰 필요)",
      description = """
          로그인한 회원이 영화에 평점(1~5점)과 한줄평을 남깁니다.
          회원 ID는 요청 본문이 아니라 Authorization 헤더의 Bearer 토큰에서 꺼냅니다.
          같은 영화에는 한 번만 평점을 남길 수 있습니다.
          """)
  @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
  @ApiResponses({
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 평점 등록 성공"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 입력 값의 형식과 범위 오류",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "COMMON400", "message": "입력 값의 형식과 범위를 확인해 주세요.", "result": null}"""))),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 없음 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 만료된 토큰",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "AUTH401_2", "message": "인증 토큰이 필요합니다.", "result": null}"""))),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 존재하지 않는 회원",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "MEMBER404_1", "message": "존재하지 않는 회원입니다.", "result": null}"""))),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "RATING409_1 이미 평점을 남긴 영화",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "RATING409_1", "message": "이미 이 영화에 평점을 남기셨습니다.", "result": null}""")))
  })
  @PostMapping("/ratings")
  public ResponseEntity<ApiResponse<RatingResponse>> create(
      @RequestAttribute Long memberId, @Valid @RequestBody CreateRatingRequest request) {
    return ResponseEntity.status(201)
        .body(ApiResponse.created("평점 등록에 성공했습니다.", ratingService.create(memberId, request)));
  }

  @Operation(
      summary = "평점 수정 (토큰 필요)",
      description = """
          내가 남긴 평점의 점수와 한줄평을 수정합니다.
          다른 회원의 평점은 수정할 수 없습니다(RATING403_1).
          """)
  @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
  @ApiResponses({
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 평점 수정 성공"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 입력 값의 형식과 범위 오류"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 없음 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 만료된 토큰",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "AUTH401_2", "message": "인증 토큰이 필요합니다.", "result": null}"""))),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1 본인의 평점이 아님",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "RATING403_1", "message": "본인의 평점만 수정하거나 삭제할 수 있습니다.", "result": null}"""))),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 존재하지 않는 회원 / RATING404_1 존재하지 않는 평점",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "RATING404_1", "message": "존재하지 않는 평점입니다.", "result": null}""")))
  })
  @PatchMapping("/ratings/{ratingId}")
  public ApiResponse<Void> update(
      @RequestAttribute Long memberId,
      @PathVariable @Positive Long ratingId,
      @Valid @RequestBody UpdateRatingRequest request) {
    ratingService.update(ratingId, memberId, request);
    return ApiResponse.ok("평점 수정에 성공했습니다.", null);
  }

  @Operation(
      summary = "평점 삭제 (토큰 필요)",
      description = """
          내가 남긴 평점을 삭제합니다.
          다른 회원의 평점은 삭제할 수 없습니다(RATING403_1).
          """)
  @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
  @ApiResponses({
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 평점 삭제 성공"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 ratingId 형식 오류"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 없음 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 만료된 토큰",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "AUTH401_2", "message": "인증 토큰이 필요합니다.", "result": null}"""))),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1 본인의 평점이 아님",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "RATING403_1", "message": "본인의 평점만 수정하거나 삭제할 수 있습니다.", "result": null}"""))),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 존재하지 않는 회원 / RATING404_1 존재하지 않는 평점",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "RATING404_1", "message": "존재하지 않는 평점입니다.", "result": null}""")))
  })
  @DeleteMapping("/ratings/{ratingId}")
  public ApiResponse<Void> delete(
      @RequestAttribute Long memberId, @PathVariable @Positive Long ratingId) {
    ratingService.delete(ratingId, memberId);
    return ApiResponse.ok("평점 삭제에 성공했습니다.", null);
  }

  @Operation(
      summary = "회원별 평점 목록 조회 (공개)",
      description = """
          특정 회원이 남긴 평점 목록을 최신순으로 조회합니다.
          토큰 없이 누구나 호출할 수 있는 공개 API입니다.
          응답은 공통 응답 형식이 아닌 평점 배열입니다.
          """)
  @ApiResponses({
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "평점 목록 조회 성공 (배열)"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 memberId 형식 오류"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "COMMON404 존재하지 않는 회원",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "COMMON404", "message": "요청한 리소스를 확인해 주세요.", "result": null}""")))
  })
  @GetMapping("/members/{memberId}/ratings")
  public List<RatingResponse> getRatings(@PathVariable @Positive Long memberId) {
    return ratingService.getRatingsByMember(memberId);
  }
}
